import type * as React from "react"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "sendmsg-register": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "business-ai"?: string
        "open-kosher-account"?: string
        "site-id"?: string
        language?: string
      }
    }
  }
}
