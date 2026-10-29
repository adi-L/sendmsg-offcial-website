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
import { faqPage } from "../utils/structured-data"
import faqText from "../locales/he/faq.json"
import heText from "../locales/he/pages/index.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }
/* the FAQ component's questions, for the page's FAQPage markup */
const FAQ_TEXT = { he: faqText }

const IndexPage: React.FC = () => {
  const t = useText(TEXT)
  return (
    <Layout>
      <Hero />
      {/* who already sends with us, straight after the promise */}
      <SocialProof />
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

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => (
  <SEO locale={pageContext.locale} pathname="/"
    schema={[faqPage(FAQ_TEXT[pageContext.locale].faqs)]}
  />
)
