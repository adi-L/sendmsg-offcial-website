import React from "react"

interface SEOProps {
  title?: string
  description?: string
  pathname?: string
}

const SEO: React.FC<SEOProps> = ({ title, description, pathname }) => {
  const siteTitle = "שלח מסר - מערכת דיוור אלקטרוני"
  const siteDescription =
    "מערכת דיוור אלקטרוני לעסקים, נגישה וידידותית. ניוזלטרים, SMS, דפי נחיתה, קורסים דיגיטליים ו-CRM במקום אחד."
  const siteUrl = "https://sendmsg.co.il"

  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const pageDescription = description || siteDescription
  const canonical = pathname ? `${siteUrl}${pathname}` : siteUrl

  return (
    <>
      <html lang="he" dir="rtl" />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <link rel="canonical" href={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  )
}

export default SEO
