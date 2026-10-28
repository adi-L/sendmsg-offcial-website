/* /llms.txt for the whole site (https://llmstxt.org): a plain-markdown map
   an AI assistant can read in one request instead of crawling 150 pages of
   layout. /api/llms.txt already covers the API in depth; this one points
   at it rather than repeating it.

   The opening (heading, summary, what the company does) is
   src/data/llms-intro.he.md, carried over from the old site's file. The
   lists come from text the site already shows: each page's own SEO title
   and description, each guide's and article's title. */

export type LlmsLink = { title: string; url: string; description?: string }

export type SiteLlmsInput = {
  /* markdown: the "# name", the "> summary" and any prose under them */
  intro: string
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
    // the source file's HTML comment is a note for editors, not content
    i.intro.replace(/<!--[\s\S]*?-->\s*/g, "").trim(),
    "",
    `- האתר: ${i.siteUrl}/`,
    "- המערכת עצמה (כניסה והרשמה): https://panel.sendmsg.co.il/",
    "",
    ...section("עמודי מוצר וחברה", i.pages),
    ...section("API", [
      {
        title: "API reference for language models",
        url: `${i.siteUrl}/api/llms.txt`,
        description: "the REST API, summarised; the full text is at /api/llms-full.txt",
      },
      { title: "OpenAPI description", url: `${i.siteUrl}/api/openapi.json` },
    ]),
    ...section("מדריכים (מרכז ההדרכה)", i.guides),
    ...section("מאמרים", i.articles),
    // "Optional" is the llms.txt spec's own heading for what may be skipped
    ...section("Optional", i.optional),
  ].join("\n")
