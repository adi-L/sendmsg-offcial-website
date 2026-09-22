import React from "react"
import { withPrefix } from "gatsby"

interface SEOProps {
  title?: string
  description?: string
  pathname?: string
  image?: string
}

const SEO: React.FC<SEOProps> = ({ title, description, pathname, image }) => {
  const siteTitle = "שלח מסר - מערכת דיוור אלקטרוני"
  const siteDescription =
    "מערכת דיוור אלקטרוני לעסקים, נגישה וידידותית. ניוזלטרים, SMS, דפי נחיתה, קורסים דיגיטליים ו-CRM במקום אחד."
  const siteUrl = "https://sendmsg.co.il"
  // og:image must be an absolute URL that resolves on the host actually
  // serving the build; the GitHub Pages preview sets GATSBY_ASSET_ORIGIN
  const assetOrigin = process.env.GATSBY_ASSET_ORIGIN || siteUrl

  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const pageDescription = description || siteDescription
  const canonical = pathname ? `${siteUrl}${pathname}` : siteUrl
  const imageUrl = `${assetOrigin}${withPrefix(image || "/images/og-image.png")}`

  const isHome = !pathname || pathname === "/"
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "שלח מסר",
        alternateName: "SendMsg",
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
        inLanguage: "he",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  }

  return (
    <>
      <html lang="he" dir="rtl" />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonical} />
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
      <meta property="og:site_name" content="שלח מסר - SendMsg" />
      <meta property="og:locale" content="he_IL" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="שלח מסר - מערכת הדיוור והשיווק הישראלית לעסקים"
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
