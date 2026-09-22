import React from "react"
import { graphql, PageProps, HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import InlineCTA from "../components/InlineCTA"
import "../styles/blog.css"

import imgEmailFrequency from "../images/blog/email-frequency.webp"
import imgCourseGuide from "../images/blog/digital-course-guide.webp"
import imgMarketingStrategy from "../images/blog/marketing-strategy.webp"

import authorAsaf from "../images/team/asaf-stern.webp"
import authorYifat from "../images/team/yifat.webp"

/* Thumbnails and author photos live in src/images; posts reference them
   by slug / author name until frontmatter carries real image paths. */
const postImages: Record<string, string> = {
  "email-frequency": imgEmailFrequency,
  "digital-course-guide": imgCourseGuide,
  "5-rules-campaign": imgMarketingStrategy,
}

const authorPhotos: Record<string, string> = {
  "אסף שטרן": authorAsaf,
  "יפעת הלוי": authorYifat,
  "יפת הלוי": authorYifat,
}

interface BlogData {
  allMarkdownRemark: {
    nodes: Array<{
      id: string
      frontmatter: {
        title: string
        slug: string
        date: string
        excerpt: string
        category: string
        author: string | null
        featuredImage: string | null
      }
      timeToRead: number
    }>
  }
}

type Post = BlogData["allMarkdownRemark"]["nodes"][number]

const postImage = (post: Post) =>
  post.frontmatter.featuredImage || postImages[post.frontmatter.slug] || null

const PostMeta: React.FC<{ post: Post }> = ({ post }) => {
  const author = post.frontmatter.author
  const photo = author ? authorPhotos[author] : null
  return (
    <div className="bl-meta">
      {photo && <img src={photo} alt="" role="presentation" loading="lazy" />}
      {author && <strong>{author}</strong>}
      {author && <span className="bl-meta-sep">·</span>}
      <span>{post.frontmatter.date}</span>
      <span className="bl-meta-sep">·</span>
      <span>{post.timeToRead <= 1 ? "דקת קריאה" : `${post.timeToRead} דקות קריאה`}</span>
    </div>
  )
}

const BlogPage: React.FC<PageProps<BlogData>> = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes
  const [activeCategory, setActiveCategory] = React.useState("הכל")

  const categories = ["הכל", ...Array.from(new Set(posts.map((p) => p.frontmatter.category)))]

  const filtered =
    activeCategory === "הכל" ? posts : posts.filter((p) => p.frontmatter.category === activeCategory)

  const [featured, ...rest] = activeCategory === "הכל" && filtered.length > 1 ? filtered : [null, ...filtered]

  return (
    <Layout>
      <div className="bl">
        <section className="bl-hero">
          <div className="container">
            <h1>מרכז הידע</h1>
            <p>מדריכים, טיפים ורעיונות מהשטח, שיעזרו לכם לשווק את העסק טוב יותר.</p>
          </div>
        </section>

        <section style={{ padding: "0 0 72px" }}>
          <div className="container">
            <div className="bl-cats">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="bl-cat"
                  data-active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {featured && (
              <a href={`/blog/${featured.frontmatter.slug}/`} className="bl-featured">
                <div className="bl-featured-img">
                  {postImage(featured) && (
                    <img src={postImage(featured)!} alt={featured.frontmatter.title} />
                  )}
                </div>
                <div className="bl-featured-body">
                  <span className="bl-stamp">המאמר החדש</span>
                  <span className="bl-chip">{featured.frontmatter.category}</span>
                  <h2>{featured.frontmatter.title}</h2>
                  <p className="bl-excerpt">{featured.frontmatter.excerpt}</p>
                  <div className="bl-tear" aria-hidden="true" />
                  <PostMeta post={featured} />
                  <span className="bl-more">להמשך קריאה ←</span>
                </div>
              </a>
            )}

            <div className="bl-grid">
              {rest.filter(Boolean).map((post) => (
                <a key={post!.id} href={`/blog/${post!.frontmatter.slug}/`} className="bl-card">
                  <div className="bl-card-img">
                    {postImage(post!) && (
                      <img src={postImage(post!)!} alt={post!.frontmatter.title} loading="lazy" />
                    )}
                  </div>
                  <div className="bl-card-body">
                    <span className="bl-chip">{post!.frontmatter.category}</span>
                    <h2>{post!.frontmatter.title}</h2>
                    <p className="bl-excerpt">{post!.frontmatter.excerpt}</p>
                    <div className="bl-tear" aria-hidden="true" />
                    <PostMeta post={post!} />
                  </div>
                </a>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="bl-empty">
                <strong>עדיין אין מאמרים בקטגוריה הזו</strong>
                אנחנו כותבים כל הזמן. שווה להציץ שוב בקרוב.
              </div>
            )}
          </div>
        </section>
      </div>

      <InlineCTA
        title="במקום רק לקרוא על שיווק, אפשר גם להתחיל"
        note="בלי כרטיס אשראי, בלי התחייבות"
      />
    </Layout>
  )
}

export default BlogPage

export const Head: HeadFC = () => (
  <SEO title="מרכז הידע" description="מדריכים, טיפים ורעיונות לשיווק דיגיטלי מוצלח מצוות שלח מסר" pathname="/blog/" />
)

export const query = graphql`
  query BlogList {
    allMarkdownRemark(
      filter: { frontmatter: { slug: { ne: null } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        frontmatter {
          title
          slug
          date(formatString: "DD/MM/YYYY")
          excerpt
          category
          author
          featuredImage
        }
        timeToRead
      }
    }
  }
`
