import React from "react"
import { graphql, withPrefix, PageProps, HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"

interface BlogPostData {
  markdownRemark: {
    html: string
    frontmatter: {
      title: string
      date: string
      category: string
      excerpt: string
      slug: string
      author: string
    }
    timeToRead: number
  }
}

const BlogPostTemplate: React.FC<PageProps<BlogPostData>> = ({ data }) => {
  const post = data.markdownRemark

  return (
    <Layout>
      <article style={styles.article}>
        <div className="container" style={styles.container}>
          <div style={styles.breadcrumbs}>
            <a href={withPrefix("/")}>ראשי</a> &gt; <a href={withPrefix("/blog/")}>מרכז הידע</a> &gt;{" "}
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
              <span>{post.timeToRead} דקות קריאה</span>
            </div>
          </header>

          <div
            style={styles.content}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </article>
    </Layout>
  )
}

export default BlogPostTemplate

export const Head: HeadFC<BlogPostData> = ({ data }) => (
  <SEO
    title={data.markdownRemark.frontmatter.title}
    description={data.markdownRemark.frontmatter.excerpt}
    pathname={`/blog/${data.markdownRemark.frontmatter.slug}/`}
  />
)

export const query = graphql`
  query BlogPost($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        date(formatString: "DD/MM/YYYY")
        category
        excerpt
        slug
        author
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
