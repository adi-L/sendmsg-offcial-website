import React from "react"
import { withPrefix } from "gatsby"
import { alternates, enabledLocales, Locale, localePath, locales } from "../locales/config"
import heText from "../locales/he/common.json"
import { ORG_ID, SITE_URL } from "../utils/structured-data"

/* This component's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

interface SEOProps {
  /* Required, so a page's Head can't forget it: pass pageContext.locale. */
  locale: Locale
  /* Only for untranslated pages whose content is in another language (/api). */
  htmlLang?: string
  htmlDir?: "rtl" | "ltr"
  /* The languages this page exists in, for hreflang. Pages exist in every
     enabled language; an article exists only in its own until it is
     translated. */
  availableIn?: readonly Locale[]
  title?: string
  description?: string
  pathname?: string
  image?: string
  /* Extra JSON-LD nodes (src/utils/structured-data.ts), added to the page's
     @graph after the Organization they point back to. */
  schema?: object[]
  /* Articles and guides; their date goes out as article:published_time. */
  ogType?: "website" | "article"
  publishedTime?: string
}

/* Search results cut a description at about 155 characters, mid-word. The
   imported articles' excerpts run longer, so trim at a word instead. */
const DESCRIPTION_MAX = 155
const clampDescription = (text: string): string => {
  const flat = text.replace(/\s+/g, " ").trim()
  if (flat.length <= DESCRIPTION_MAX) return flat
  const cut = flat.slice(0, DESCRIPTION_MAX - 1)
  const space = cut.lastIndexOf(" ")
  return `${(space > 100 ? cut.slice(0, space) : cut).replace(/[\s,.:;\u2013\u2014-]+$/, "")}\u2026`
}

const SEO: React.FC<SEOProps> = ({
  locale,
  htmlLang,
  htmlDir,
  availableIn = enabledLocales(),
  title,
  description,
  pathname,
  image,
  schema = [],
  ogType = "website",
  publishedTime,
}) => {
  const c = TEXT[locale].seo
  const siteTitle = c.siteTitle
  const siteDescription = c.siteDescription
  const siteUrl = SITE_URL
  // og:image must be an absolute URL that resolves on the host actually
  // serving the build; the GitHub Pages preview sets GATSBY_ASSET_ORIGIN
  const assetOrigin = process.env.GATSBY_ASSET_ORIGIN || siteUrl

  // inner pages carry the short brand only: the full siteTitle pushed 68
  // of 153 titles past the ~65 characters a search result shows
  // the home page keeps the old site's title: it is the page that ranks
  // for "מערכת דיוור", and these are the words it ranks with
  const pageTitle = title ? `${title} | ${c.titleSuffix}` : c.homeTitle
  const pageDescription = clampDescription(description || siteDescription)
  // the Hebrew home is the bare domain, as it always was; /en/ keeps its path
  const localized = pathname ? localePath(locale, pathname) : "/"
  const canonical = localized === "/" ? siteUrl : `${siteUrl}${localized}`
  const links = pathname ? alternates(pathname, availableIn) : []
  const imageUrl = `${assetOrigin}${withPrefix(image || "/images/og-image.png")}`

  const isHome = !pathname || pathname === "/"
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: c.orgName,
        alternateName: "Sendmsg",
        url: siteUrl,
        logo: `${assetOrigin}${withPrefix("/images/logo/logo.png")}`,
        telephone: "077-4600600",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+972-77-4600600",
          contactType: "customer support",
          areaServed: "IL",
          availableLanguage: ["he"],
        },
        sameAs: [
          "https://www.facebook.com/sendmsg",
          "https://www.instagram.com/sendmsg.system/",
          "https://www.tiktok.com/@sendmsg.system",
          "https://www.youtube.com/c/SendmsgSystem",
          "https://www.linkedin.com/company/sendmsg/",
          "https://www.pinterest.com/sendmsg_system/",
        ],
      },
      ...(isHome
        ? [
            {
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              name: siteTitle,
              url: siteUrl,
              inLanguage: locale,
              publisher: { "@id": ORG_ID },
            },
          ]
        : []),
      ...schema,
    ],
  }

  return (
    <>
      <html lang={htmlLang ?? locale} dir={htmlDir ?? locales[locale].dir} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonical} />
      {links.map(({ hrefLang, path }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={`${siteUrl}${path}`} />
      ))}
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={withPrefix("/icons/icon-16x16.png")}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={withPrefix("/icons/icon-32x32.png")}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="48x48"
        href={withPrefix("/icons/icon-48x48.png")}
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={withPrefix("/icons/icon-180x180.png")}
      />
      <meta property="og:site_name" content={c.ogSiteName} />
      <meta property="og:locale" content={c.ogLocale} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      <meta property="og:image" content={imageUrl} />
      {/* only the default card's size is known; a cover image is whatever
          size it is, and a wrong size is worse than none */}
      {!image && <meta property="og:image:width" content="1200" />}
      {!image && <meta property="og:image:height" content="630" />}
      <meta
        property="og:image:alt"
        content={c.ogImageAlt}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
    </>
  )
}

export default SEO
