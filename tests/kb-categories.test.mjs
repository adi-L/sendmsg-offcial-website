import { test } from "node:test"
import assert from "node:assert/strict"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const unquote = (s) => {
  const t = s.trim()
  const m = t.match(/^"([\s\S]*)"$/)
  return (m ? m[1] : t).replace(/\\(["\\])/g, "$1")
}
const frontmatter = (file) => readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ""
const categoriesOf = (fm) => {
  const out = []
  let inside = false
  for (const line of fm.split("\n")) {
    if (/^categories:/.test(line)) { inside = true; continue }
    if (inside && /^\s+- /.test(line)) { out.push(unquote(line.replace(/^\s+- /, ""))); continue }
    inside = false
  }
  return out
}

/* /kb/ groups guides by the categories in their frontmatter, matched by
   name against the list in that language's pages/kb.json. A name that
   isn't in the list would leave the guide out of every group. */
test("every guide's categories exist in its language's category list", () => {
  const problems = []
  for (const lang of readdirSync("content/kb")) {
    const jsonPath = join("src/locales", lang, "pages/kb.json")
    if (!existsSync(jsonPath)) { problems.push(`${lang}: no ${jsonPath}`); continue }
    const known = new Set((JSON.parse(readFileSync(jsonPath, "utf8")).categories ?? []).map((c) => c.label))
    for (const f of readdirSync(join("content/kb", lang))) {
      for (const c of categoriesOf(frontmatter(join("content/kb", lang, f))))
        if (!known.has(c)) problems.push(`${lang}/${f}: unknown category "${c}"`)
    }
  }
  assert.deepEqual(problems.slice(0, 5), [])
})

test("every guide has a numeric order, unique within its language", () => {
  const problems = []
  for (const lang of readdirSync("content/kb")) {
    const seen = new Map()
    for (const f of readdirSync(join("content/kb", lang))) {
      const m = frontmatter(join("content/kb", lang, f)).match(/^order: (\d+)$/m)
      if (!m) { problems.push(`${lang}/${f}: no order`); continue }
      if (seen.has(m[1])) problems.push(`${lang}/${f}: order ${m[1]} also used by ${seen.get(m[1])}`)
      seen.set(m[1], f)
    }
  }
  assert.deepEqual(problems.slice(0, 5), [])
})
