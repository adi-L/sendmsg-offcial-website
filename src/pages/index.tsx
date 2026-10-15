import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import Hero from "../components/Hero"
import FreePlan from "../components/FreePlan"
import AILaunchpad from "../components/AILaunchpad"
import AITransform from "../components/AITransform"
import AdSpot from "../components/AdSpot"
import Showcase from "../components/Showcase"
import Features from "../components/Features"
import Audience from "../components/Audience"
import GoogleReviews from "../components/GoogleReviews"
import SocialProof from "../components/SocialProof"
import ISOCertification from "../components/ISOCertification"
import GlobalReach from "../components/GlobalReach"
import FAQ from "../components/FAQ"
import MissionQuote from "../components/MissionQuote"
import CTA from "../components/CTA"
import AIAssistant from "../components/AIAssistant"
import InlineCTA from "../components/InlineCTA"
import SEO from "../components/SEO"
import type { PageContext } from "../locales/config"
import { useText } from "../locales/LocaleContext"
import heText from "../locales/he/pages/index.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

const IndexPage: React.FC = () => {
  const t = useText(TEXT)
  return (
    <Layout>
      <Hero />
      <AILaunchpad />
      <AITransform />
      <AdSpot />
      <Showcase />
      <InlineCTA
        title={t.ctaDemoTitle}
        note={t.ctaDemoNote}
        variant="dark"
      />
      <Features />
      <Audience />
      <FreePlan />
      <GoogleReviews />
      <SocialProof />
      <InlineCTA title={t.ctaJoinTitle} />
      <ISOCertification />
      <GlobalReach />
      <FAQ />
      <MissionQuote />
      <CTA />
      <AIAssistant />
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => <SEO locale={pageContext.locale} pathname="/" />
