import {
  API_BASE,
  API_VERSION,
  SUPPORT_EMAIL,
  conventions,
  endpoints,
  endpointsByGroup,
  groups,
  schemaById,
  statusCodes,
  support,
  smsRules,
} from "./index"
import type { Endpoint, Variant } from "./types"
import { buildSample, LANGUAGES, LANGUAGE_LABELS } from "./samples"

/**
 * The machine-readable faces of the reference.
 *
 * Apiary renders as a JavaScript application, so an agent fetching its URL
 * receives a page title and nothing else -- the reference is effectively
 * invisible to anything that does not run a browser. These artifacts exist so
 * that never becomes true of this page, and they are generated from the same
 * data the page renders, so they cannot describe a different API.
 */

const SITE = "https://sendmsg.co.il"

const describe = (e: Endpoint) => `${e.method} ${e.path} — ${e.title}`

/** Short index. The convention is that an agent reads this one first. */
export function buildLlmsTxt(): string {
  const out: string[] = [
    `# SendMsg API ${API_VERSION}`,
    "",
    "> REST API for managing subscribers and mailing lists and for sending",
    "> email and SMS campaigns. All requests are JSON over HTTPS.",
    "",
    `Base URL: ${API_BASE}`,
    `Authentication: POST /token with siteID and password, then send the returned`,
    `token as the Authorization header. Tokens last 12 hours.`,
    `Full reference in one file: ${SITE}/api/llms-full.txt`,
    `Machine description: ${SITE}/api/openapi.json`,
    "",
  ]

  out.push("## Introduction", "")
  out.push(`- [API Support](${SITE}/api/#api-support)`)
  out.push(`- [About SMS](${SITE}/api/#about-sms)`)
  out.push(`- [Status codes](${SITE}/api/#status-codes)`)
  out.push(`- [Important](${SITE}/api/#important)`)
  out.push("")

  for (const { group, endpoints: list } of endpointsByGroup) {
    out.push(`## ${group.title}`)
    if (group.description) out.push("", group.description)
    out.push("")
    for (const e of list) {
      out.push(`- [${describe(e)}](${SITE}/api/#${e.id})`)
    }
    out.push("")
  }

  out.push("## Notes", "")
  for (const c of conventions) out.push(`- ${c.title}: ${c.body}`)
  out.push(
    "",
    "## Support",
    "",
    support.requirement,
    "",
    `Template: ${support.templateUrl}`,
    `Email: ${support.email}`,
    ""
  )
  return out.join("\n")
}

function variantMarkdown(e: Endpoint, v: Variant, showLabel: boolean): string[] {
  const out: string[] = []
  if (showLabel) out.push(`#### ${v.label}`, "")
  if (v.description) out.push(v.description, "")

  for (const id of v.bodySchemas ?? []) {
    const schema = schemaById.get(id)
    if (!schema) continue
    out.push(`**${schema.title}**`, "")
    if (schema.description) out.push(schema.description, "")
    out.push("| Field | Type | Required | Description |", "| --- | --- | --- | --- |")
    for (const f of schema.fields) {
      const desc = [f.description, f.default ? `Default: ${f.default}.` : "", f.note ?? ""]
        .filter(Boolean)
        .join(" ")
        .replace(/\|/g, "\\|")
      out.push(`| \`${f.name}\` | ${f.type ?? ""} | ${f.required ? "yes" : "no"} | ${desc} |`)
    }
    out.push("")
  }

  if (v.requestExample !== undefined) {
    out.push("Request:", "", "```json", JSON.stringify(v.requestExample, null, 2), "```", "")
  }

  // One worked sample per variant rather than all five languages, which would
  // bloat the file without telling an agent anything new about the API.
  out.push("```bash", buildSample(e, v, "curl", {}), "```", "")

  if (v.responseExample !== undefined) {
    out.push("Response:", "", "```json", JSON.stringify(v.responseExample, null, 2), "```", "")
    if (v.responseNotes) {
      for (const [path, note] of Object.entries(v.responseNotes)) {
        out.push(`- \`${path}\`: ${note}`)
      }
      out.push("")
    }
  }
  return out
}

/** The complete reference as one markdown file. */
export function buildLlmsFullTxt(): string {
  const out: string[] = [
    `# SendMsg API ${API_VERSION}`,
    "",
    "REST API for managing subscribers and mailing lists and for sending email",
    "and SMS campaigns.",
    "",
    `Base URL: \`${API_BASE}\``,
    "",
    "## Authentication",
    "",
    "POST your SiteID and API password to `/token`. Send the returned token as",
    "the `Authorization` header on every other request. Tokens last 12 hours.",
    `Append \`?full=true\` to the token request for its metadata. The API password`,
    `comes from support at ${SUPPORT_EMAIL}.`,
    "",
    "## Conventions",
    "",
  ]
  for (const c of conventions) out.push(`- **${c.title}.** ${c.body}`)

  out.push("", "## API Support", "", support.requirement, "")
  support.steps.forEach((step, i) => out.push(`${i + 1}. ${step}`))
  out.push("", `Template: ${support.templateUrl}`, `Email: ${support.email}`, "")

  out.push("## About SMS", "", smsRules.lede, "")
  out.push(`Restrictions on \`${smsRules.restrictionsFor}\`:`, "")
  for (const rule of smsRules.restrictions) out.push(`- ${rule}`)

  out.push("", "## Status codes", "", "| Code | Meaning |", "| --- | --- |")
  for (const s of statusCodes) out.push(`| ${s.code} | ${s.meaning} |`)
  out.push(
    "",
    "Every status code returns detail in `result.ResultMessage`.",
    "",
    "## Response envelope",
    "",
    "Every endpoint wraps its result in `success`, `res` and a `result` object",
    "holding `ResultID`, `ResultMessage` and the deprecated, always-empty `Tin`.",
    "The endpoint's own payload sits alongside them under its own key.",
    ""
  )

  for (const { group, endpoints: list } of endpointsByGroup) {
    out.push(`## ${group.title}`, "")
    if (group.description) out.push(group.description, "")
    for (const e of list) {
      out.push(`### ${e.title}`, "", `\`${e.method} ${API_BASE}${e.path}\``, "")
      if (e.description) out.push(e.description, "")
      out.push(e.auth ? "Requires an Authorization header." : "Does not require a token.", "")

      if (e.query?.length) {
        out.push("Query parameters:", "", "| Name | Type | Required | Description |", "| --- | --- | --- | --- |")
        for (const q of e.query) {
          out.push(
            `| \`${q.name}\` | ${q.type ?? ""} | ${q.required ? "yes" : "no"} | ${q.description.replace(/\|/g, "\\|")} |`
          )
        }
        out.push("")
      }

      const showLabels = e.variants.length > 1
      for (const v of e.variants) out.push(...variantMarkdown(e, v, showLabels))

      if (e.notes?.length) {
        out.push("Notes:", "")
        for (const n of e.notes) out.push(`- ${n}`)
        out.push("")
      }
      if (e.gaps?.length) {
        out.push("Undocumented at source:", "")
        for (const g of e.gaps) out.push(`- ${g}`)
        out.push("")
      }
    }
  }

  return out.join("\n")
}

/**
 * OpenAPI 3.1 description, for Postman and client generators.
 *
 * The API is a poor fit for OpenAPI in one respect: several operations share
 * a path and are distinguished only by the shape of the body. Those are
 * emitted as one operation whose requestBody is a oneOf across the variants,
 * which is the honest representation.
 */
export function buildOpenApi(): unknown {
  const paths: Record<string, Record<string, unknown>> = {}

  for (const e of endpoints) {
    const method = e.method.toLowerCase()
    const key = e.path
    paths[key] ??= {}

    const parameters = (e.query ?? []).map((q) => ({
      name: q.name,
      in: "query",
      required: q.required,
      description: q.description,
      schema: { type: q.type === "number" ? "integer" : "string" },
      example: q.example,
    }))

    const bodies = e.variants
      .filter((v) => v.requestExample !== undefined)
      .map((v) => ({
        title: v.label,
        example: v.requestExample,
      }))

    const operation: Record<string, unknown> = {
      operationId: e.id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()),
      summary: e.title,
      description: [e.description, ...(e.notes ?? []), ...(e.gaps ?? [])]
        .filter(Boolean)
        .join("\n\n"),
      tags: [groups.find((g) => g.id === e.group)?.title ?? e.group],
      parameters,
      security: e.auth ? [{ apiToken: [] }] : [],
      responses: {
        "200": {
          description: "Success",
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: Object.fromEntries(
                e.variants
                  .filter((v) => v.responseExample !== undefined)
                  .map((v) => [v.id, { summary: v.label, value: v.responseExample }])
              ),
            },
          },
        },
      },
    }

    if (bodies.length) {
      operation.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema:
              bodies.length === 1
                ? { type: "object" }
                : { oneOf: bodies.map((b) => ({ title: b.title, type: "object" })) },
            examples: Object.fromEntries(
              e.variants
                .filter((v) => v.requestExample !== undefined)
                .map((v) => [v.id, { summary: v.label, value: v.requestExample }])
            ),
          },
        },
      }
    }

    // Two operations can share a path and method (the email and SMS sends);
    // merge their examples rather than letting one overwrite the other.
    const existing = paths[key][method] as Record<string, unknown> | undefined
    if (existing) {
      existing.summary = `${existing.summary} / ${e.title}`
      existing.description = `${existing.description}\n\n${operation.description}`
    } else {
      paths[key][method] = operation
    }
  }

  return {
    openapi: "3.1.0",
    info: {
      title: "SendMsg API",
      version: API_VERSION,
      description:
        "Manage subscribers and mailing lists, and send email and SMS campaigns.",
      contact: { email: SUPPORT_EMAIL },
    },
    servers: [{ url: API_BASE }],
    components: {
      securitySchemes: {
        apiToken: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "Token from POST /token. Valid for 12 hours.",
        },
      },
    },
    tags: groups.map((g) => ({ name: g.title, description: g.description })),
    paths,
  }
}

export const SAMPLE_LANGUAGE_LABELS = LANGUAGE_LABELS
export const SAMPLE_LANGUAGES = LANGUAGES
