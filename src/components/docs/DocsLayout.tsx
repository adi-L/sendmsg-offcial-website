import React, { useEffect, useState, type ReactNode } from "react"
import { withPrefix } from "gatsby"
import logo from "../../images/logo.png"
import { endpoints, endpointsByGroup, introSections } from "../../data/api"
import { TokenProvider, useToken } from "./useToken"
import { DocsStateProvider, useDocsState } from "./useDocsState"
import SearchDialog from "./SearchDialog"
import CodePanel from "./CodePanel"

/**
 * The docs shell.
 *
 * Deliberately not the site Layout: no marketing header, no footer, and no
 * signup popup interrupting someone mid-integration. The site runs RTL from
 * the root element, so the whole shell carries dir="ltr" and its styles are
 * scoped under .api-docs.
 *
 * Three columns, like a console rather than a document: contents on the left,
 * the reference in the middle, and on the right a rail that keeps your
 * credentials in view and shows the code for whichever endpoint is open.
 */

const Credentials: React.FC = () => {
  const { siteId, token, setCredentials, clear, hydrated } = useToken()
  const has = hydrated && Boolean(siteId || token)

  // Folded away by default: it is something you set once, so it should not
  // hold the top of the rail open for the rest of the session. The summary
  // still says whether it is filled in, so the state is never hidden.
  const status = !hydrated
    ? ""
    : token && siteId
      ? `${siteId} · token set`
      : token
        ? "token set"
        : siteId
          ? `${siteId} · no token`
          : "Not set"

  return (
    <details className="doc-creds">
      <summary className="doc-creds-summary">
        <span className="doc-creds-caret" aria-hidden="true" />
        <span className="doc-creds-title">Your account</span>
        <span className={`doc-creds-status${has ? " is-set" : ""}`}>{status}</span>
      </summary>

      <div className="doc-creds-body">
        <label className="doc-creds-field">
          <span>SiteID</span>
          <input
            value={siteId}
            onChange={(e) => setCredentials({ siteId: e.target.value })}
            placeholder="1687"
            inputMode="numeric"
            spellCheck={false}
          />
        </label>

        <label className="doc-creds-field">
          <span>Token</span>
          <input
            value={token}
            onChange={(e) => setCredentials({ token: e.target.value })}
            placeholder="Paste your token"
            spellCheck={false}
          />
        </label>

        <div className="doc-creds-foot">
          <p className="doc-creds-note">
            Kept in this browser. Every sample rewrites itself to use these
            values, and they are sent nowhere except the API itself.
          </p>
          {has ? (
            <button type="button" className="doc-creds-clear" onClick={clear}>
              Clear
            </button>
          ) : null}
        </div>
      </div>
    </details>
  )
}

/** Groups collapse, so a long reference reads as seven sections, not thirty links. */
const Sidebar: React.FC = () => {
  const { activeId, setActiveId } = useDocsState()
  const activeGroup = endpoints.find((e) => e.id === activeId)?.group
  const [openGroups, setOpenGroups] = useState<string[]>(["getting-started"])

  // Following a link or a search hit should reveal the group it lives in.
  useEffect(() => {
    if (activeGroup) {
      setOpenGroups((current) =>
        current.includes(activeGroup) ? current : [...current, activeGroup]
      )
    }
  }, [activeGroup])

  const [introOpen, setIntroOpen] = useState(true)

  return (
    <nav className="doc-sidebar" aria-label="API reference">
      {/* The introduction carries rules rather than routes, but it is as
          navigable as any group, so it folds the same way. */}
      <div className="doc-sidebar-group">
        <button
          type="button"
          className={`doc-sidebar-heading${introOpen ? " is-open" : ""}`}
          aria-expanded={introOpen}
          onClick={() => setIntroOpen((v) => !v)}
        >
          <span className="doc-sidebar-caret" aria-hidden="true" />
          Introduction
          <span className="doc-sidebar-count">{introSections.length}</span>
        </button>

        {introOpen ? (
          <ul className="doc-sidebar-list">
            {introSections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="doc-sidebar-link">
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {endpointsByGroup.map(({ group, endpoints: list }) => {
        const open = openGroups.includes(group.id)
        return (
          <div key={group.id} className="doc-sidebar-group" id={group.id}>
            <button
              type="button"
              className={`doc-sidebar-heading${open ? " is-open" : ""}`}
              aria-expanded={open}
              onClick={() =>
                setOpenGroups((current) =>
                  current.includes(group.id)
                    ? current.filter((g) => g !== group.id)
                    : [...current, group.id]
                )
              }
            >
              <span className="doc-sidebar-caret" aria-hidden="true" />
              {group.title}
              <span className="doc-sidebar-count">{list.length}</span>
            </button>

            {open ? (
              <ul className="doc-sidebar-list">
                {list.map((endpoint) => (
                  <li key={endpoint.id}>
                    <a
                      href={`#${endpoint.id}`}
                      onClick={() => setActiveId(endpoint.id)}
                      className={`doc-sidebar-link${
                        endpoint.id === activeId ? " is-active" : ""
                      }`}
                    >
                      <span
                        className={`doc-dot doc-dot-${endpoint.method.toLowerCase()}`}
                        aria-hidden="true"
                      />
                      {endpoint.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )
      })}
    </nav>
  )
}

/**
 * The code for the open endpoint.
 *
 * Every endpoint's panel stays mounted and only the active one is shown, so
 * the built HTML still carries all twenty-six sets of samples for agents and
 * for find-in-page, rather than only whichever one happens to be selected.
 */
const Rail: React.FC = () => {
  const { activeId, variantFor } = useDocsState()

  return (
    <aside className="doc-rail" aria-label="Request console">
      <Credentials />

      {!activeId ? (
        <p className="doc-rail-empty">
          Open an endpoint to see its request, its response, and a console for
          running it.
        </p>
      ) : null}

      {endpoints.map((endpoint) => {
        const variant =
          endpoint.variants.find((v) => v.id === variantFor(endpoint.id)) ??
          endpoint.variants[0]
        if (!variant) return null
        return (
          <div
            key={endpoint.id}
            className="doc-rail-panel"
            hidden={endpoint.id !== activeId}
          >
            <div className="doc-rail-for">{endpoint.title}</div>
            <CodePanel endpoint={endpoint} variant={variant} />
          </div>
        )
      })}
    </aside>
  )
}

const Shell: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const typing =
        target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="api-docs" dir="ltr" lang="en">
      <header className="doc-topbar">
        <a className="doc-brand" href={withPrefix("/")}>
          <img className="doc-brand-logo" src={logo} alt="שלח מסר - SendMsg" />
        </a>

        <button
          type="button"
          className="doc-searchbtn"
          onClick={() => setSearchOpen(true)}
        >
          Search endpoints
          <kbd>⌘K</kbd>
        </button>

        <button
          type="button"
          className="doc-navtoggle"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          {navOpen ? "Hide contents" : "Contents"}
        </button>
      </header>

      <div className={`doc-body${navOpen ? " nav-open" : ""}`}>
        <Sidebar />
        <main className="doc-main">{children}</main>
        <Rail />
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

const DocsLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <TokenProvider>
    <DocsStateProvider>
      <Shell>{children}</Shell>
    </DocsStateProvider>
  </TokenProvider>
)

export default DocsLayout
