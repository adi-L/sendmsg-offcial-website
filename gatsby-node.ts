import fs from "fs"
import path from "path"
import { GatsbyNode } from "gatsby"
import sharp from "sharp"
import {
  buildLlmsTxt,
  buildLlmsFullTxt,
  buildOpenApi,
} from "./src/data/api/artifacts"
import { articleImageSrcs, ImageSizes } from "./src/utils/article-images"
import { buildSiteLlmsTxt, LlmsLink } from "./src/data/site-llms"
import { redirectPairs, toApache, toCsv, toNginx } from "./src/data/redirects"
import { SITE_URL } from "./src/utils/structured-data"
import {
  articleLocale,
  defaultLocale,
  enabledLocales,
  Locale,
  localePath,
  pageVariants,
} from "./src/locales/config"

/**
 * Measures the screenshots an article references, so the template can give
 * every <img> a real width and height and the page stops reflowing as they
 * arrive. These files live under static/, outside the image pipeline, so
 * nothing else knows their size.
 *
 * Memoised across pages: the guides share a handful of images, and sharp
 * opening the same file 98 times is the slowest thing in the build.
 */
const measured = new Map<string, [number, number] | null>()

const measureArticleImages = async (
  html: string,
  dir: string
): Promise<ImageSizes> => {
  const sizes: ImageSizes = {}

  for (const src of articleImageSrcs(html, dir)) {
    if (!measured.has(src)) {
      // the markup percent-encodes the Hebrew directory names
      const file = path.join(__dirname, "static", decodeURIComponent(src))
      try {
        const { width, height } = await sharp(file).metadata()
        measured.set(src, width && height ? [width, height] : null)
      } catch {
        // a missing or unreadable file is check-links.py's business, not ours
        measured.set(src, null)
      }
    }

    const size = measured.get(src)
    if (size) sizes[src] = size
  }

  return sizes
}

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
}) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/templates/blog-post.tsx`)
  const kbArticleTemplate = path.resolve(`src/templates/kb-article.tsx`)

  /* Both collections are markdown, so they are told apart by which
     directory the file came from. Without the fileAbsolutePath filter
     every imported guide would also be published as a blog post. */
  const result = await graphql<{
    allMarkdownRemark: {
      nodes: Array<{
        frontmatter: { slug: string }
        fileAbsolutePath: string
        html: string
        id: string
      }>
    }
  }>(`
    {
      allMarkdownRemark(
        filter: { frontmatter: { slug: { ne: null } } }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          frontmatter {
            slug
          }
          fileAbsolutePath
          html
          id
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const nodes = result.data?.allMarkdownRemark.nodes ?? []
  const inDir = (p: string, dir: string) =>
    p.split(path.sep).join("/").includes(`/content/${dir}/`)

  const posts = nodes.filter((n) => inDir(n.fileAbsolutePath, "blog"))
  const guides = nodes.filter((n) => inDir(n.fileAbsolutePath, "kb"))

  /* The folder is the language (content/kb/he/...). Hebrew articles keep
     their root URLs; other languages go under /<code>/, and a language
     that is not enabled yet is not built at all. */
  const langOf = (n: { fileAbsolutePath: string }) =>
    (articleLocale(n.fileAbsolutePath) ?? defaultLocale) as Locale
  const isEnabled = (n: { fileAbsolutePath: string }) =>
    enabledLocales().includes(langOf(n))

  await Promise.all(
    posts.filter(isEnabled).map(async (post) => {
      const locale = langOf(post)
      createPage({
        path: localePath(locale, `/blog/${post.frontmatter.slug}/`),
        component: blogPostTemplate,
        context: {
          id: post.id,
          locale,
          imageSizes: await measureArticleImages(post.html, "blog-images"),
        },
      })
    })
  )

  await Promise.all(
    guides.filter(isEnabled).map(async (guide) => {
      const locale = langOf(guide)
      createPage({
        path: localePath(locale, `/kb/${guide.frontmatter.slug}/`),
        component: kbArticleTemplate,
        context: {
          id: guide.id,
          locale,
          imageSizes: await measureArticleImages(guide.html, "kb-images"),
        },
      })
    })
  )
}

/* Every page in src/pages is built once per enabled language: Hebrew at its
   own path, others under /<code>/. Pages we create here carry a locale, which
   is what stops this hook from processing its own output again. */
export const onCreatePage: GatsbyNode["onCreatePage"] = ({ page, actions }) => {
  if ((page.context as { locale?: string } | undefined)?.locale) return
  if (page.path.startsWith("/dev-404-page")) return
  const { createPage, deletePage } = actions
  deletePage(page)
  for (const v of pageVariants(page.path)) {
    createPage({ ...page, path: v.path, context: { ...page.context, locale: v.locale } })
  }
}

/**
 * Writes the machine-readable faces of the API reference.
 *
 * Apiary renders as a JavaScript application, so fetching its URL returns a
 * page title and nothing else -- the reference cannot be read by anything
 * that does not run a browser. These files are generated from the same data
 * the page renders, so an agent and a person are always reading the same API.
 */
/**
 * Strips the NUL bytes react-dom 18.3.1 leaks into server-rendered HTML.
 *
 * react-dom's SSR writer fills a 2048-byte view and, when a character
 * straddles that boundary, `writeStringChunk` flushes the whole zero-filled
 * view instead of `subarray(0, writtenBytes)`:
 *
 *     if (read < stringChunk.length) {
 *       writeToDestination(destination, currentView)   // <- not sliced
 *
 * The bytes the encoder never wrote go out as NUL. Hebrew is two bytes per
 * character, so a straddle -- and a NUL -- happens at roughly every other
 * boundary; an ASCII-only site never sees this. Nothing is lost, one stray
 * byte is inserted, so removing it restores the exact intended output.
 *
 * It is not cosmetic: on /kb/ one of them landed inside an href and broke
 * the link to a guide, and a NUL inside a text node makes that text fail to
 * match for anything reading the HTML -- crawlers, search, copy-paste.
 *
 * Drop this once react-dom is on a release that slices the view (React 19).
 */
const stripNulBytes = (reporter: { info: (s: string) => void }) => {
  const files: string[] = []
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith(".html")) files.push(full)
    }
  }
  walk(path.join(__dirname, "public"))

  let touched = 0
  let removed = 0
  for (const file of files) {
    const buf = fs.readFileSync(file)
    const clean = buf.filter((b) => b !== 0)
    if (clean.length === buf.length) continue
    fs.writeFileSync(file, clean)
    touched += 1
    removed += buf.length - clean.length
  }

  if (removed > 0) {
    reporter.info(
      `SSR repair: removed ${removed} NUL byte(s) from ${touched} of ${files.length} HTML files`
    )
  }
}

/* Pages that are part of the site but not what anyone asks an assistant
   about; llms.txt lists them under "Optional" so a short context can drop
   them. */
const LLMS_OPTIONAL = new Set(["privacy", "terms", "accessibility", "jobs"])
/* Not pages a reader lands on: the 404, the home (it is the file's own
   heading) and the two indexes (their articles are listed one by one). */
const LLMS_SKIP = new Set(["404", "index", "blog", "kb"])

const writeSiteLlmsTxt = async (
  graphql: Parameters<NonNullable<GatsbyNode["onPostBuild"]>>[0]["graphql"],
  reporter: Parameters<NonNullable<GatsbyNode["onPostBuild"]>>[0]["reporter"]
) => {
  const pagesDir = path.join(__dirname, "src", "locales", defaultLocale, "pages")
  const pages: LlmsLink[] = []
  const optional: LlmsLink[] = []
  for (const file of fs.readdirSync(pagesDir).sort()) {
    const name = file.replace(/\.json$/, "")
    if (!file.endsWith(".json") || LLMS_SKIP.has(name)) continue
    if (!fs.existsSync(path.join(__dirname, "src", "pages", `${name}.tsx`))) continue
    const seo = JSON.parse(fs.readFileSync(path.join(pagesDir, file), "utf8")).seo ?? {}
    const link = {
      // creaditor's title is its brand name, set in the page rather than the JSON
      title: seo.title ?? name.charAt(0).toUpperCase() + name.slice(1),
      url: `${SITE_URL}/${name}/`,
      description: seo.description,
    }
    ;(LLMS_OPTIONAL.has(name) ? optional : pages).push(link)
  }

  const result = await graphql<{
    allMarkdownRemark: {
      nodes: {
        fileAbsolutePath: string
        frontmatter: { title: string; slug: string; order: number | null }
      }[]
    }
  }>(`{
    allMarkdownRemark(filter: { frontmatter: { slug: { ne: null } } }) {
      nodes {
        fileAbsolutePath
        frontmatter { title slug order }
      }
    }
  }`)
  if (result.errors || !result.data) {
    reporter.panicOnBuild("llms.txt: the article query failed", result.errors)
    return
  }

  const inDefaultLocale = (p: string) => p.includes(`/${defaultLocale}/`)
  const nodes = result.data.allMarkdownRemark.nodes.filter((n) =>
    inDefaultLocale(n.fileAbsolutePath)
  )
  const linkTo = (dir: string) => (n: (typeof nodes)[number]): LlmsLink => ({
    title: n.frontmatter.title,
    url: `${SITE_URL}/${dir}/${encodeURIComponent(n.frontmatter.slug)}/`,
  })
  const guides = nodes
    .filter((n) => n.fileAbsolutePath.includes("/content/kb/"))
    .sort((a, b) => (a.frontmatter.order ?? 1e9) - (b.frontmatter.order ?? 1e9))
    .map(linkTo("kb"))
  const articles = nodes
    .filter((n) => n.fileAbsolutePath.includes("/content/blog/"))
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title, defaultLocale))
    .map(linkTo("blog"))

  const contents = buildSiteLlmsTxt({
    intro: fs.readFileSync(path.join(__dirname, "src", "data", "llms-intro.he.md"), "utf8"),
    siteUrl: SITE_URL,
    pages,
    guides,
    articles,
    optional,
  })
  fs.writeFileSync(path.join(__dirname, "public", "llms.txt"), contents, "utf8")
  reporter.info(
    `llms.txt: ${pages.length} pages, ${guides.length} guides, ${articles.length} articles`
  )
}

/* The 301s from the old WordPress site, in the three forms a server might
   want (src/data/redirects.ts says where each one comes from). The Apache
   file goes into public/ as .htaccess, where Apache picks it up by itself;
   the nginx map and the CSV are for whoever configures the server, so they
   go beside the build in redirects/, not into the public site. */
const writeRedirects = async (
  graphql: Parameters<NonNullable<GatsbyNode["onPostBuild"]>>[0]["graphql"],
  reporter: Parameters<NonNullable<GatsbyNode["onPostBuild"]>>[0]["reporter"]
) => {
  const result = await graphql<{
    allMarkdownRemark: {
      nodes: { fileAbsolutePath: string; frontmatter: { slug: string; source: string | null } }[]
    }
  }>(`{
    allMarkdownRemark(filter: { frontmatter: { slug: { ne: null } } }) {
      nodes { fileAbsolutePath frontmatter { slug source } }
    }
  }`)
  if (result.errors || !result.data) {
    reporter.panicOnBuild("redirects: the article query failed", result.errors)
    return
  }
  const articles = result.data.allMarkdownRemark.nodes
    .filter((n) => n.frontmatter.source)
    .map((n) => ({
      source: n.frontmatter.source as string,
      route: `/${n.fileAbsolutePath.includes("/content/kb/") ? "kb" : "blog"}/${n.frontmatter.slug}/`,
    }))
  const pairs = redirectPairs(articles)

  fs.writeFileSync(path.join(__dirname, "public", ".htaccess"), toApache(pairs, SITE_URL), "utf8")
  const outDir = path.join(__dirname, "redirects")
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, "nginx-redirects.conf"), toNginx(pairs, SITE_URL), "utf8")
  fs.writeFileSync(path.join(outDir, "redirects.csv"), toCsv(pairs, SITE_URL), "utf8")
  reporter.info(`redirects: ${pairs.length} old URLs -> public/.htaccess, redirects/`)
}

export const onPostBuild: GatsbyNode["onPostBuild"] = async ({ graphql, reporter }) => {
  stripNulBytes(reporter)
  await writeSiteLlmsTxt(graphql, reporter)
  await writeRedirects(graphql, reporter)

  const outDir = path.join(__dirname, "public", "api")
  fs.mkdirSync(outDir, { recursive: true })

  const artifacts: Array<[string, string]> = [
    ["llms.txt", buildLlmsTxt()],
    ["llms-full.txt", buildLlmsFullTxt()],
    ["openapi.json", JSON.stringify(buildOpenApi(), null, 2)],
  ]

  for (const [name, contents] of artifacts) {
    fs.writeFileSync(path.join(outDir, name), contents, "utf8")
    reporter.info(`API reference: wrote /api/${name} (${contents.length} bytes)`)
  }
}
