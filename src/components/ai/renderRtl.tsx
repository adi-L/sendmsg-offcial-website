import React from "react"

// Our own origin only, with or without www (the site lives on www; the
// gateway may still hand out the bare host). A reply can legitimately
// contain a https://sendmsg.co.il/... URL (the guide-matcher hands the model exactly
// that shape, see src/guides/match.ts in the gateway), and that is the
// ONLY host this is ever allowed to linkify -- this is model-generated
// text rendered into a real page, so turning an arbitrary https://... run
// into a clickable <a> would be an open redirect/injection surface.
const LINK_ORIGIN = /^https:\/\/(?:www\.)?sendmsg\.co\.il\//

// Splits a reply into plain text and runs that must not be bidi-reordered:
// our own links, prices (₪ or ש"ח with their digits), and phone numbers. A
// bare ₪118 inside Hebrew text renders as 118₪ because the symbol has weak
// directionality, so each match is isolated in its own dir="ltr" span. Do
// not also set `direction: ltr` on these spans in CSS — on a standalone
// number that also left-aligns the box, producing a false two-column
// layout. The link branch below renders an <a>, not a span, and must NOT
// go through the same isolation treatment as a number.
const ISOLATE =
  /((?:https:\/\/(?:www\.)?sendmsg\.co\.il\/[^\s֑-״"'()[\]<>,.;:!?]*)|(?:₪\s?[\d][\d.,]*)|(?:[\d][\d.,]*\s?(?:₪|ש"ח))|(?:0\d{1,2}-?\d{7})|(?:\d{3}-\d{7}))/g

// A guide href arrives percent-encoded on purpose: ISOLATE above excludes
// Hebrew characters, so a raw Hebrew slug would truncate the match and
// break the link, which is why the gateway's match.ts runs encodeURI. The
// encoding therefore has to stay on the href, and only the visible text is
// decoded. decodeURI throws a URIError on a malformed escape (a truncated
// %D7 is not hypothetical in model-generated text), and an exception raised
// during render would take the whole reply down, so fall back to the raw
// string rather than showing nothing.
const displayUrl = (url: string): string => {
  try {
    return decodeURI(url)
  } catch {
    return url
  }
}

// Splits one run of text into links, prices and phone numbers, each isolated
// from bidi reordering. This is the inner layer; the block renderer below
// handles lines, lists and bold.
const isolate = (text: string, key: string): React.ReactNode[] =>
  text.split(ISOLATE).map((part, i) => {
    if (i % 2 !== 1) return part
    if (LINK_ORIGIN.test(part)) {
      // Same tab, same site -- not an external destination, so no
      // target="_blank" (and therefore no rel="noopener" need either).
      return (
        <a key={`${key}-${i}`} href={part} dir="ltr">
          {displayUrl(part)}
        </a>
      )
    }
    return (
      <span key={`${key}-${i}`} dir="ltr">
        {part}
      </span>
    )
  })

// The only inline markup the model is allowed to produce. Deliberately a
// whitelist of two constructs rather than a markdown library: this is
// model-generated text going into a real page, so it is built as React
// elements and never as HTML. There is no dangerouslySetInnerHTML anywhere in
// this file, which is what makes the whole class of injection impossible
// rather than merely filtered.
const BOLD = /\*\*([^*\n]+)\*\*/

const renderInline = (text: string, key: string): React.ReactNode[] =>
  text.split(BOLD).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`${key}-b${i}`}>{isolate(part, `${key}-b${i}`)}</strong>
    ) : (
      <React.Fragment key={`${key}-t${i}`}>{isolate(part, `${key}-t${i}`)}</React.Fragment>
    )
  )

// Block level: blank-line-separated paragraphs and "- " bullet lists, which is
// all the model actually emits. An unmatched "**" is left as literal text
// rather than guessed at -- a half-rendered bold is worse than a visible
// asterisk.
const BULLET = /^\s*[-*]\s+(.*)$/

export const renderRtlText = (text: string): React.ReactNode[] => {
  const out: React.ReactNode[] = []
  let items: React.ReactNode[] = []

  const flushList = (key: string): void => {
    if (!items.length) return
    out.push(
      <ul className="ai-md-list" key={`ul-${key}`}>
        {items}
      </ul>
    )
    items = []
  }

  text.split("\n").forEach((line, i) => {
    const bullet = BULLET.exec(line)
    if (bullet) {
      items.push(<li key={`li-${i}`}>{renderInline(bullet[1], `li-${i}`)}</li>)
      return
    }
    flushList(String(i))
    if (!line.trim()) return
    out.push(
      <p className="ai-md-p" key={`p-${i}`}>
        {renderInline(line, `p-${i}`)}
      </p>
    )
  })
  flushList("end")
  return out
}
