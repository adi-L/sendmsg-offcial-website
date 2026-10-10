import React from "react"

// Splits a reply into plain text and runs that must not be bidi-reordered:
// prices (₪ or ש"ח with their digits) and phone numbers. A bare ₪118 inside
// Hebrew text renders as 118₪ because the symbol has weak directionality,
// so each match is isolated in its own dir="ltr" span. Do not also set
// `direction: ltr` on these spans in CSS — on a standalone number that also
// left-aligns the box, producing a false two-column layout.
const ISOLATE =
  /((?:₪\s?[\d][\d.,]*)|(?:[\d][\d.,]*\s?(?:₪|ש"ח))|(?:0\d{1,2}-?\d{7})|(?:\d{3}-\d{7}))/g

export const renderRtlText = (text: string): React.ReactNode[] =>
  text.split(ISOLATE).map((part, i) => (i % 2 === 1 ? <span key={i} dir="ltr">{part}</span> : part))
