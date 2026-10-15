import { test } from "node:test"
import assert from "node:assert/strict"
import { extractPageText } from "../scripts/site-text.mjs"

const html = `<!DOCTYPE html><html lang="he" dir="rtl"><head>
<title>שלום | שלח מסר</title>
<meta name="description" content="תיאור &amp; עוד"/>
<meta property="og:title" content="כותרת"/>
<style>.a{content:"x"}</style></head>
<body><script>window.x="לא טקסט"</script>
<h1>היי<!-- --> <strong>שם</strong></h1>
<p>שורה
   שנייה&nbsp;&#x27;ציטוט&#x27;</p>
<a href="/sendmsg-offcial-website/about/" aria-label="אודות">אודות</a>
<img alt="לוגו" src="/x.png"/><input placeholder="חיפוש"/>
</body></html>`

test("extracts lang, dir, title, metas", () => {
  const r = extractPageText(html)
  assert.equal(r.lang, "he")
  assert.equal(r.dir, "rtl")
  assert.equal(r.title, "שלום | שלח מסר")
  assert.deepEqual(r.metas, ["description=תיאור & עוד", "og:title=כותרת"])
})

test("body text drops scripts, styles, comments and collapses whitespace", () => {
  const r = extractPageText(html)
  assert.equal(r.text, "היי שם שורה שנייה 'ציטוט' אודות")
})

test("collects attributes and hrefs in order", () => {
  const r = extractPageText(html)
  assert.deepEqual(r.attrs, ["aria-label=אודות", "alt=לוגו", "placeholder=חיפוש"])
  assert.deepEqual(r.hrefs, ["/sendmsg-offcial-website/about/"])
})

test("inline tags add no space, so a lost space is still a difference", () => {
  const glued = extractPageText(`<html><body><p>א<strong>ב</strong>ג<a href="/x">ד</a></p></body></html>`)
  const spaced = extractPageText(`<html><body><p>א <strong>ב</strong> ג</p></body></html>`)
  assert.equal(glued.text, "אבגד")
  assert.equal(spaced.text, "א ב ג")
})

test("block tags and br separate words", () => {
  const r = extractPageText(`<html><body><div>א</div><div>ב<br/>ג</div></body></html>`)
  assert.equal(r.text, "א ב ג")
})
