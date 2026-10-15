import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import EmailBank from "../components/EmailBank"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import "../styles/email-bank.css"
import type { PageContext } from "../locales/config"
import heText from "../locales/he/pages/email-bank.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

const EmailBankPage: React.FC = () => (
  <Layout>
    <EmailBank />
    <CTA />
  </Layout>
)

export default EmailBankPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = TEXT[pageContext.locale]
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/email-bank/"
    />
  )
}
