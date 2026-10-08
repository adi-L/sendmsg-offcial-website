import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import EmailBank from "../components/EmailBank"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import "../styles/email-bank.css"

const EmailBankPage: React.FC = () => (
  <Layout>
    <EmailBank />
    <CTA />
  </Layout>
)

export default EmailBankPage

export const Head: HeadFC = () => (
  <SEO
    title="בנק שליחות מיילים"
    description="חבילות בנק שליחות של שלח מסר. רוכשים דיוורים מראש בתשלום חד פעמי, בלי מנוי חודשי, ושולחים בקצב שלכם."
    pathname="/email-bank/"
  />
)
