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
export const onPostBuild: GatsbyNode["onPostBuild"] = async ({ reporter }) => {
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
