import React from "react"
import type { WrapPageElementBrowserArgs } from "gatsby"
import { defaultLocale, PageContext } from "./config"
import { LocaleProvider } from "./LocaleContext"

export const wrapPageElement = ({
  element,
  props,
}: WrapPageElementBrowserArgs<unknown, Partial<PageContext>>) => (
  <LocaleProvider locale={props.pageContext.locale ?? defaultLocale}>{element}</LocaleProvider>
)
