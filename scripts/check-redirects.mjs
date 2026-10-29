#!/usr/bin/env node
/* Check the old site's addresses against a running server.

       npm run build && node scripts/check-redirects.mjs https://staging.example.com

   For every address in src/data/old-site-urls.txt it asks the server once,
   without following redirects, and expects:

     moved   one 301 straight to the page redirects/redirects.csv names, and
             that page answering 200 (no chain, no loop)
     kept    a page that kept its address answering 200
     gone    WordPress machinery answering 410

   Location headers are compared by path, so a staging server that still
   redirects to https://sendmsg.co.il passes; the target is then fetched from
   the server under test, not from production. Exits 1 on any failure, so it
   can gate a launch. Run it again on launch day against the real domain. */

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { normalise, resolveOld, GONE } from "../src/data/redirects.ts"

const base = (process.argv[2] ?? "").replace(/\/+$/, "")
if (!/^https?:\/\//.test(base)) {
  console.error("usage: node scripts/check-redirects.mjs <https://server-under-test>")
  process.exit(2)
}

const ROOT = join(import.meta.dirname, "..")
const csv = readFileSync(join(ROOT, "redirects", "redirects.csv"), "utf8")
const map = new Map(
  csv
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => line.split(",").map(normalise))
)
const oldUrls = readFileSync(join(ROOT, "src", "data", "old-site-urls.txt"), "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"))

const encode = (p) => p.split("/").map(encodeURIComponent).join("/")
const ask = (p) => fetch(base + encode(p), { redirect: "manual" })

/* Pages that kept their address are not in the CSV; anything the CSV does
   not move is expected to answer 200 where it is. */
const everything = new Set(oldUrls.map(normalise))

const failures = []
let ok = 0
for (const url of oldUrls) {
  const p = normalise(url)
  const r = resolveOld(p, map, everything)
  try {
    const res = await ask(p)
    if (r.kind === "gone" || GONE.some((g) => p.startsWith(g))) {
      if (res.status === 410) ok++
      else failures.push(`${p}  expected 410, got ${res.status}`)
      continue
    }
    if (r.kind === "redirect") {
      const loc = res.headers.get("location")
      if (res.status !== 301 || !loc) {
        failures.push(`${p}  expected 301 -> ${r.to}, got ${res.status}`)
        continue
      }
      const landed = normalise(loc)
      if (landed !== r.to) {
        failures.push(`${p}  301s to ${landed}, expected ${r.to}`)
        continue
      }
      const target = await ask(landed)
      if (target.status !== 200) {
        failures.push(`${p}  -> ${landed} answers ${target.status} (chain or dead end)`)
        continue
      }
      ok++
      continue
    }
    if (res.status === 200) ok++
    else failures.push(`${p}  expected 200 where it is, got ${res.status}`)
  } catch (e) {
    failures.push(`${p}  request failed: ${e.message}`)
  }
}

console.log(`${ok} of ${oldUrls.length} old addresses OK against ${base}`)
if (failures.length) {
  console.log(`\n${failures.length} failed:\n  ${failures.join("\n  ")}`)
  process.exit(1)
}
