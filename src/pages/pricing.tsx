import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import Pricing, { PricingFAQ } from "../components/Pricing"
import GoogleReviews from "../components/GoogleReviews"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import "../styles/pricing.css"
import type { PageContext } from "../locales/config"
import { faqPage } from "../utils/structured-data"
import pricingText from "../locales/he/pricing.json"
import heText from "../locales/he/pages/pricing.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }
/* the FAQ the Pricing component renders on this page */
const PRICING = { he: pricingText }

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
  const t = TEXT[pageContext.locale]
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/pricing/"
      schema={[faqPage(PRICING[pageContext.locale].faqs)]}
    />
  )
}
