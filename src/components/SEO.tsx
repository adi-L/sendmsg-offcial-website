import React from "react"
import { withPrefix } from "gatsby"
import { alternates, enabledLocales, Locale, localePath, locales } from "../locales/config"
import { getT } from "../locales/messages"

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
}) => {
  const c = getT(locale, "common").seo
  const siteTitle = c.siteTitle
  const siteDescription = c.siteDescription
  const siteUrl = "https://sendmsg.co.il"
  // og:image must be an absolute URL that resolves on the host actually
  // serving the build; the GitHub Pages preview sets GATSBY_ASSET_ORIGIN
  const assetOrigin = process.env.GATSBY_ASSET_ORIGIN || siteUrl

  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const pageDescription = description || siteDescription
  // the Hebrew home is the bare domain, as it always was; /en/ keeps its path
  const localized = pathname ? localePath(locale, pathname) : "/"
  const canonical = localized === "/" ? siteUrl : `${siteUrl}${localized}`
  const links = pathname ? alternates(pathname, availableIn) : []
  const imageUrl = `${assetOrigin}${withPrefix(image || "/images/og-image.png")}`

  const isHome = !pathname || pathname === "/"
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: c.orgName,
        alternateName: "Sendmsg",
        url: siteUrl,
        logo: `${assetOrigin}${withPrefix("/images/logo/logo.png")}`,
        telephone: "077-4600600",
        sameAs: [
          "https://www.facebook.com/sendmsg",
          "https://www.instagram.com/sendmsg.system/",
          "https://www.tiktok.com/@sendmsg.system",
          "https://www.youtube.com/c/SendmsgSystem",
          "https://www.linkedin.com/company/sendmsg/",
          "https://www.pinterest.com/sendmsg_system/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteTitle,
        url: siteUrl,
        inLanguage: locale,
        publisher: { "@id": `${siteUrl}/#organization` },
      },
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
      <meta property="og:type" content="website" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content={c.ogImageAlt}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
      {isHome && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
        />
      )}
    </>
  )
}

export default SEO
