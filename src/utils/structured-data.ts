/* schema.org JSON-LD nodes for SEO's `schema` prop. Each helper returns one
   node without @context; SEO wraps whatever a page passes in a single
   @graph, next to the Organization the nodes point back to by @id.

   The text is the same text the page renders, so the markup can never claim
   something a reader doesn't see -- that mismatch is what gets rich results
   withdrawn. */

/* www, as the old site was: Search Console, the inbound links and Google's
   index all know the site there, so the move changes pages, not the host. */
export const SITE_URL = "https://www.sendmsg.co.il"
export const ORG_ID = `${SITE_URL}/#organization`

const abs = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`)

/* Answers in the locale JSON may carry the <strong>/<ltr>/<a> markup that
   parseRich understands, or be a list of paragraphs. Structured data wants
   plain text. */
const plain = (a: string | readonly string[]): string =>
  (typeof a === "string" ? a : a.join("\n"))
    .replace(/<[^>]+>/g, "")
    .replace(/\s*\n\s*/g, " ")
    .trim()

export type FaqItem = { q: string; a: string | readonly string[] }

export const faqPage = (faqs: readonly FaqItem[]) => ({
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: plain(f.q),
    acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
  })),
})

export const breadcrumbs = (items: ReadonlyArray<{ name: string; path: string }>) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: abs(item.path),
  })),
})

export const article = (a: {
  type: "BlogPosting" | "TechArticle"
  title: string
  description?: string
  path: string
  /* ISO date (YYYY-MM-DD); guides have none, so it is optional */
  date?: string
  author?: string
  /* absolute URL */
  image?: string
  inLanguage: string
}) => ({
  "@type": a.type,
  headline: a.title,
  ...(a.description && { description: a.description }),
  url: abs(a.path),
  mainEntityOfPage: abs(a.path),
  inLanguage: a.inLanguage,
  ...(a.date && { datePublished: a.date }),
  ...(a.image && { image: a.image }),
  author: a.author ? { "@type": "Person", name: a.author } : { "@id": ORG_ID },
  publisher: { "@id": ORG_ID },
})
