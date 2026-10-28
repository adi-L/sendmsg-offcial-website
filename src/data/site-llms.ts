/* /llms.txt for the whole site (https://llmstxt.org): a plain-markdown map
   an AI assistant can read in one request instead of crawling 150 pages of
   layout. /api/llms.txt already covers the API in depth; this one points
   at it rather than repeating it.

   Everything here comes from text the site already shows: each page's own
   SEO title and description, each article's title and excerpt. Nothing is
   written for the crawler alone. */

export type LlmsLink = { title: string; url: string; description?: string }

export type SiteLlmsInput = {
  name: string
  summary: string
  pages: LlmsLink[]
  guides: LlmsLink[]
  articles: LlmsLink[]
  optional: LlmsLink[]
  siteUrl: string
}

const line = ({ title, url, description }: LlmsLink) =>
  description ? `- [${title}](${url}): ${description}` : `- [${title}](${url})`

const section = (heading: string, links: LlmsLink[]) =>
  links.length ? [`## ${heading}`, "", ...links.map(line), ""] : []

export const buildSiteLlmsTxt = (i: SiteLlmsInput): string =>
  [
    `# ${i.name}`,
    "",
    `> ${i.summary}`,
    "",
    `Site: ${i.siteUrl}/ (Hebrew, right-to-left). The product itself runs at`,
    "https://panel.sendmsg.co.il/.",
    "",
    ...section("Product and company pages", i.pages),
    ...section("API", [
      {
        title: "API reference for language models",
        url: `${i.siteUrl}/api/llms.txt`,
        description: "the REST API, summarised; the full text is at /api/llms-full.txt",
      },
      { title: "OpenAPI description", url: `${i.siteUrl}/api/openapi.json` },
    ]),
    ...section("Guides (how-to, step by step)", i.guides),
    ...section("Articles", i.articles),
    ...section("Optional", i.optional),
  ].join("\n")
