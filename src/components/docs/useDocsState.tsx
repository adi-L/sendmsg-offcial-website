import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { endpoints } from "../../data/api"

/**
 * Which endpoint the right rail is showing, and which variant each endpoint
 * is set to.
 *
 * Variant selection lives here rather than inside the endpoint because two
 * places need it: the parameter tables in the reading column, and the code
 * samples over in the rail.
 */

interface DocsState {
  activeId: string
  setActiveId: (id: string) => void
  variantFor: (endpointId: string) => string
  setVariant: (endpointId: string, variantId: string) => void
}

const defaultVariants = Object.fromEntries(
  endpoints.map((e) => [e.id, e.variants[0]?.id ?? ""])
)

const DocsStateContext = createContext<DocsState>({
  activeId: "",
  setActiveId: () => {},
  variantFor: () => "",
  setVariant: () => {},
})

export const DocsStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeId, setActiveId] = useState("")
  const [variants, setVariants] = useState<Record<string, string>>(defaultVariants)

  const setVariant = useCallback((endpointId: string, variantId: string) => {
    setVariants((current) => ({ ...current, [endpointId]: variantId }))
  }, [])

  const variantFor = useCallback(
    (endpointId: string) => variants[endpointId] ?? "",
    [variants]
  )

  const value = useMemo<DocsState>(
    () => ({ activeId, setActiveId, variantFor, setVariant }),
    [activeId, variantFor, setVariant]
  )

  return <DocsStateContext.Provider value={value}>{children}</DocsStateContext.Provider>
}

export const useDocsState = () => useContext(DocsStateContext)
