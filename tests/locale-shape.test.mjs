import { test } from "node:test"
import assert from "node:assert/strict"
import { readdirSync, statSync, readFileSync, existsSync } from "node:fs"
import { join, relative } from "node:path"
import { shapeDiff } from "../scripts/locale-shape.mjs"

test("shapeDiff: same shape, different words, is fine", () => {
  assert.deepEqual(shapeDiff({ a: "שלום", l: ["x", "y"] }, { a: "hello", l: ["a", "b"] }), [])
})

test("shapeDiff: a missing key, a shorter list, a wrong type", () => {
  assert.deepEqual(
    shapeDiff({ a: "x", b: "y", l: [1, 2], o: { k: "v" } }, { a: "x", l: [1], o: "v" }),
    ["b: missing", "l: 2 items in he, 1 here", "o: object in he, string here"]
  )
})

test("shapeDiff: placeholders must match", () => {
  assert.deepEqual(shapeDiff({ s: "מ-{price} לחודש" }, { s: "from {cost} a month" }), [
    "s: placeholders {price} in he, {cost} here",
  ])
})

/* TypeScript checks keys but not list lengths, and several components match
   a JSON list to icons by position. This catches what typecheck can't. */
test("every language's text files have Hebrew's shape", () => {
  const root = "src/locales"
  const files = (dir) =>
    readdirSync(dir).flatMap((f) => {
      const p = join(dir, f)
      return statSync(p).isDirectory() ? files(p) : f.endsWith(".json") ? [p] : []
    })
  const he = files(join(root, "he"))
  const others = readdirSync(root).filter((d) => d !== "he" && statSync(join(root, d)).isDirectory())
  const problems = []
  for (const lang of others) {
    for (const f of he) {
      const rel = relative(join(root, "he"), f)
      const other = join(root, lang, rel)
      if (!existsSync(other)) { problems.push(`${lang}/${rel}: missing file`); continue }
      for (const d of shapeDiff(JSON.parse(readFileSync(f, "utf8")), JSON.parse(readFileSync(other, "utf8"))))
        problems.push(`${lang}/${rel}: ${d}`)
    }
  }
  assert.deepEqual(problems, [])
})
