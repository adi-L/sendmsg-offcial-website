import React from "react"
import { graphql, PageProps, HeadFC } from "gatsby"
import { prepareArticleImages, ImageSizes } from "../utils/article-images"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import type { PageContext } from "../locales/config"
import { useLocalePath, useText } from "../locales/LocaleContext"
import { formatText } from "../locales/config"
import { article, breadcrumbs, SITE_URL } from "../utils/structured-data"
import heText from "../locales/he/templates/blog-post.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

interface BlogPostData {
  markdownRemark: {
    html: string
    frontmatter: {
      title: string
      date: string
      isoDate: string | null
      category: string
      excerpt: string
      slug: string
      author: string
      featuredImage: string | null
    }
    timeToRead: number
  }
}

type Context = { imageSizes?: ImageSizes }

const BlogPostTemplate: React.FC<PageProps<BlogPostData, Context>> = ({
  data,
  pageContext,
}) => {
  const t = useText(TEXT)
  const lp = useLocalePath()
  const post = data.markdownRemark

  return (
    <Layout>
      <article style={styles.article}>
        <div className="container" style={styles.container}>
          <div style={styles.breadcrumbs}>
            <a href={lp("/")}>{t.a}</a> &gt; <a href={lp("/blog/")}>{t.a2}</a> &gt;{" "}
            <span>{post.frontmatter.title}</span>
          </div>

          <header style={styles.header}>
            <span style={styles.category}>{post.frontmatter.category}</span>
            <h1 style={styles.title}>{post.frontmatter.title}</h1>
            <div style={styles.meta}>
              <span>{post.frontmatter.author}</span>
              <span>·</span>
              <span>{post.frontmatter.date}</span>
              <span>·</span>
              <span>{formatText(t.readTime, { n: post.timeToRead })}</span>
            </div>
          </header>

          <div
            style={styles.content}
            dangerouslySetInnerHTML={{
              __html: prepareArticleImages(
                post.html,
                "blog-images",
                pageContext.imageSizes
              ),
            }}
          />
        </div>
      </article>
    </Layout>
  )
}

export default BlogPostTemplate

export const Head: HeadFC<BlogPostData, PageContext> = ({ data, pageContext }) => {
  const f = data.markdownRemark.frontmatter
  const t = TEXT[pageContext.locale]
  const path = `/blog/${f.slug}/`
  return (
    <SEO locale={pageContext.locale} availableIn={[pageContext.locale]}
      title={f.title}
      description={f.excerpt}
      pathname={path}
      image={f.featuredImage ?? undefined}
      ogType="article"
      publishedTime={f.isoDate ?? undefined}
      schema={[
        article({
          type: "BlogPosting",
          title: f.title,
          description: f.excerpt,
          path,
          date: f.isoDate ?? undefined,
          author: f.author,
          image: f.featuredImage ? `${SITE_URL}${f.featuredImage}` : undefined,
          inLanguage: pageContext.locale,
        }),
        // the same trail the page shows above the title
        breadcrumbs([
          { name: t.a, path: "/" },
          { name: t.a2, path: "/blog/" },
          { name: f.title, path },
        ]),
      ]}
    />
  )
}

export const query = graphql`
  query BlogPost($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        date(formatString: "DD/MM/YYYY")
        isoDate: date(formatString: "YYYY-MM-DD")
        category
        excerpt
        slug
        author
        featuredImage
      }
      timeToRead
    }
  }
`

const styles: Record<string, React.CSSProperties> = {
  article: {
    padding: "40px 0 80px",
  },
  container: {
    maxWidth: "800px",
  },
  breadcrumbs: {
    fontSize: "0.85rem",
    color: "var(--text-light)",
    marginBottom: "32px",
  },
  header: {
    marginBottom: "40px",
  },
  category: {
    display: "inline-block",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--primary-pink)",
    marginBottom: "12px",
  },
  title: {
    fontSize: "2.4rem",
    fontWeight: 800,
    lineHeight: 1.3,
    marginBottom: "16px",
  },
  meta: {
    display: "flex",
    gap: "8px",
    fontSize: "0.9rem",
    color: "var(--text-light)",
  },
  content: {
    fontSize: "1.05rem",
    lineHeight: 1.8,
    color: "var(--text-dark)",
  },
}
