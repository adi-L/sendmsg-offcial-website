import React from "react"
import { graphql, withPrefix, PageProps, HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import InlineCTA from "../components/InlineCTA"
import "../styles/blog.css"

import imgEmailFrequency from "../images/blog/email-frequency.webp"
import imgCourseGuide from "../images/blog/digital-course-guide.webp"
import imgMarketingStrategy from "../images/blog/marketing-strategy.webp"

import authorAsaf from "../images/team/asaf-stern.webp"
import authorYifat from "../images/team/yifat.webp"
import { articleLocale, defaultLocale } from "../locales/config"
import type { PageContext } from "../locales/config"
import { useLocale } from "../locales/LocaleContext"
import { useText } from "../locales/LocaleContext"
import Rich from "../locales/Rich"
import LocalizedLink from "../locales/LocalizedLink"
import { formatText } from "../locales/config"
import heText from "../locales/he/pages/blog.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

/* Thumbnails and author photos live in src/images; posts reference them
   by slug / author name until frontmatter carries real image paths. The
   author names are keys matching the posts' frontmatter, not site text. */
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
      fileAbsolutePath: string
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

/* An imported image is already prefixed by webpack; a path out of
   frontmatter points at static/ and is not, so it needs withPrefix or
   it resolves against the domain root on the GitHub Pages deploy. */
const postImage = (post: Post) =>
  post.frontmatter.featuredImage
    ? withPrefix(post.frontmatter.featuredImage)
    : postImages[post.frontmatter.slug] || null

const PostMeta: React.FC<{ post: Post }> = ({ post }) => {
  const t = useText(TEXT)
  const author = post.frontmatter.author
  const photo = author ? authorPhotos[author] : null
  return (
    <div className="bl-meta">
      {photo && <img src={photo} alt="" role="presentation" loading="lazy" />}
      {author && <strong>{author}</strong>}
      {author && <span className="bl-meta-sep">·</span>}
      <span>{post.frontmatter.date}</span>
      <span className="bl-meta-sep">·</span>
      <span>{post.timeToRead <= 1 ? t.readOne : formatText(t.readMany, { n: post.timeToRead })}</span>
    </div>
  )
}

const BlogPage: React.FC<PageProps<BlogData>> = ({ data }) => {
  const t = useText(TEXT)
  /* Only this page's language: the folder is the language (content/blog/he/). */
  const locale = useLocale()
  const posts = data.allMarkdownRemark.nodes.filter(
    (n) => (articleLocale(n.fileAbsolutePath) ?? defaultLocale) === locale
  )
  const [activeCategory, setActiveCategory] = React.useState(t.all)

  const categories = [t.all, ...Array.from(new Set(posts.map((p) => p.frontmatter.category)))]

  const filtered =
    activeCategory === t.all ? posts : posts.filter((p) => p.frontmatter.category === activeCategory)

  const [featured, ...rest] = activeCategory === t.all && filtered.length > 1 ? filtered : [null, ...filtered]

  return (
    <Layout>
      <div className="bl">
        <section className="bl-hero">
          <div className="container">
            <h1>{t.h1}</h1>
            <p>{t.p}</p>
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
              <LocalizedLink to={`/blog/${featured.frontmatter.slug}/`} className="bl-featured">
                <div className="bl-featured-img">
                  {postImage(featured) && (
                    <img src={postImage(featured)!} alt={featured.frontmatter.title} />
                  )}
                </div>
                <div className="bl-featured-body">
                  <span className="bl-stamp">{t.stamp}</span>
                  <span className="bl-chip">{featured.frontmatter.category}</span>
                  <h2>{featured.frontmatter.title}</h2>
                  <p className="bl-excerpt">{featured.frontmatter.excerpt}</p>
                  <div className="bl-tear" aria-hidden="true" />
                  <PostMeta post={featured} />
                  <span className="bl-more">{t.more}</span>
                </div>
              </LocalizedLink>
            )}

            <div className="bl-grid">
              {rest.filter(Boolean).map((post) => (
                <LocalizedLink key={post!.id} to={`/blog/${post!.frontmatter.slug}/`} className="bl-card">
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
                </LocalizedLink>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="bl-empty">
                <Rich text={t.empty} />
              </div>
            )}
          </div>
        </section>
      </div>

      <InlineCTA
        title={t.title}
        note={t.note}
      />
    </Layout>
  )
}

export default BlogPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = TEXT[pageContext.locale]
  return (
    <SEO locale={pageContext.locale} title={t.seo.title} description={t.seo.description} pathname="/blog/" />
  )
}

export const query = graphql`
  query BlogList {
    # Scoped to content/blog (every language; the page filters to its own). The knowledge base is markdown too, so
    # without the path filter all 98 guides list themselves as blog
    # posts — which is exactly what happened the first time.
    allMarkdownRemark(
      filter: {
        frontmatter: { slug: { ne: null } }
        fileAbsolutePath: { regex: "//content/blog//" }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        fileAbsolutePath
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
