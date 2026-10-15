// Compares another language's text file with Hebrew's: same keys, same list
// lengths, same types, same {placeholders}. Returns one line per problem.
const kind = (v) => (Array.isArray(v) ? "array" : v === null ? "null" : typeof v)
const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",")

export function shapeDiff(he, other, path = "") {
  const at = (k) => (path ? `${path}.${k}` : String(k))
  const here = path || "(root)"
  if (kind(he) !== kind(other)) return [`${here}: ${kind(he)} in he, ${kind(other)} here`]
  if (Array.isArray(he)) {
    if (he.length !== other.length) return [`${here}: ${he.length} items in he, ${other.length} here`]
    return he.flatMap((v, i) => shapeDiff(v, other[i], `${path}[${i}]`))
  }
  if (kind(he) === "object") {
    return Object.keys(he).flatMap((k) =>
      k in other ? shapeDiff(he[k], other[k], at(k)) : [`${at(k)}: missing`]
    )
  }
  if (typeof he === "string" && placeholders(he) !== placeholders(other)) {
    const show = (s) => s.split(",").filter(Boolean).map((p) => `{${p}}`).join(" ") || "none"
    return [`${here}: placeholders ${show(placeholders(he))} in he, ${show(placeholders(other))} here`]
  }
  return []
}
