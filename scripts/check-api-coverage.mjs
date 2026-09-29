/**
 * Guards the transcription of the Apiary blueprint into src/data/api.
 *
 * The risk with porting documentation by hand is silently dropping an
 * endpoint: nothing fails, the page just quietly stops mentioning something
 * the API still does. This compares every resource declared in the original
 * blueprint against the paths we document, and fails if any went missing.
 *
 * Usage: node scripts/check-api-coverage.mjs [path-to-blueprint]
 * The blueprint is fetched if no local copy is given.
 */
import fs from "node:fs"
import path from "node:path"

const BLUEPRINT_URL = "https://sendmsgapi.docs.apiary.io/api-description-document"
const DATA_DIR = path.join(process.cwd(), "src/data/api/endpoints")
// The blueprint is vendored because the whole point of this work is to stop
// depending on Apiary. Fetching it at check time would leave our build gated
// on a service we are retiring, and it has already answered 502 once.
const VENDORED = path.join(process.cwd(), "scripts/reference/sendmsg-api-4.0.apib")

async function loadBlueprint(arg) {
  const local = arg ?? VENDORED
  if (fs.existsSync(local)) return fs.readFileSync(local, "utf8")
  // Only reached if the vendored copy is deleted.
  const res = await fetch(BLUEPRINT_URL)
  if (!res.ok) throw new Error(`Could not fetch blueprint: HTTP ${res.status}`)
  return res.text()
}

/** Resource headings look like: `## Title [/SomePath]` or `## Title [/P/{?a,b}]` */
function blueprintPaths(src) {
  const found = new Map()
  for (const line of src.split("\n")) {
    const m = /^##\s+(.+?)\s*\[(\/[^\]]*)\]\s*$/.exec(line)
    if (!m) continue
    const [, title, raw] = m
    // Strip the URI-template query segment; we model query params separately.
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

const blueprint = await loadBlueprint(process.argv[2])
const expected = blueprintPaths(blueprint)
const actual = documentedPaths()

// A handful of blueprint headings are prose sections or scratch resources
// rather than real endpoints. Each one is listed with its reason so the
// exclusion is a decision on the record, not an accident.
const IGNORED = new Map([
  ["/AddUsersToLists2", "Labelled TEST in the blueprint; a scratch duplicate of /AddUsersToLists."],
])

const missing = []
for (const [p, title] of expected) {
  if (actual.has(p) || IGNORED.has(p)) continue
  missing.push(`${p}  (blueprint: "${title}")`)
}

const extra = [...actual].filter((p) => !expected.has(p))

console.log(`Blueprint resources : ${expected.size}`)
console.log(`Documented paths    : ${actual.size}`)
console.log(`Intentionally skipped: ${IGNORED.size}`)
for (const [p, why] of IGNORED) console.log(`  - ${p}: ${why}`)

if (extra.length) {
  console.log(`\nPaths we document that the blueprint does not declare:`)
  for (const p of extra) console.log(`  ? ${p}`)
}

if (missing.length) {
  console.error(`\nFAIL: ${missing.length} blueprint resource(s) are not documented:`)
  for (const m of missing) console.error(`  - ${m}`)
  process.exit(1)
}

console.log(`\nOK: every blueprint resource is accounted for.`)
