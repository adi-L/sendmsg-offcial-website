import path from "path"
import { GatsbyNode } from "gatsby"

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
