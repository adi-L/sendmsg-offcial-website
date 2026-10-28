import React from "react"
import { graphql, PageProps, HeadFC } from "gatsby"
import { prepareArticleImages, ImageSizes } from "../utils/article-images"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import "../styles/kb-article.css"
import { formatText } from "../locales/config"
import type { PageContext } from "../locales/config"
import LocalizedLink from "../locales/LocalizedLink"
import { useText } from "../locales/LocaleContext"
import Rich from "../locales/Rich"
import { article, breadcrumbs, SITE_URL } from "../utils/structured-data"
import commonText from "../locales/he/common.json"
import heText from "../locales/he/templates/kb-article.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }
const COMMON = { he: commonText }

/* ── a single guide ─────────────────────────────────────────────
   Imported from the live knowledge base by scripts/import-kb.py.
   The body is the guide's own markdown, so this file owns only the
   reading experience around it: a measured column, screenshots that
   behave, and a way back to the index.

   Guides are read while the reader is doing the thing, usually with
   the product open in another window, so the page stays quiet and
   the screenshots carry the weight. */

interface Data {
  markdownRemark: {
    html: string
    timeToRead: number
    frontmatter: {
      title: string
      slug: string
      source: string | null
      author: string | null
      categories: string[] | null
      tags: string[] | null
      featuredImage: string | null
    }
  }
}

const BackIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)


type Context = { imageSizes?: ImageSizes }

const KbArticle: React.FC<PageProps<Data, Context>> = ({
  data,
  pageContext,
}) => {
  const t = useText(TEXT)
  const g = data.markdownRemark
  const { title, author, categories, tags } = g.frontmatter

  return (
    <Layout>
      <div className="kba">
        <section className="kba-hero">
          <div className="container">
            <LocalizedLink to="/kb/" className="kba-back">
              <span aria-hidden="true">
                <BackIcon />
              </span>
              {t.back}
            </LocalizedLink>
            <h1>{title}</h1>
            <p className="kba-meta">
              {categories && categories.length > 0 && (
                <span>{categories.join(" · ")}</span>
              )}
              <span>
                {g.timeToRead <= 1 ? t.readOne : formatText(t.readMany, { n: g.timeToRead })}
              </span>
              {author && <span>{author}</span>}
            </p>
          </div>
        </section>

        <section className="kba-body">
          <div className="container">
            <div
              className="kba-prose"
              dangerouslySetInnerHTML={{
                __html: prepareArticleImages(
                  g.html,
                  "kb-images",
                  pageContext.imageSizes
                ),
              }}
            />

            {tags && tags.length > 0 && (
              <ul className="kba-tags" aria-label={t.ariaLabel}>
                {tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}

            <div className="kba-foot">
              <LocalizedLink to="/kb/" className="kba-foot-link">
                <span aria-hidden="true">
                  <BackIcon />
                </span>
                {t.footLink}
              </LocalizedLink>
              <p>
                <Rich text={t.p} ltrClass="kba-ltr" />
              </p>
            </div>
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default KbArticle

export const query = graphql`
  query KbArticle($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      timeToRead
      frontmatter {
        title
        slug
        source
        author
        categories
        tags
        featuredImage
      }
    }
  }
`

export const Head: HeadFC<Data, PageContext> = ({ data, pageContext }) => {
  const f = data.markdownRemark.frontmatter
  const t = TEXT[pageContext.locale]
  const path = `/kb/${f.slug}/`
  const description = formatText(t.seoDescription, { title: f.title })
  return (
    <SEO locale={pageContext.locale} availableIn={[pageContext.locale]}
      title={f.title}
      description={description}
      pathname={path}
      image={f.featuredImage ?? undefined}
      ogType="article"
      schema={[
        article({
          type: "TechArticle",
          title: f.title,
          description,
          path,
          author: f.author ?? undefined,
          image: f.featuredImage ? `${SITE_URL}${f.featuredImage}` : undefined,
          inLanguage: pageContext.locale,
        }),
        breadcrumbs([
          { name: COMMON[pageContext.locale].seo.orgName, path: "/" },
          { name: t.back, path: "/kb/" },
          { name: f.title, path },
        ]),
      ]}
    />
  )
}
