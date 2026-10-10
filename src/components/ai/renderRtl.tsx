import React from "react"

// Our own origin only. A reply can legitimately contain a bare
// https://sendmsg.co.il/... URL (the guide-matcher hands the model exactly
// that shape, see src/guides/match.ts in the gateway), and that is the
// ONLY host this is ever allowed to linkify -- this is model-generated
// text rendered into a real page, so turning an arbitrary https://... run
// into a clickable <a> would be an open redirect/injection surface.
const LINK_ORIGIN = "https://sendmsg.co.il/"

// Splits a reply into plain text and runs that must not be bidi-reordered:
// our own links, prices (₪ or ש"ח with their digits), and phone numbers. A
// bare ₪118 inside Hebrew text renders as 118₪ because the symbol has weak
// directionality, so each match is isolated in its own dir="ltr" span. Do
// not also set `direction: ltr` on these spans in CSS — on a standalone
// number that also left-aligns the box, producing a false two-column
// layout. The link branch below renders an <a>, not a span, and must NOT
// go through the same isolation treatment as a number.
const ISOLATE =
  /((?:https:\/\/sendmsg\.co\.il\/[^\s֑-״"'()[\]<>,.;:!?]*)|(?:₪\s?[\d][\d.,]*)|(?:[\d][\d.,]*\s?(?:₪|ש"ח))|(?:0\d{1,2}-?\d{7})|(?:\d{3}-\d{7}))/g

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

export const renderRtlText = (text: string): React.ReactNode[] =>
  text.split(ISOLATE).map((part, i) => {
    if (i % 2 !== 1) return part
    if (part.startsWith(LINK_ORIGIN)) {
      // Same tab, same site -- not an external destination, so no
      // target="_blank" (and therefore no rel="noopener" need either).
      return (
        <a key={i} href={part} dir="ltr">
          {displayUrl(part)}
        </a>
      )
    }
    return (
      <span key={i} dir="ltr">
        {part}
      </span>
    )
  })
