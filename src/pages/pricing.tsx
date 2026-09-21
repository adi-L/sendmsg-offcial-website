import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import Pricing, { PricingFAQ } from "../components/Pricing"
import GoogleReviews from "../components/GoogleReviews"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import "../styles/pricing.css"

const PricingPage: React.FC = () => (
  <Layout>
    <Pricing />
    <GoogleReviews />
    <PricingFAQ />
    <CTA />
  </Layout>
)

export default PricingPage

export const Head: HeadFC = () => (
  <SEO
    title="מחירון"
    description="מחירון פשוט ושקוף למערכת הדיוור של שלח מסר. מתחילים בחינם, בלי כרטיס אשראי, ומשדרגים רק כשזה מתאים לעסק שלכם."
    pathname="/pricing/"
  />
)
