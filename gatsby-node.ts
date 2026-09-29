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

  const result = await graphql<{
    allMarkdownRemark: {
      nodes: Array<{
        frontmatter: { slug: string }
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
          id
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const posts = result.data?.allMarkdownRemark.nodes ?? []

  posts.forEach((post) => {
    createPage({
      path: `/blog/${post.frontmatter.slug}/`,
      component: blogPostTemplate,
      context: {
        id: post.id,
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
