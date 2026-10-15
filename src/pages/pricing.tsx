import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import Pricing, { PricingFAQ } from "../components/Pricing"
import GoogleReviews from "../components/GoogleReviews"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import "../styles/pricing.css"
import type { PageContext } from "../locales/config"
import { getT } from "../locales/messages"

const PricingPage: React.FC = () => (
  <Layout>
    <Pricing />
    <GoogleReviews />
    <PricingFAQ />
    <CTA />
  </Layout>
)

export default PricingPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = getT(pageContext.locale, "pages/pricing")
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/pricing/"
    />
  )
}
