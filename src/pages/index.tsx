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

const IndexPage: React.FC = () => (
  <Layout>
    <Hero />
    <AILaunchpad />
    <AITransform />
    <AdSpot />
    <Showcase />
    <InlineCTA
      title="רוצים לראות איך זה עובד אצלכם בעסק?"
      note="בלי כרטיס אשראי, בלי התחייבות"
      variant="dark"
    />
    <Features />
    <Audience />
    <FreePlan />
    <GoogleReviews />
    <SocialProof />
    <InlineCTA title="אלפי עסקים כבר שולחים עם שלח מסר. מצטרפים?" />
    <ISOCertification />
    <GlobalReach />
    <FAQ />
    <MissionQuote />
    <CTA />
    <AIAssistant />
  </Layout>
)

export default IndexPage

export const Head: HeadFC = () => <SEO />
