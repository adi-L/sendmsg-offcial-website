import React, { createContext, useContext, ReactNode } from "react"
import { withPrefix } from "gatsby"
import { defaultLocale, localePath, Locale } from "./config"
import { getT, Messages, Namespace } from "./messages"

const LocaleContext = createContext<Locale>(defaultLocale)

export const LocaleProvider: React.FC<{ locale: Locale; children: ReactNode }> = ({
  locale,
  children,
}) => <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>

export const useLocale = (): Locale => useContext(LocaleContext)

export function useT<N extends Namespace>(ns: N): Messages[N] {
  return getT(useLocale(), ns)
}

/* For raw <a href>: the locale prefix, then Gatsby's pathPrefix. */
export function useLocalePath(): (path: string) => string {
  const locale = useLocale()
  return (path) => {
    const p = localePath(locale, path)
    return p.startsWith("/") ? withPrefix(p) : p
  }
}
