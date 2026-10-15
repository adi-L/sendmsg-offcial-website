import React, { useMemo, useState } from "react"
import { graphql, PageProps } from "gatsby"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { KB_ARTICLES, KB_CATEGORIES, KbArticle } from "../data/kb"
import "../styles/kb.css"
import { articleLocale, defaultLocale, formatText } from "../locales/config"
import type { PageContext } from "../locales/config"
import { useLocale } from "../locales/LocaleContext"
import { useText } from "../locales/LocaleContext"
import Rich from "../locales/Rich"
import LocalizedLink from "../locales/LocalizedLink"
import heText from "../locales/he/pages/kb.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

/* ── /kb/ — מרכז ההדרכה ─────────────────────────────────────────
   The index over every guide. src/data/kb.ts holds the full crawled
   catalogue; the ones imported into content/kb/<lang>/ are matched to it by
   source url and linked internally, the rest still open on
   sendmsg.co.il. That keeps the index whole while the migration runs.

   The live page shows 30 cards at a time behind a filter, which hides
   most of what exists — you cannot tell from it that there are 98
   guides. So this page inverts that: everything is on the page, and
   the controls narrow it rather than reveal it. Search is the real
   control here; the category chips are the browse path for someone
   who does not yet know the word to type. */

const LABELS = new Map(KB_CATEGORIES.map((c) => [c.id, c.label]))

/* Counts come from the data, never from a number typed in the copy. */
const COUNTS = new Map(
  KB_CATEGORIES.map((c) => [
    c.id,
    KB_ARTICLES.filter((a) => a.cats.includes(c.id)).length,
  ])
)

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" focusable="false">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </svg>
)

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M14 4h6v6M20 4l-8.5 8.5M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </svg>
)

const GoIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
)

/* The guides are being migrated in batches, so the index is mixed for
   a while: a guide that lives in the repo gets an internal link, one
   that does not still opens on sendmsg.co.il. The row says which it
   is rather than leaving the reader to find out by clicking. */
const Row: React.FC<{
  a: KbArticle
  showCats?: boolean
  local?: Local
}> = ({ a, showCats, local }) => {
  const t = useText(TEXT)
  const localSlug = local?.slug
  const inner = (
    <>
      <span className="kb-row-t">{a.title}</span>
      {showCats && local?.excerpt && (
        <span className="kb-row-ex">{local.excerpt}</span>
      )}
      {showCats && (
        <span className="kb-row-cats">
          {a.cats.map((c) => LABELS.get(c)).join(" · ")}
        </span>
      )}
      <span className="kb-row-go" aria-hidden="true">
        {localSlug ? <GoIcon /> : <ExternalIcon />}
      </span>
      {!localSlug && (
        <span className="kb-sr">{t.sr}</span>
      )}
    </>
  )

  return (
    <li>
      {localSlug ? (
        <LocalizedLink to={`/kb/${localSlug}/`}>{inner}</LocalizedLink>
      ) : (
        <a href={a.url} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      )}
    </li>
  )
}

interface Data {
  allMarkdownRemark: {
    nodes: Array<{
      fileAbsolutePath: string
      frontmatter: {
        slug: string
        source: string | null
        excerpt: string | null
      }
    }>
  }
}

type Local = { slug: string; excerpt: string | null }

const KbPage: React.FC<PageProps<Data>> = ({ data }) => {
  const t = useText(TEXT)
  const locale = useLocale()
  /* source url -> the imported guide, matched on the decoded path
     because the live links are inconsistent about percent-encoding. */
  const local = useMemo(() => {
    const key = (u: string) => {
      try {
        return decodeURIComponent(new URL(u).pathname).replace(/^\/|\/$/g, "").toLowerCase()
      } catch {
        return u
      }
    }
    const m = new Map<string, Local>()
    for (const n of data.allMarkdownRemark.nodes) {
      /* Only guides in this page's language (content/kb/he/ is Hebrew). */
      if ((articleLocale(n.fileAbsolutePath) ?? defaultLocale) !== locale) continue
      if (n.frontmatter.source) {
        m.set(key(n.frontmatter.source), {
          slug: n.frontmatter.slug,
          excerpt: n.frontmatter.excerpt,
        })
      }
    }
    return { get: (u: string) => m.get(key(u)) }
  }, [data, locale])

  const [query, setQuery] = useState("")
  const [cat, setCat] = useState<string | null>(null)

  const q = query.trim()

  /* Search covers the opening paragraph too, not just the title. Most
     guide titles name a feature, so a reader searching for the problem
     ("לא מגיע לתיבה") matches nothing on titles alone. */
  const matches = useMemo(() => {
    if (!q) return null
    const needle = q.toLowerCase()
    return KB_ARTICLES.filter((a) => {
      if (a.title.toLowerCase().includes(needle)) return true
      const ex = local.get(a.url)?.excerpt
      return !!ex && ex.toLowerCase().includes(needle)
    })
  }, [q, local])

  /* Search wins over the chips: typing is a more specific intent than
     the category you happened to have open. */
  const shown = matches
    ? matches
    : cat
      ? KB_ARTICLES.filter((a) => a.cats.includes(cat))
      : KB_ARTICLES

  const groups = KB_CATEGORIES.map((c) => ({
    c,
    items: KB_ARTICLES.filter((a) => a.cats.includes(c.id)),
  }))

  return (
    <Layout>
      <div className="kb">
        <section className="kb-hero">
          <div className="container">
            <h1>{t.h1}</h1>
            <p className="kb-hero-sub">
              {t.heroSub}
            </p>
            <p className="kb-hero-note">
              <Rich
                text={formatText(t.heroNote, {
                  guides: KB_ARTICLES.length,
                  cats: KB_CATEGORIES.length,
                })}
              />
            </p>
          </div>
        </section>

        {/* Sticky, because on a page this long the controls have to stay
            within reach of whatever you are reading. */}
        <div className="kb-bar">
          <div className="container">
            <div className="kb-bar-in">
              <div className="kb-search">
                <span className="kb-search-ico" aria-hidden="true">
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  id="kb-q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.placeholder}
                  aria-label={t.ariaLabel}
                />
                {q && (
                  <button
                    type="button"
                    className="kb-search-clear"
                    onClick={() => setQuery("")}
                    aria-label={t.ariaLabel2}
                  >
                    <ClearIcon />
                  </button>
                )}
              </div>

              <div className="kb-chips" role="group" aria-label={t.ariaLabel3}>
                <button
                  type="button"
                  className="kb-chip"
                  aria-pressed={cat === null}
                  onClick={() => setCat(null)}
                >
                  {t.chip}
                  <span className="kb-chip-n">{KB_ARTICLES.length}</span>
                </button>
                {KB_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="kb-chip"
                    aria-pressed={cat === c.id}
                    onClick={() => setCat(cat === c.id ? null : c.id)}
                  >
                    {c.label}
                    <span className="kb-chip-n">{COUNTS.get(c.id)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="kb-results">
          <div className="container">
            <p className="kb-count" aria-live="polite">
              {q
                ? formatText(t.resultsFor, { n: shown.length, q })
                : cat
                  ? formatText(t.inCategory, { n: shown.length, cat: LABELS.get(cat) ?? "" })
                  : formatText(t.total, { n: KB_ARTICLES.length })}
            </p>

            {shown.length === 0 && (
              <div className="kb-empty">
                <p className="kb-empty-t">{t.emptyT}</p>
                <p>
                  <Rich text={t.p} />
                </p>
                <button type="button" className="kb-btn" onClick={() => setQuery("")}>
                  {t.btn}
                </button>
              </div>
            )}

            {/* Flat while narrowed, grouped while browsing: a filtered
                set has already answered "which category", and a reader
                browsing the whole thing needs the grouping to navigate. */}
            {shown.length > 0 && (q || cat) && (
              <ul className="kb-rows">
                {shown.map((a) => (
                  <Row key={a.url} a={a} showCats={!!q} local={local.get(a.url)} />
                ))}
              </ul>
            )}

            {!q && !cat &&
              groups.map(({ c, items }) => (
                <div className="kb-group" key={c.id}>
                  <div className="kb-group-head">
                    <h2>{c.label}</h2>
                    <span className="kb-group-n">{formatText(t.groupN, { n: items.length })}</span>
                  </div>
                  <ul className="kb-rows">
                    {items.map((a) => (
                      <Row key={a.url} a={a} local={local.get(a.url)} />
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default KbPage

export const query = graphql`
  query KbIndex {
    allMarkdownRemark(filter: { frontmatter: { source: { ne: null } } }) {
      nodes {
        fileAbsolutePath
        frontmatter {
          slug
          source
          excerpt
        }
      }
    }
  }
`

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = TEXT[pageContext.locale]
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/kb/"
    />
  )
}
