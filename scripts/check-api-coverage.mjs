/**
 * Guards the transcription of the Apiary blueprint into src/data/api.
 *
 * The risk with porting documentation by hand is silently dropping something:
 * nothing fails, the page just quietly stops mentioning what the API still
 * does. This compares the blueprint against what we publish and fails if
 * anything went missing.
 *
 * Two classes are checked, because the first version only checked the first
 * and shipped a wrong URL for a fortnight's worth of readers:
 *
 *   1. Resources -- `## Title [/Path]`. One resource is declared with a
 *      single `#`, which an earlier version of this script did not match,
 *      so /SendSmsToMailingLists went undetected and was documented at the
 *      email endpoint's path instead.
 *   2. Prose sections -- the headings that carry rules rather than routes,
 *      such as the support procedure and the SMS sender restrictions. These
 *      are easy to compress away, and compressing changed the meaning once.
 *
 * Usage: node scripts/check-api-coverage.mjs [path-to-blueprint]
 */
import fs from "node:fs"
import path from "node:path"

const BLUEPRINT_URL = "https://sendmsgapi.docs.apiary.io/api-description-document"
const DATA_DIR = path.join(process.cwd(), "src/data/api/endpoints")
const SRC_DIR = path.join(process.cwd(), "src")
// The blueprint is vendored because the whole point of this work is to stop
// depending on Apiary. Fetching it at check time would leave our build gated
// on a service we are retiring, and it has already answered 502 once.
const VENDORED = path.join(process.cwd(), "scripts/reference/sendmsg-api-4.0.apib")

async function loadBlueprint(arg) {
  const local = arg ?? VENDORED
  if (fs.existsSync(local)) return fs.readFileSync(local, "utf8")
  const res = await fetch(BLUEPRINT_URL)
  if (!res.ok) throw new Error(`Could not fetch blueprint: HTTP ${res.status}`)
  return res.text()
}

/**
 * Resource headings, at any heading level.
 * `## Title [/Path]`, `# Title [/Path]`, `### Title [/Path/{?a,b}]`.
 */
function blueprintPaths(src) {
  const found = new Map()
  for (const line of src.split("\n")) {
    const m = /^#{1,3}\s*(.+?)\s*\[(\/[^\]]*)\]\s*$/.exec(line)
    if (!m) continue
    const [, title, raw] = m
    // Strip the URI-template query segment; query params are modelled apart.
    const clean = raw.replace(/\/?\{\?[^}]*\}/g, "").replace(/\/$/, "")
    if (!found.has(clean)) found.set(clean, title.trim())
  }
  return found
}

function documentedPaths() {
  const paths = new Set()
  for (const file of fs.readdirSync(DATA_DIR)) {
    if (!file.endsWith(".ts") || file.startsWith("_")) continue
    const src = fs.readFileSync(path.join(DATA_DIR, file), "utf8")
    for (const m of src.matchAll(/^\s*path:\s*"([^"]+)"/gm)) paths.add(m[1])
  }
  return paths
}

/** Everything we publish, as one haystack to search for required phrases. */
function publishedText() {
  const parts = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (/\.(ts|tsx)$/.test(entry.name)) parts.push(fs.readFileSync(full, "utf8"))
    }
  }
  walk(SRC_DIR)
  // Long strings in the source are split across lines and concatenated, so
  // the joins are collapsed before searching; otherwise a fact that is
  // present reads as missing purely because of where it wraps.
  return parts
    .join("\n")
    .replace(/"\s*\+\s*"/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
}

/**
 * Prose sections of the blueprint, each with a phrase that must appear
 * somewhere in what we publish. The phrase is the load-bearing fact, not
 * the heading text, so paraphrasing is allowed but dropping the fact is not.
 */
const PROSE_SECTIONS = [
  { heading: "API Support", must: "only accepted on the proper template" },
  { heading: "API Support steps", must: "copy the template" },
  { heading: "About SMS", must: "words longer than 11 characters are trimmed" },
  { heading: "About SMS", must: "letters must be english" },
  { heading: "Status Codes", must: "did not find what you were looking for" },
  { heading: "Important: UTF-8", must: "send strings as utf-8" },
  { heading: "Important: Content-Length", must: "content-length to the byte length" },
  { heading: "Getting started", must: "valid for 12 hours" },
  { heading: "MessageContent fields", must: "unmatched keys are removed" },
  { heading: "userSendFields", must: "[|[" },
  { heading: "Introduction nav", must: "api-support" },
  { heading: "Introduction nav", must: "about-sms" },
]

const blueprint = await loadBlueprint(process.argv[2])
const expected = blueprintPaths(blueprint)
const actual = documentedPaths()
const published = publishedText()

// A handful of blueprint headings are scratch resources rather than real
// endpoints. Each is listed with its reason, so the exclusion is a decision
// on the record rather than an accident.
const IGNORED = new Map([
  ["/AddUsersToLists2", "Labelled TEST in the blueprint; a scratch duplicate of /AddUsersToLists."],
])

const missingPaths = []
for (const [p, title] of expected) {
  if (actual.has(p) || IGNORED.has(p)) continue
  missingPaths.push(`${p}  (blueprint: "${title}")`)
}

const extraPaths = [...actual].filter((p) => !expected.has(p))

const missingProse = PROSE_SECTIONS.filter(
  (s) => !published.includes(s.must.toLowerCase())
)

console.log(`Blueprint resources  : ${expected.size}`)
console.log(`Documented paths     : ${actual.size}`)
console.log(`Prose facts checked  : ${PROSE_SECTIONS.length}`)
console.log(`Intentionally skipped: ${IGNORED.size}`)
for (const [p, why] of IGNORED) console.log(`  - ${p}: ${why}`)

if (extraPaths.length) {
  console.log(`\nPaths we document that the blueprint does not declare:`)
  for (const p of extraPaths) console.log(`  ? ${p}`)
}

let failed = false

if (missingPaths.length) {
  failed = true
  console.error(`\nFAIL: ${missingPaths.length} blueprint resource(s) not documented:`)
  for (const m of missingPaths) console.error(`  - ${m}`)
}

if (missingProse.length) {
  failed = true
  console.error(`\nFAIL: ${missingProse.length} prose fact(s) missing from the site:`)
  for (const s of missingProse) console.error(`  - ${s.heading}: expected "${s.must}"`)
}

if (failed) process.exit(1)

console.log(`\nOK: every resource and prose fact is accounted for.`)
