import React from "react"
import type { GatsbySSR } from "gatsby"
import "./src/styles/global.css"

export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  setHtmlAttributes,
}) => {
  setHtmlAttributes({ lang: "he", dir: "rtl" })
}
