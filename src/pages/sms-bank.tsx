import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SmsBank from "../components/SmsBank"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import "../styles/sms-bank.css"
import type { PageContext } from "../locales/config"
import { getT } from "../locales/messages"

const SmsBankPage: React.FC = () => (
  <Layout>
    <SmsBank />
    <CTA />
  </Layout>
)

export default SmsBankPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = getT(pageContext.locale, "pages/sms-bank")
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/sms-bank/"
    />
  )
}
