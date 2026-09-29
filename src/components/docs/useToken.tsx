import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

/**
 * Holds the reader's SiteID and token so every example on the page can show
 * their real values instead of the placeholders.
 *
 * Kept in localStorage, which means it stays in this browser. It is sent
 * nowhere except the SendMsg API itself, and only when the reader runs a
 * request from the console.
 */

const STORAGE_KEY = "sendmsg.api-docs.credentials"

interface Credentials {
  siteId: string
  token: string
}

interface TokenStore extends Credentials {
  setCredentials: (next: Partial<Credentials>) => void
  clear: () => void
  /** False until the browser has been read, so SSR and first paint agree. */
  hydrated: boolean
}

const empty: Credentials = { siteId: "", token: "" }

const TokenContext = createContext<TokenStore>({
  ...empty,
  setCredentials: () => {},
  clear: () => {},
  hydrated: false,
})

function read(): Credentials {
  // Private windows, blocked site data and SSR all make this throw or return
  // nothing; the page has to render correctly either way.
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Partial<Credentials>
    return { siteId: parsed.siteId ?? "", token: parsed.token ?? "" }
  } catch {
    return empty
  }
}

export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [credentials, setStored] = useState<Credentials>(empty)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setStored(read())
    setHydrated(true)
  }, [])

  const persist = useCallback((next: Credentials) => {
    setStored(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Storage unavailable; the values still work for this page view.
    }
  }, [])

  const setCredentials = useCallback(
    (next: Partial<Credentials>) => {
      setStored((current) => {
        const merged = { ...current, ...next }
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        } catch {
          // As above.
        }
        return merged
      })
    },
    []
  )

  const clear = useCallback(() => {
    persist(empty)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // As above.
    }
  }, [persist])

  const value = useMemo<TokenStore>(
    () => ({ ...credentials, setCredentials, clear, hydrated }),
    [credentials, setCredentials, clear, hydrated]
  )

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
}

export const useToken = () => useContext(TokenContext)
