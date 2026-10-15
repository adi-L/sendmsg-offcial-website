import React from "react"
import { parseRich, RichNode } from "./parseRich"
import LocalizedLink from "./LocalizedLink"

const render = (nodes: RichNode[], ltrClass?: string): React.ReactNode[] =>
  nodes.map((n, i) => {
    switch (n.type) {
      case "text":
        return <React.Fragment key={i}>{n.value}</React.Fragment>
      case "br":
        return <br key={i} />
      case "strong":
        return <strong key={i}>{render(n.children, ltrClass)}</strong>
      case "ltr":
        return (
          <span key={i} className={ltrClass} dir={ltrClass ? undefined : "ltr"}>
            {render(n.children, ltrClass)}
          </span>
        )
      case "link":
        return n.href.startsWith("/") ? (
          <LocalizedLink key={i} to={n.href}>
            {render(n.children, ltrClass)}
          </LocalizedLink>
        ) : (
          <a key={i} href={n.href}>
            {render(n.children, ltrClass)}
          </a>
        )
    }
  })

/* A JSON string with \n, <strong>, <ltr> and <a href> rendered as React.
   <ltr> runs get `ltrClass` (each page has its own, e.g. "crm-ltr"), or a
   plain dir="ltr" span without one. */
const Rich: React.FC<{ text: string; ltrClass?: string }> = ({ text, ltrClass }) => (
  <>{render(parseRich(text), ltrClass)}</>
)

export default Rich
