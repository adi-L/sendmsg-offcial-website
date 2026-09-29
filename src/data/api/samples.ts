import type { Endpoint, Json, Variant } from "./types"
import { API_BASE } from "./index"

/**
 * Generates request samples from the endpoint definition.
 *
 * Hand-written samples across five languages and twenty-six endpoints would
 * be roughly a hundred and fifty blocks to keep in step with each other.
 * Generating them means a change to an endpoint reaches every language at
 * once, and none of them can quietly go stale.
 */

export const LANGUAGES = ["curl", "php", "csharp", "node", "python"] as const
export type Language = (typeof LANGUAGES)[number]

export const LANGUAGE_LABELS: Record<Language, string> = {
  curl: "cURL",
  php: "PHP",
  csharp: "C#",
  node: "Node",
  python: "Python",
}

export interface SampleContext {
  /** The reader's own SiteID, once they enter one. */
  siteId?: string
  /** The reader's own token, once they enter one. */
  token?: string
}

const PLACEHOLDER_TOKEN = "YOUR_TOKEN"

const tokenFor = (ctx: SampleContext) => ctx.token?.trim() || PLACEHOLDER_TOKEN

const json = (value: Json, indent = 2) => JSON.stringify(value, null, indent)

/** Query string built from the endpoint's documented parameters. */
function queryFor(endpoint: Endpoint, ctx: SampleContext): string {
  if (!endpoint.query?.length) return ""
  const pairs = endpoint.query.map((q) => {
    const value =
      q.name === "siteID" && ctx.siteId ? ctx.siteId : q.example ?? `YOUR_${q.name.toUpperCase()}`
    return `${q.name}=${value}`
  })
  return `?${pairs.join("&")}`
}

function urlFor(endpoint: Endpoint, ctx: SampleContext): string {
  return `${API_BASE}${endpoint.path}${queryFor(endpoint, ctx)}`
}

/** The token request carries the reader's real SiteID once they supply one. */
function bodyFor(endpoint: Endpoint, variant: Variant, ctx: SampleContext): Json | undefined {
  const body = variant.requestExample
  if (body === undefined) return undefined
  if (endpoint.id === "token" && ctx.siteId && body && typeof body === "object" && !Array.isArray(body)) {
    const parsed = Number(ctx.siteId)
    return { ...body, siteID: Number.isFinite(parsed) ? parsed : ctx.siteId }
  }
  return body
}

function curl(endpoint: Endpoint, variant: Variant, ctx: SampleContext): string {
  const lines = [`curl -X ${endpoint.method} '${urlFor(endpoint, ctx)}' \\`]
  if (endpoint.auth) lines.push(`  -H 'Authorization: ${tokenFor(ctx)}' \\`)
  const body = bodyFor(endpoint, variant, ctx)
  if (body !== undefined) {
    lines.push(`  -H 'Content-Type: application/json' \\`)
    lines.push(`  -d '${json(body)}'`)
  } else {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ \\$/, "")
  }
  return lines.join("\n")
}

function php(endpoint: Endpoint, variant: Variant, ctx: SampleContext): string {
  const body = bodyFor(endpoint, variant, ctx)
  const out: string[] = ["<?php", ""]
  const headers = ["'Content-Type: application/json'"]
  if (endpoint.auth) headers.push(`'Authorization: ${tokenFor(ctx)}'`)

  if (body !== undefined) {
    out.push(`$payload = json_encode(${phpValue(body, 0)}, JSON_UNESCAPED_UNICODE);`, "")
    // The blueprint is explicit that PHP clients must send Content-Length.
    headers.push("'Content-Length: ' . strlen($payload)")
  }

  out.push(`$ch = curl_init('${urlFor(endpoint, ctx)}');`)
  out.push(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${endpoint.method}');`)
  out.push("curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);")
  out.push(`curl_setopt($ch, CURLOPT_HTTPHEADER, [`)
  out.push(headers.map((h) => `    ${h},`).join("\n"))
  out.push("]);")
  if (body !== undefined) out.push("curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);")
  out.push("", "$response = curl_exec($ch);", "curl_close($ch);", "", "echo $response;")
  return out.join("\n")
}

/** PHP array literals, so the sample reads like PHP rather than pasted JSON. */
function phpValue(value: Json, depth: number): string {
  const pad = "    ".repeat(depth + 1)
  const closePad = "    ".repeat(depth)
  if (Array.isArray(value)) {
    if (!value.length) return "[]"
    return `[\n${value.map((v) => `${pad}${phpValue(v, depth + 1)}`).join(",\n")}\n${closePad}]`
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value)
    if (!entries.length) return "[]"
    return `[\n${entries
      .map(([k, v]) => `${pad}'${k}' => ${phpValue(v, depth + 1)}`)
      .join(",\n")}\n${closePad}]`
  }
  if (typeof value === "string") return `'${value.replace(/'/g, "\\'")}'`
  if (value === null) return "null"
  return String(value)
}

function node(endpoint: Endpoint, variant: Variant, ctx: SampleContext): string {
  const body = bodyFor(endpoint, variant, ctx)
  const headers: string[] = []
  if (endpoint.auth) headers.push(`    Authorization: '${tokenFor(ctx)}',`)
  if (body !== undefined) headers.push(`    'Content-Type': 'application/json',`)

  const out = [`const response = await fetch('${urlFor(endpoint, ctx)}', {`]
  out.push(`  method: '${endpoint.method}',`)
  if (headers.length) out.push("  headers: {", ...headers, "  },")
  if (body !== undefined) out.push(`  body: JSON.stringify(${json(body)}),`)
  out.push("})", "", "console.log(await response.json())")
  return out.join("\n")
}

function python(endpoint: Endpoint, variant: Variant, ctx: SampleContext): string {
  const body = bodyFor(endpoint, variant, ctx)
  const out = ["import requests", ""]
  const args = [`    '${urlFor(endpoint, ctx)}',`]
  if (endpoint.auth) args.push(`    headers={'Authorization': '${tokenFor(ctx)}'},`)
  if (body !== undefined) {
    out.push(`payload = ${pythonValue(body, 0)}`, "")
    args.push("    json=payload,")
  }
  out.push(`response = requests.${endpoint.method.toLowerCase()}(`, ...args, ")", "", "print(response.json())")
  return out.join("\n")
}

/** Python literals differ from JSON in exactly three places. */
function pythonValue(value: Json, depth: number): string {
  const pad = "    ".repeat(depth + 1)
  const closePad = "    ".repeat(depth)
  if (Array.isArray(value)) {
    if (!value.length) return "[]"
    return `[\n${value.map((v) => `${pad}${pythonValue(v, depth + 1)}`).join(",\n")}\n${closePad}]`
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value)
    if (!entries.length) return "{}"
    return `{\n${entries
      .map(([k, v]) => `${pad}'${k}': ${pythonValue(v, depth + 1)}`)
      .join(",\n")}\n${closePad}}`
  }
  if (typeof value === "string") return `'${value.replace(/'/g, "\\'")}'`
  if (value === true) return "True"
  if (value === false) return "False"
  if (value === null) return "None"
  return String(value)
}

function csharp(endpoint: Endpoint, variant: Variant, ctx: SampleContext): string {
  const body = bodyFor(endpoint, variant, ctx)
  const out = ["using var client = new HttpClient();"]
  if (endpoint.auth) {
    out.push(`client.DefaultRequestHeaders.Add("Authorization", "${tokenFor(ctx)}");`)
  }
  out.push("")
  if (body !== undefined) {
    const escaped = json(body).replace(/"/g, '""')
    out.push(`var payload = @"${escaped}";`)
    out.push(`var content = new StringContent(payload, Encoding.UTF8, "application/json");`)
    out.push("")
    out.push(
      endpoint.method === "POST"
        ? `var response = await client.PostAsync("${urlFor(endpoint, ctx)}", content);`
        : `var response = await client.GetAsync("${urlFor(endpoint, ctx)}");`
    )
  } else {
    out.push(
      endpoint.method === "POST"
        ? `var response = await client.PostAsync("${urlFor(endpoint, ctx)}", null);`
        : `var response = await client.GetAsync("${urlFor(endpoint, ctx)}");`
    )
  }
  out.push("", "Console.WriteLine(await response.Content.ReadAsStringAsync());")
  return out.join("\n")
}

const GENERATORS: Record<Language, (e: Endpoint, v: Variant, c: SampleContext) => string> = {
  curl,
  php,
  csharp,
  node,
  python,
}

export function buildSample(
  endpoint: Endpoint,
  variant: Variant,
  language: Language,
  ctx: SampleContext = {}
): string {
  return GENERATORS[language](endpoint, variant, ctx)
}

export { urlFor as sampleUrl }
