import { test } from "node:test"
import assert from "node:assert/strict"
import {
  locales, defaultLocale, enabledLocales, localePath, pageVariants,
  articleLocale, formatText,
} from "../src/locales/config.ts"

test("hebrew is the default and the only enabled locale", () => {
  assert.equal(defaultLocale, "he")
  assert.equal(locales.he.dir, "rtl")
  assert.deepEqual(enabledLocales(), ["he"])
})

test("localePath: default locale is unprefixed", () => {
  assert.equal(localePath("he", "/about/"), "/about/")
  assert.equal(localePath("he", "/"), "/")
})

test("localePath: other locales get a prefix", () => {
  assert.equal(localePath("en", "/about/"), "/en/about/")
  assert.equal(localePath("en", "/"), "/en/")
})

test("localePath: untranslated pages and non-root paths pass through", () => {
  assert.equal(localePath("en", "/api/"), "/api/")
  assert.equal(localePath("en", "/api/#auth"), "/api/#auth")
  assert.equal(localePath("en", "https://panel.sendmsg.co.il/"), "https://panel.sendmsg.co.il/")
  assert.equal(localePath("en", "#top"), "#top")
})

test("pageVariants: one variant per enabled locale", () => {
  assert.deepEqual(pageVariants("/about/"), [{ path: "/about/", locale: "he" }])
})

test("pageVariants: untranslated page is built once with the default locale", () => {
  assert.deepEqual(pageVariants("/api/"), [{ path: "/api/", locale: "he" }])
})

test("articleLocale reads the language folder", () => {
  assert.equal(articleLocale("/x/website/content/kb/he/a.md"), "he")
  assert.equal(articleLocale("/x/website/content/blog/en/b.md"), "en")
  assert.equal(articleLocale("/x/website/content/kb/a.md"), null)
})

test("formatText fills placeholders and leaves unknown ones alone", () => {
  assert.equal(formatText("{n} מדריכים", { n: 98 }), "98 מדריכים")
  assert.equal(formatText("{a} ו-{b}", { a: "x" }), "x ו-{b}")
})

test("splitTemplate separates text from {placeholders}, keeping spaces", async () => {
  const { splitTemplate } = await import("../src/locales/config.ts")
  assert.deepEqual(splitTemplate("מ-{price} לחודש"), ["מ-", { name: "price" }, " לחודש"])
  assert.deepEqual(splitTemplate("{a}{b}"), [{ name: "a" }, { name: "b" }])
  assert.deepEqual(splitTemplate("בלי משתנים"), ["בלי משתנים"])
})

test("alternates: none while the page exists in one language", async () => {
  const { alternates } = await import("../src/locales/config.ts")
  assert.deepEqual(alternates("/about/", ["he"]), [])
})

test("alternates: one per language the page exists in, plus x-default", async () => {
  const { alternates } = await import("../src/locales/config.ts")
  assert.deepEqual(alternates("/about/", ["he", "en"]), [
    { hrefLang: "he", path: "/about/" },
    { hrefLang: "en", path: "/en/about/" },
    { hrefLang: "x-default", path: "/about/" },
  ])
  assert.deepEqual(alternates("/", ["he", "en"])[1], { hrefLang: "en", path: "/en/" })
})

test("alternates: untranslated pages have none", async () => {
  const { alternates } = await import("../src/locales/config.ts")
  assert.deepEqual(alternates("/api/", ["he", "en"]), [])
})
