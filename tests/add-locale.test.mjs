import { test } from "node:test"
import assert from "node:assert/strict"
import { addLocaleToSource, addLocaleToConfig } from "../scripts/add-locale.mjs"

const page = `import React from "react"
import heText from "../locales/he/pages/about.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }
`

test("adds the new language's import and TEXT entry", () => {
  assert.equal(
    addLocaleToSource(page, "en"),
    `import React from "react"
import heText from "../locales/he/pages/about.json"
import enText from "../locales/en/pages/about.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText, en: enText }
`
  )
})

test("is idempotent", () => {
  const once = addLocaleToSource(page, "en")
  assert.equal(addLocaleToSource(once, "en"), once)
})

test("leaves files without their own text alone", () => {
  const src = `import React from "react"\nexport default () => null\n`
  assert.equal(addLocaleToSource(src, "en"), src)
})

test("registers the language in config.ts, not yet enabled", () => {
  const cfg = `export const locales = {\n  he: { dir: "rtl", label: "עברית", enabled: true },\n} as const\n`
  assert.equal(
    addLocaleToConfig(cfg, "en", "ltr", "English"),
    `export const locales = {\n  he: { dir: "rtl", label: "עברית", enabled: true },\n  en: { dir: "ltr", label: "English", enabled: false },\n} as const\n`
  )
  assert.equal(addLocaleToConfig(addLocaleToConfig(cfg, "en", "ltr", "English"), "en", "ltr", "English"),
    addLocaleToConfig(cfg, "en", "ltr", "English"))
})
