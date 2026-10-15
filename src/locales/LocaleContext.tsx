import React, { createContext, useContext, ReactNode } from "react"
import { withPrefix } from "gatsby"
import { defaultLocale, localePath, Locale } from "./config"

const LocaleContext = createContext<Locale>(defaultLocale)

export const LocaleProvider: React.FC<{ locale: Locale; children: ReactNode }> = ({
  locale,
  children,
}) => <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>

export const useLocale = (): Locale => useContext(LocaleContext)

/* A file's own text, one entry per language. Each component and page
   imports its JSON directly, so the text ships in the same chunk as the
   code that shows it. Every language in the registry is required, so adding
   one makes typecheck list each file that still needs its translation. */
export type Texts<T> = { [L in Locale]: T }

export function useText<T>(texts: Texts<T>): T {
  return texts[useLocale()]
}

/* For raw <a href>: the locale prefix, then Gatsby's pathPrefix. */
export function useLocalePath(): (path: string) => string {
  const locale = useLocale()
  return (path) => {
    const p = localePath(locale, path)
    return p.startsWith("/") ? withPrefix(p) : p
  }
}
