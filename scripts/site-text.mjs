// Extracts what a visitor sees from every built page, so a refactor that is
// meant to change no text can prove it: snapshot before, snapshot after,
// compare. Regex-based on purpose: both sides come from the same generator.
//
//   node scripts/site-text.mjs snapshot <out.json>
//   node scripts/site-text.mjs compare <before.json> <after.json>
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, "&")

const squash = (s) => s.replace(/\s+/g, " ").trim()
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1]

// Inline tags vanish without a space, so "א<strong>ב</strong>" and
// "א <strong>ב</strong>" stay different. Turning every tag into a space
// would hide exactly the lost-space bug this tool exists to catch.
const INLINE =
  /<\/?(?:a|abbr|b|bdi|bdo|code|em|i|label|mark|s|small|span|strong|sub|sup|u)\b[^>]*>/gi

export function extractPageText(html) {
  const htmlTag = html.match(/<html\b[^>]*>/)?.[0] ?? ""
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1] ?? ""
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? ""

  const metas = [...head.matchAll(/<meta\b[^>]*>/g)]
    .map(([m]) => [attr(m, "name") ?? attr(m, "property"), attr(m, "content")])
    .filter(([k, v]) => k && v !== undefined)
    .map(([k, v]) => `${k}=${decode(v)}`)

  const cleaned = body
    .replace(/<script\b[\s\S]*?<\/script>/g, " ")
    .replace(/<style\b[\s\S]*?<\/style>/g, " ")
    .replace(/<!--[\s\S]*?-->/g, "")

  const attrs = []
  const hrefs = []
  for (const [t] of cleaned.matchAll(/<[a-zA-Z][^>]*>/g)) {
    for (const name of ["aria-label", "alt", "title", "placeholder"]) {
      const v = attr(t, name)
      if (v !== undefined) attrs.push(`${name}=${decode(v)}`)
    }
    if (/^<a\b/.test(t)) {
      const h = attr(t, "href")
      if (h !== undefined) hrefs.push(decode(h))
    }
  }

  return {
    lang: attr(htmlTag, "lang") ?? "",
    dir: attr(htmlTag, "dir") ?? "",
    title: squash(decode(head.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? "")),
    metas,
    text: squash(decode(cleaned.replace(INLINE, "").replace(/<[^>]+>/g, " "))),
    attrs,
    hrefs,
  }
}

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* htmlFiles(p)
    else if (name.endsWith(".html")) yield p
  }
}

function snapshot(out) {
  const root = join(process.cwd(), "public")
  const pages = {}
  for (const f of htmlFiles(root)) {
    pages[relative(root, f)] = extractPageText(readFileSync(f, "utf8"))
  }
  writeFileSync(out, JSON.stringify(pages, null, 1))
  console.log(`snapshot: ${Object.keys(pages).length} pages -> ${out}`)
}

function compare(aPath, bPath) {
  const a = JSON.parse(readFileSync(aPath, "utf8"))
  const b = JSON.parse(readFileSync(bPath, "utf8"))
  let n = 0
  const report = (msg) => {
    n++
    if (n <= 50) console.log(msg)
  }
  for (const p of Object.keys(a)) if (!(p in b)) report(`- page missing: ${p}`)
  for (const p of Object.keys(b)) if (!(p in a)) report(`+ page added: ${p}`)
  for (const p of Object.keys(a)) {
    if (!(p in b)) continue
    for (const field of Object.keys(a[p])) {
      const x = JSON.stringify(a[p][field])
      const y = JSON.stringify(b[p][field])
      if (x === y) continue
      let i = 0
      while (i < x.length && x[i] === y[i]) i++
      report(
        `~ ${p} [${field}] at ${i}:\n` +
          `    before: …${x.slice(Math.max(0, i - 40), i + 60)}\n` +
          `    after:  …${y.slice(Math.max(0, i - 40), i + 60)}`
      )
    }
  }
  console.log(`${n} differences`)
  process.exit(n > 0 ? 1 : 0)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [cmd, ...args] = process.argv.slice(2)
  if (cmd === "snapshot") snapshot(args[0])
  else if (cmd === "compare") compare(args[0], args[1])
  else {
    console.error("usage: site-text.mjs snapshot <out.json> | compare <a.json> <b.json>")
    process.exit(2)
  }
}
