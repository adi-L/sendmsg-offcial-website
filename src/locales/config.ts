/* The language registry and the URL rules. No imports, on purpose: the
   node test runner loads this file directly, and gatsby-node uses it too.

   Adding a language: add an entry here, add src/locales/<code>/ with the same
   files as he/, register it in messages.ts, set enabled: true. */
export const locales = {
  he: { dir: "rtl", label: "עברית", enabled: true },
} as const

export type Locale = keyof typeof locales
export const defaultLocale: Locale = "he"
export type PageContext = { locale: Locale }

/* Built once, at their own path, never copied under a language prefix. */
export const untranslatedPages: readonly string[] = ["/api/"]

export function enabledLocales(): Locale[] {
  return (Object.keys(locales) as Locale[]).filter((l) => locales[l].enabled)
}

const isUntranslated = (path: string) =>
  untranslatedPages.some(
    (p) => path === p || path.startsWith(p + "#") || path.startsWith(p + "?")
  )

export function localePath(locale: Locale, path: string): string {
  if (locale === defaultLocale || !path.startsWith("/") || isUntranslated(path)) return path
  return `/${locale}${path}`
}

export function pageVariants(path: string): { path: string; locale: Locale }[] {
  if (isUntranslated(path)) return [{ path, locale: defaultLocale }]
  return enabledLocales().map((locale) => ({ path: localePath(locale, path), locale }))
}

/* content/kb/he/x.md -> "he". The folder is the language. */
export function articleLocale(fileAbsolutePath: string): string | null {
  const m = fileAbsolutePath
    .split("\\")
    .join("/")
    .match(/\/content\/(?:kb|blog)\/([a-z]{2})\//)
  return m ? m[1] : null
}

export function formatText(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, k) => (k in vars ? String(vars[k]) : whole))
}

/* "מ-{price} לחודש" -> ["מ-", { name: "price" }, " לחודש"], for templates
   whose placeholders are filled with elements rather than strings. */
export function splitTemplate(template: string): (string | { name: string })[] {
  return template
    .split(/(\{\w+\})/)
    .filter((part) => part !== "")
    .map((part) => (/^\{\w+\}$/.test(part) ? { name: part.slice(1, -1) } : part))
}
