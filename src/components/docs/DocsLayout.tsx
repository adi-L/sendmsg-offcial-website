import React, { useEffect, useRef, useState, type ReactNode } from "react"
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

/**
 * Drawn rather than typed: a hamburger set in glyphs drifts with the font and
 * never matches the caret and dot already on this page. One stroke weight,
 * one cap, and the same box whichever state it is in, so the button does not
 * move when it switches.
 */
const MenuIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className="doc-navtoggle-icon"
    viewBox="0 0 18 18"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    aria-hidden="true"
  >
    {open ? (
      <>
        <path d="M4 4 L14 14" />
        <path d="M14 4 L4 14" />
      </>
    ) : (
      <>
        <path d="M2.5 5h13" />
        <path d="M2.5 9h13" />
        <path d="M2.5 13h13" />
      </>
    )}
  </svg>
)

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
const Sidebar: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
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
    <nav className="doc-sidebar" id="doc-sidebar" aria-label="API reference">
      {/* Only ever seen while this is a drawer over the page. It dismisses
          the same way the console does, so the two panels do not each need
          learning separately. */}
      <div className="doc-sidebar-head">
        <span className="doc-sidebar-head-title">Contents</span>
        <button
          type="button"
          className="doc-sidebar-close"
          onClick={onNavigate}
          aria-label="Close the contents menu"
        >
          Done
        </button>
      </div>

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
        </button>

        {introOpen ? (
          <ul className="doc-sidebar-list">
            {introSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="doc-sidebar-link"
                  onClick={onNavigate}
                >
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
          /* no id here: the content <section> already owns group.id, and
             a duplicate both breaks 4.1.1 and makes "#group" land on the
             sidebar instead of the section it names */
          <div key={group.id} className="doc-sidebar-group">
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
            </button>

            {open ? (
              <ul className="doc-sidebar-list">
                {list.map((endpoint) => (
                  <li key={endpoint.id}>
                    <a
                      href={`#${endpoint.id}`}
                      onClick={() => {
                        setActiveId(endpoint.id)
                        onNavigate()
                      }}
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
const Rail: React.FC<{
  open: boolean
  onClose: () => void
  panelRef: React.RefObject<HTMLElement | null>
}> = ({ open, onClose, panelRef }) => {
  const { activeId, variantFor } = useDocsState()

  return (
    <aside
      ref={panelRef}
      className={`doc-rail${open ? " is-open" : ""}`}
      aria-label="Request console"
      // Focusable only as a target for moving focus into the panel when it
      // opens; it never joins the tab order itself. Taking it genuinely out of
      // the way while shut -- no tab stops inside, nothing for a screen reader
      // to wander into -- is `visibility: hidden` in the stylesheet, because
      // only the stylesheet knows whether this is a panel or a column at the
      // current width.
      tabIndex={-1}
    >
      <div className="doc-rail-head">
        <span className="doc-rail-head-title">Request console</span>
        <button
          type="button"
          className="doc-rail-close"
          onClick={onClose}
          aria-label="Close the request console"
        >
          <span aria-hidden="true">Done</span>
        </button>
      </div>

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

/** Wide enough for the rail to sit beside the reference; below it, it folds into a panel. */
const RAIL_BESIDE = "(min-width: 1181px)"
/** Wide enough for the contents list to stand as its own column. */
const NAV_BESIDE = "(min-width: 901px)"

const Shell: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [railOpen, setRailOpen] = useState(false)

  const { activeId } = useDocsState()
  const active = endpoints.find((e) => e.id === activeId)

  const railRef = useRef<HTMLElement>(null)
  const dockRef = useRef<HTMLButtonElement>(null)
  const navToggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const typing =
        target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "Escape") {
        setRailOpen(false)
        setNavOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Widening the window past the breakpoint puts the rail back in its column,
  // where "open" means nothing. Without this the scroll lock below would
  // outlive the panel and leave the page stuck.
  useEffect(() => {
    const panels: [string, (v: boolean) => void][] = [
      [RAIL_BESIDE, setRailOpen],
      [NAV_BESIDE, setNavOpen],
    ]
    const stop = panels.map(([query, close]) => {
      const mq = window.matchMedia(query)
      const sync = () => {
        if (mq.matches) close(false)
      }
      sync()
      mq.addEventListener("change", sync)
      return () => mq.removeEventListener("change", sync)
    })
    return () => stop.forEach((fn) => fn())
  }, [])

  // While the panel is over the page, the page behind it should not scroll,
  // and focus should be inside the panel rather than back in the reference.
  useEffect(() => {
    if (!railOpen && !navOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const panel = railOpen ? railRef.current : null
    // A frame later, not now: at this point the panel has the class but the
    // style recalc has not run, so it is still `visibility: hidden` and
    // focusing it silently does nothing.
    const frame = requestAnimationFrame(() => panel?.focus())
    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = previous
      // Only pull focus back if it is still in the panel; if something else
      // took it meanwhile, stealing it would be worse than leaving it.
      if (panel?.contains(document.activeElement)) dockRef.current?.focus()
      if (navToggleRef.current && document.activeElement === document.body) {
        navToggleRef.current.focus()
      }
    }
  }, [railOpen, navOpen])

  return (
    <div className="api-docs" dir="ltr" lang="en">
      {/* This page does not use the site Layout, so it needs its own bypass
          link: the sidebar lists every endpoint, which is a lot to tab
          through to reach the reference (WCAG 2.4.1). */}
      <a className="skip-link" href="#doc-main">
        Skip to content
      </a>
      <header className="doc-topbar">
        <a className="doc-brand" href={withPrefix("/")}>
          <img className="doc-brand-logo" src={logo} alt="שלח מסר - Sendmsg" />
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
          ref={navToggleRef}
          className={`doc-navtoggle${navOpen ? " is-open" : ""}`}
          aria-expanded={navOpen}
          aria-controls="doc-sidebar"
          onClick={() => setNavOpen((v) => !v)}
        >
          <MenuIcon open={navOpen} />
          {/* The word stays put whatever the state. Swapping it for "Hide
              contents" made the control read as if it acted on the page's
              content rather than on this list; the icon carries the state. */}
          Menu
        </button>
      </header>

      <div className={`doc-body${navOpen ? " nav-open" : ""}`}>
        <Sidebar onNavigate={() => setNavOpen(false)} />
        <main className="doc-main" id="doc-main" tabIndex={-1}>
          {children}
        </main>
        <Rail
          open={railOpen}
          onClose={() => setRailOpen(false)}
          panelRef={railRef}
        />
      </div>

      {/* The console is the working half of this page, and on a narrow screen
          the reference above it runs to thousands of pixels. So it gets a
          permanent handle at the bottom of the viewport rather than a place
          at the end of the document. It names the endpoint it would open
          with, which is also the cheapest way to show that tapping an
          endpoint upstairs changed what is waiting down here. */}
      <button
        type="button"
        ref={dockRef}
        className="doc-dock"
        aria-expanded={railOpen}
        onClick={() => setRailOpen((v) => !v)}
      >
        <span className="doc-dock-label">
          {active ? (
            <>
              <span
                className={`doc-dot doc-dot-${active.method.toLowerCase()}`}
                aria-hidden="true"
              />
              {active.title}
            </>
          ) : (
            "Request console"
          )}
        </span>
        <span className="doc-dock-action">{railOpen ? "Close" : "Open"}</span>
      </button>

      <div
        className={`doc-rail-scrim${railOpen || navOpen ? " is-open" : ""}`}
        onClick={() => {
          setRailOpen(false)
          setNavOpen(false)
        }}
        aria-hidden="true"
      />

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
