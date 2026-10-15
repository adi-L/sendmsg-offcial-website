import { test } from "node:test"
import assert from "node:assert/strict"
import { parseRich } from "../src/locales/parseRich.ts"

test("plain text is one text node", () => {
  assert.deepEqual(parseRich("שלום"), [{ type: "text", value: "שלום" }])
})

test("newline becomes br", () => {
  assert.deepEqual(parseRich("א\nב"), [
    { type: "text", value: "א" }, { type: "br" }, { type: "text", value: "ב" },
  ])
})

test("strong keeps surrounding spaces", () => {
  assert.deepEqual(parseRich("<strong>שירות חדש!</strong> יש לך"), [
    { type: "strong", children: [{ type: "text", value: "שירות חדש!" }] },
    { type: "text", value: " יש לך" },
  ])
})

test("link in the middle of a sentence", () => {
  assert.deepEqual(parseRich("ראו <a href=\"/pricing/\">מחירון</a> כאן"), [
    { type: "text", value: "ראו " },
    { type: "link", href: "/pricing/", children: [{ type: "text", value: "מחירון" }] },
    { type: "text", value: " כאן" },
  ])
})

test("strong inside link", () => {
  assert.deepEqual(parseRich("<a href=\"/x/\"><strong>y</strong></a>"), [
    { type: "link", href: "/x/", children: [{ type: "strong", children: [{ type: "text", value: "y" }] }] },
  ])
})

test("unknown tags stay literal text", () => {
  assert.deepEqual(parseRich("<em>x</em> <script>y</script>"), [
    { type: "text", value: "<em>x</em> <script>y</script>" },
  ])
})

test("unclosed strong stays literal", () => {
  assert.deepEqual(parseRich("<strong>x"), [{ type: "text", value: "<strong>x" }])
})
