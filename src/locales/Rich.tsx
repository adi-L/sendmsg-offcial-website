import React from "react"
import { parseRich, RichNode } from "./parseRich"
import LocalizedLink from "./LocalizedLink"

const render = (nodes: RichNode[]): React.ReactNode[] =>
  nodes.map((n, i) => {
    switch (n.type) {
      case "text":
        return <React.Fragment key={i}>{n.value}</React.Fragment>
      case "br":
        return <br key={i} />
      case "strong":
        return <strong key={i}>{render(n.children)}</strong>
      case "link":
        return n.href.startsWith("/") ? (
          <LocalizedLink key={i} to={n.href}>
            {render(n.children)}
          </LocalizedLink>
        ) : (
          <a key={i} href={n.href}>
            {render(n.children)}
          </a>
        )
    }
  })

/* A JSON string with \n, <strong> and <a href> rendered as React. */
const Rich: React.FC<{ text: string }> = ({ text }) => <>{render(parseRich(text))}</>

export default Rich
