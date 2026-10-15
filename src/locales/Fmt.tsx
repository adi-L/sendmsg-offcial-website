import React from "react"
import { splitTemplate } from "./config"

/* A JSON string with {placeholders} filled by elements:
   <Fmt text={t.price} vars={{ price: <Ltr>₪40</Ltr> }} />. For plain
   strings, formatText is enough. */
const Fmt: React.FC<{ text: string; vars: Record<string, React.ReactNode> }> = ({ text, vars }) => (
  <>
    {splitTemplate(text).map((part, i) =>
      typeof part === "string" ? (
        <React.Fragment key={i}>{part}</React.Fragment>
      ) : (
        <React.Fragment key={i}>{part.name in vars ? vars[part.name] : `{${part.name}}`}</React.Fragment>
      )
    )}
  </>
)

export default Fmt
