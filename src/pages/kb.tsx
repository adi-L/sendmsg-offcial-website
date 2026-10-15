import React, { useMemo, useState } from "react"
import { graphql, PageProps } from "gatsby"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import "../styles/kb.css"
import { articleLocale, defaultLocale, formatText } from "../locales/config"
import type { PageContext } from "../locales/config"
import { useLocale, useText } from "../locales/LocaleContext"
import Rich from "../locales/Rich"
import LocalizedLink from "../locales/LocalizedLink"
import heText from "../locales/he/pages/kb.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

/* ── /kb/ — מרכז ההדרכה ─────────────────────────────────────────
   The index over every guide, built from the guides themselves: the
   markdown in content/kb/<lang>/ for this page's language. Each guide's
   frontmatter gives its title, its place in the list (`order`) and its
   categories, which are matched by name to `categories` in this page's
   JSON. (src/data/kb.ts, the crawl of the live index, now only feeds
   scripts/import-kb.py.)

   The live page shows 30 cards at a time behind a filter, which hides
   most of what exists — you cannot tell from it that there are 98
   guides. So this page inverts that: everything is on the page, and
   the controls narrow it rather than reveal it. Search is the real
   control here; the category chips are the browse path for someone
   who does not yet know the word to type. */

/* A guide as the index shows it; `cats` are category ids. */
type Guide = { title: string; slug: string; excerpt: string | null; cats: string[] }

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

const GoIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
)

const Row: React.FC<{
  a: Guide
  showCats?: boolean
  labels: Map<string, string>
}> = ({ a, showCats, labels }) => (
  <li>
    <LocalizedLink to={`/kb/${a.slug}/`}>
      <span className="kb-row-t">{a.title}</span>
      {showCats && a.excerpt && <span className="kb-row-ex">{a.excerpt}</span>}
      {showCats && (
        <span className="kb-row-cats">{a.cats.map((c) => labels.get(c)).join(" · ")}</span>
      )}
      <span className="kb-row-go" aria-hidden="true">
        <GoIcon />
      </span>
    </LocalizedLink>
  </li>
)

interface Data {
  allMarkdownRemark: {
    nodes: Array<{
      fileAbsolutePath: string
      frontmatter: {
        title: string
        slug: string
        order: number | null
        categories: string[] | null
        excerpt: string | null
      }
    }>
  }
}

const KbPage: React.FC<PageProps<Data>> = ({ data }) => {
  const t = useText(TEXT)
  const locale = useLocale()
  const categories = t.categories
  const labels = useMemo(() => new Map(categories.map((c) => [c.id, c.label])), [categories])

  /* This language's guides, in index order. A category name the JSON
     doesn't list is dropped (tests/kb-categories catches that). */
  const guides = useMemo<Guide[]>(() => {
    const idOf = new Map(categories.map((c) => [c.label, c.id]))
    return data.allMarkdownRemark.nodes
      .filter((n) => (articleLocale(n.fileAbsolutePath) ?? defaultLocale) === locale)
      .map((n) => ({
        title: n.frontmatter.title,
        slug: n.frontmatter.slug,
        excerpt: n.frontmatter.excerpt,
        order: n.frontmatter.order ?? Number.MAX_SAFE_INTEGER,
        cats: (n.frontmatter.categories ?? []).flatMap((c) => idOf.get(c) ?? []),
      }))
      .sort((x, y) => x.order - y.order || x.title.localeCompare(y.title))
      .map(({ order: _order, ...g }) => g)
  }, [data, locale, categories])

  /* Counts come from the data, never from a number typed in the copy. */
  const counts = useMemo(
    () => new Map(categories.map((c) => [c.id, guides.filter((g) => g.cats.includes(c.id)).length])),
    [categories, guides]
  )

  const [query, setQuery] = useState("")
  const [cat, setCat] = useState<string | null>(null)

  const q = query.trim()

  /* Search covers the opening paragraph too, not just the title. Most
     guide titles name a feature, so a reader searching for the problem
     ("לא מגיע לתיבה") matches nothing on titles alone. */
  const matches = useMemo(() => {
    if (!q) return null
    const needle = q.toLowerCase()
    return guides.filter((a) => {
      if (a.title.toLowerCase().includes(needle)) return true
      return !!a.excerpt && a.excerpt.toLowerCase().includes(needle)
    })
  }, [q, guides])

  /* Search wins over the chips: typing is a more specific intent than
     the category you happened to have open. */
  const shown = matches
    ? matches
    : cat
      ? guides.filter((a) => a.cats.includes(cat))
      : guides

  const groups = categories.map((c) => ({
    c,
    items: guides.filter((a) => a.cats.includes(c.id)),
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
                  guides: guides.length,
                  cats: categories.length,
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
                  <span className="kb-chip-n">{guides.length}</span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="kb-chip"
                    aria-pressed={cat === c.id}
                    onClick={() => setCat(cat === c.id ? null : c.id)}
                  >
                    {c.label}
                    <span className="kb-chip-n">{counts.get(c.id)}</span>
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
                  ? formatText(t.inCategory, { n: shown.length, cat: labels.get(cat) ?? "" })
                  : formatText(t.total, { n: guides.length })}
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
                  <Row key={a.slug} a={a} showCats={!!q} labels={labels} />
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
                      <Row key={a.slug} a={a} labels={labels} />
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
    # Guides only, every language; the page keeps its own. Blog posts are
    # markdown too, so the path filter is what keeps them out.
    allMarkdownRemark(filter: { fileAbsolutePath: { regex: "//content/kb//" } }) {
      nodes {
        fileAbsolutePath
        frontmatter {
          title
          slug
          order
          categories
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
