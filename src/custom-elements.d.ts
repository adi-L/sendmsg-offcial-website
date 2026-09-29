import type * as React from "react"

// React 19 moved IntrinsicElements out of the global JSX namespace and into
// React.JSX; declaring it globally no longer registers the custom element.
declare module "react" {
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
