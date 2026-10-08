import React from "react"
import { graphql, Link, PageProps, HeadFC } from "gatsby"
import { prepareArticleImages, ImageSizes } from "../utils/article-images"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import "../styles/kb-article.css"

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
  const g = data.markdownRemark
  const { title, author, categories, tags } = g.frontmatter

  return (
    <Layout>
      <div className="kba">
        <section className="kba-hero">
          <div className="container">
            <Link to="/kb/" className="kba-back">
              <span aria-hidden="true">
                <BackIcon />
              </span>
              מרכז ההדרכה
            </Link>
            <h1>{title}</h1>
            <p className="kba-meta">
              {categories && categories.length > 0 && (
                <span>{categories.join(" · ")}</span>
              )}
              <span>
                {g.timeToRead <= 1 ? "כדקה קריאה" : `כ-${g.timeToRead} דקות קריאה`}
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
              <ul className="kba-tags" aria-label="תגיות">
                {tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}

            <div className="kba-foot">
              <Link to="/kb/" className="kba-foot-link">
                <span aria-hidden="true">
                  <BackIcon />
                </span>
                לכל המדריכים
              </Link>
              <p>
                לא הסתדר? <Link to="/support/">התמיכה כאן</Link>, ראשון עד חמישי{" "}
                <span className="kba-ltr">9:00–17:00</span>.
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
      }
    }
  }
`

export const Head: HeadFC<Data> = ({ data }) => {
  const f = data.markdownRemark.frontmatter
  return (
    <SEO
      title={f.title}
      description={`מדריך שלח מסר: ${f.title}. צעד אחר צעד, עם צילומי מסך מהמערכת.`}
      pathname={`/kb/${f.slug}/`}
    />
  )
}
