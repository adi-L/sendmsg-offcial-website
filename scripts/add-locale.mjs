// Prepares a new language: copies src/locales/he/ to src/locales/<code>/,
// adds the <code> import and TEXT entry to every file that has its own text,
// and registers the language in config.ts with enabled: false.
//
//   node scripts/add-locale.mjs en ltr English
//
// Then translate the copied JSON, set enabled: true, and run npm run verify.
import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

export function addLocaleToSource(src, code) {
  const m = src.match(/^import heText from "(.*)\/he\/(.*)\.json"$/m)
  if (!m || src.includes(`${code}Text`)) return src
  const [line, base, ns] = m
  return src
    .replace(line, `${line}\nimport ${code}Text from "${base}/${code}/${ns}.json"`)
    .replace(/const TEXT = \{ ([^}]*?) \}/, (_, inner) => `const TEXT = { ${inner}, ${code}: ${code}Text }`)
}

export function addLocaleToConfig(src, code, dir, label) {
  if (new RegExp(`^\\s+${code}: \\{`, "m").test(src)) return src
  return src.replace(
    /(export const locales = \{\n(?:  .*\n)*?)(\} as const)/,
    `$1  ${code}: { dir: "${dir}", label: "${label}", enabled: false },\n$2`
  )
}

function* sourceFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* sourceFiles(p)
    else if (/\.(tsx?|mjs)$/.test(name)) yield p
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [code, dir = "ltr", label = code] = process.argv.slice(2)
  if (!/^[a-z]{2}$/.test(code ?? "") || !["ltr", "rtl"].includes(dir)) {
    console.error("usage: node scripts/add-locale.mjs <two-letter code> [ltr|rtl] [label]")
    process.exit(2)
  }
  const target = join("src/locales", code)
  if (!existsSync(target)) cpSync("src/locales/he", target, { recursive: true })
  let touched = 0
  for (const f of sourceFiles("src")) {
    const before = readFileSync(f, "utf8")
    const after = addLocaleToSource(before, code)
    if (after !== before) { writeFileSync(f, after); touched++ }
  }
  const cfg = "src/locales/config.ts"
  writeFileSync(cfg, addLocaleToConfig(readFileSync(cfg, "utf8"), code, dir, label))
  console.log(`${code}: copied he/ to ${target}, wired ${touched} files, registered in config.ts (enabled: false)`)
  console.log(`next: translate ${target}/**/*.json, set enabled: true in config.ts, run npm run verify`)
}
