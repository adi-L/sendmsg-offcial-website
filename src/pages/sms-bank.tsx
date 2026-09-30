import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SmsBank from "../components/SmsBank"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import "../styles/sms-bank.css"

const SmsBankPage: React.FC = () => (
  <Layout>
    <SmsBank />
    <CTA />
  </Layout>
)

export default SmsBankPage

export const Head: HeadFC = () => (
  <SEO
    title="בנק סמסים"
    description="חבילות בנק SMS של שלח מסר. רוכשים מסרונים מראש בתשלום חד פעמי, בלי מנוי חודשי, ומשתמשים בקצב שלכם."
    pathname="/sms-bank/"
  />
)
