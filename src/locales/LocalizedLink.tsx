import React from "react"
import { Link, GatsbyLinkProps } from "gatsby"
import { localePath } from "./config"
import { useLocale } from "./LocaleContext"

/* Gatsby's Link, kept inside the current language: on /en/ pages, "/about/"
   goes to "/en/about/". Hebrew paths are unchanged. */
function LocalizedLink<T>({ to, ...rest }: Omit<GatsbyLinkProps<T>, "ref">) {
  const locale = useLocale()
  return <Link to={localePath(locale, to)} {...rest} />
}

export default LocalizedLink
