import fs from "fs"
import path from "path"
import { GatsbyNode } from "gatsby"
import {
  buildLlmsTxt,
  buildLlmsFullTxt,
  buildOpenApi,
} from "./src/data/api/artifacts"

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

  posts.forEach((post) => {
    createPage({
      path: `/blog/${post.frontmatter.slug}/`,
      component: blogPostTemplate,
      context: {
        id: post.id,
      },
    })
  })

  guides.forEach((guide) => {
    createPage({
      path: `/kb/${guide.frontmatter.slug}/`,
      component: kbArticleTemplate,
      context: {
        id: guide.id,
      },
    })
  })
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

export const onPostBuild: GatsbyNode["onPostBuild"] = async ({ reporter }) => {
  stripNulBytes(reporter)

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
