import React, { useEffect, useMemo, useRef, useState } from "react"
import { search, type SearchEntry } from "./search"

interface Props {
  open: boolean
  onClose: () => void
}

/**
 * Jump-to-anything over the endpoints, their fields and the section list.
 * Opens on the platform's own shortcut, and on "/" the way most references do.
 */
const SearchDialog: React.FC<Props> = ({ open, onClose }) => {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => search(query), [query])

  useEffect(() => {
    if (!open) return
    setQuery("")
    setActive(0)
    // Focus after the dialog has painted, or the caret lands nowhere.
    const id = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(id)
  }, [open])

  useEffect(() => setActive(0), [query])

  if (!open) return null

  function go(entry: SearchEntry | undefined) {
    if (!entry) return
    onClose()
    window.location.hash = `#${entry.anchor}`
  }

  return (
    <div
      className="doc-search-scrim"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="doc-search" role="dialog" aria-modal="true" aria-label="Search the reference">
        <input
          ref={inputRef}
          className="doc-search-input"
          value={query}
          placeholder="Search endpoints and fields"
          spellCheck={false}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setActive((i) => Math.min(i + 1, results.length - 1))
            }
            if (e.key === "ArrowUp") {
              e.preventDefault()
              setActive((i) => Math.max(i - 1, 0))
            }
            if (e.key === "Enter") {
              e.preventDefault()
              go(results[active])
            }
          }}
        />

        {query && !results.length ? (
          <p className="doc-search-empty">
            Nothing matches “{query}”. Try an endpoint name, a path, or a field.
          </p>
        ) : null}

        {results.length ? (
          <ul className="doc-search-results">
            {results.map((entry, i) => (
              <li key={entry.id}>
                <button
                  type="button"
                  className={`doc-search-hit${i === active ? " is-active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(entry)}
                >
                  <span className="doc-search-hit-title">{entry.title}</span>
                  <span className="doc-search-hit-sub">{entry.subtitle}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

export default SearchDialog
