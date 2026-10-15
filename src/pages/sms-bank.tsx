import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SmsBank from "../components/SmsBank"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import "../styles/sms-bank.css"
import type { PageContext } from "../locales/config"
import heText from "../locales/he/pages/sms-bank.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

const SmsBankPage: React.FC = () => (
  <Layout>
    <SmsBank />
    <CTA />
  </Layout>
)

export default SmsBankPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = TEXT[pageContext.locale]
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/sms-bank/"
    />
  )
}
