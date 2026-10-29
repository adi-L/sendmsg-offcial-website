/**
 * Every address the old WordPress site exposed (src/data/old-site-urls.txt)
 * must land somewhere on the new site: a 301 to a page that exists, the
 * same page at the same address, or a deliberate 410. One that lands
 * nowhere is a ranking and its inbound links thrown away, so this fails
 * the build rather than warning.
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import {
  normalise,
  redirectPairs,
  resolveOld,
} from "../src/data/redirects.ts"

const ROOT = join(import.meta.dirname, "..")

const unquote = (s) => s.trim().replace(/^"([\s\S]*)"$/, "$1")
const field = (text, name) =>
  text.match(new RegExp(`^${name}:\\s*(.*)$`, "m"))?.[1]?.trim()

/* The articles and guides, as gatsby-node routes them. */
const articles = []
const routes = new Set()
for (const [dir, route] of [["blog", "/blog/"], ["kb", "/kb/"]]) {
  const folder = join(ROOT, "content", dir, "he")
  for (const name of readdirSync(folder).filter((n) => n.endsWith(".md"))) {
    const text = readFileSync(join(folder, name), "utf8")
    const slug = unquote(field(text, "slug") ?? "")
    const source = unquote(field(text, "source") ?? "")
    if (!slug) continue
    routes.add(`${route}${slug}/`)
    if (source) articles.push({ source, route: `${route}${slug}/` })
  }
}

/* The pages: one per file in src/pages, the 404 aside. */
const pages = new Set(routes)
for (const name of readdirSync(join(ROOT, "src", "pages"))) {
  const base = name.replace(/\.tsx$/, "")
  if (base === "404") continue
  pages.add(base === "index" ? "/" : `/${base}/`)
}

const oldUrls = readFileSync(join(ROOT, "src", "data", "old-site-urls.txt"), "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"))

const pairs = redirectPairs(articles)
const map = new Map(pairs)

test("every old URL lands somewhere", () => {
  const missing = oldUrls.filter((u) => resolveOld(u, map, pages).kind === "missing")
  assert.deepEqual(missing, [], `old URLs with no destination:\n  ${missing.join("\n  ")}`)
})

test("every redirect target is a page that exists", () => {
  const dead = pairs.filter(([, to]) => !pages.has(to)).map(([f, t]) => `${f} -> ${t}`)
  assert.deepEqual(dead, [], `redirects to nothing:\n  ${dead.join("\n  ")}`)
})

test("no redirect chains: no target is itself redirected", () => {
  const chained = pairs.filter(([, to]) => map.has(to)).map(([f, t]) => `${f} -> ${t}`)
  assert.deepEqual(chained, [], `chains:\n  ${chained.join("\n  ")}`)
})

test("normalise decodes and settles the slashes", () => {
  assert.equal(normalise("https://www.sendmsg.co.il/%D7%A7%D7%9E/?x=1"), "/קמ/")
  assert.equal(normalise("/he"), "/he/")
  assert.equal(normalise("https://www.sendmsg.co.il"), "/")
})
