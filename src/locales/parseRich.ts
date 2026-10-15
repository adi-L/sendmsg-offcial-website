/* Turns a JSON string into a small tree: \n, <strong>, <ltr> (a
   left-to-right run such as a price inside a Hebrew sentence), <a href="...">.
   Anything else, including an unclosed tag, is kept as literal text, so a
   typo in a JSON file shows up on the page instead of vanishing. */
export type RichNode =
  | { type: "text"; value: string }
  | { type: "br" }
  | { type: "strong"; children: RichNode[] }
  | { type: "ltr"; children: RichNode[] }
  | { type: "link"; href: string; children: RichNode[] }

const OPEN = /<strong>|<ltr>|<a href="([^"]*)">/g
const CLOSE: Record<string, [string, string]> = {
  "<strong>": ["<strong>", "</strong>"],
  "<ltr>": ["<ltr>", "</ltr>"],
}

export function parseRich(text: string): RichNode[] {
  const out: RichNode[] = []
  const pushText = (s: string) => {
    s.split("\n").forEach((part, i) => {
      if (i > 0) out.push({ type: "br" })
      if (!part) return
      const last = out[out.length - 1]
      if (last && last.type === "text") last.value += part
      else out.push({ type: "text", value: part })
    })
  }

  let pos = 0
  while (pos < text.length) {
    OPEN.lastIndex = pos
    const m = OPEN.exec(text)
    if (!m) break
    const [open, close] = CLOSE[m[0]] ?? ["<a ", "</a>"]
    const end = findClose(text, m.index + m[0].length, open, close)
    if (end < 0) break
    pushText(text.slice(pos, m.index))
    const children = parseRich(text.slice(m.index + m[0].length, end))
    out.push(
      m[0] === "<strong>"
        ? { type: "strong", children }
        : m[0] === "<ltr>"
          ? { type: "ltr", children }
          : { type: "link", href: m[1], children }
    )
    pos = end + close.length
  }
  pushText(text.slice(pos))
  return out
}

/* Index of the close tag that matches an open tag, allowing nesting of the
   same tag. -1 if it's never closed. */
function findClose(text: string, from: number, open: string, close: string): number {
  let depth = 1
  let i = from
  while (i < text.length) {
    const nextOpen = text.indexOf(open, i)
    const nextClose = text.indexOf(close, i)
    if (nextClose < 0) return -1
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth++
      i = nextOpen + open.length
      continue
    }
    depth--
    if (depth === 0) return nextClose
    i = nextClose + close.length
  }
  return -1
}
