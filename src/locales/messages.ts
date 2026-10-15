/* Every text file, for every language. Static imports: no fetching, and
   TypeScript checks each other language against Hebrew's shape, so a
   missing key in en/ is a typecheck error rather than a blank on the site.
   Keep the imports and the `he` keys alphabetical. */
import type { Locale } from "./config"
import heAdSpot from "./he/ad-spot.json"
import heAiAssistant from "./he/ai-assistant.json"
import heAiLaunchpad from "./he/ai-launchpad.json"
import heAiTransform from "./he/ai-transform.json"
import heAudience from "./he/audience.json"
import heClientMarquee from "./he/client-marquee.json"
import heCommon from "./he/common.json"
import heCta from "./he/cta.json"
import heEmailBank from "./he/email-bank.json"
import heFaq from "./he/faq.json"
import heFeatures from "./he/features.json"
import heFooter from "./he/footer.json"
import heFreePlan from "./he/free-plan.json"
import heGlobalReach from "./he/global-reach.json"
import heGoogleReviews from "./he/google-reviews.json"
import heHeader from "./he/header.json"
import heHero from "./he/hero.json"
import heInlineCta from "./he/inline-cta.json"
import heIsoCertification from "./he/iso-certification.json"
import heLayout from "./he/layout.json"
import heMediaPlaceholder from "./he/media-placeholder.json"
import heMissionQuote from "./he/mission-quote.json"
import hePricing from "./he/pricing.json"
import hePromoPopup from "./he/promo-popup.json"
import heShowcase from "./he/showcase.json"
import heSmsBank from "./he/sms-bank.json"
import heSocialProof from "./he/social-proof.json"

const he = {
  "ad-spot": heAdSpot,
  "ai-assistant": heAiAssistant,
  "ai-launchpad": heAiLaunchpad,
  "ai-transform": heAiTransform,
  audience: heAudience,
  "client-marquee": heClientMarquee,
  common: heCommon,
  cta: heCta,
  "email-bank": heEmailBank,
  faq: heFaq,
  features: heFeatures,
  footer: heFooter,
  "free-plan": heFreePlan,
  "global-reach": heGlobalReach,
  "google-reviews": heGoogleReviews,
  header: heHeader,
  hero: heHero,
  "inline-cta": heInlineCta,
  "iso-certification": heIsoCertification,
  layout: heLayout,
  "media-placeholder": heMediaPlaceholder,
  "mission-quote": heMissionQuote,
  pricing: hePricing,
  "promo-popup": hePromoPopup,
  showcase: heShowcase,
  "sms-bank": heSmsBank,
  "social-proof": heSocialProof,
}

export type Messages = typeof he
export type Namespace = keyof Messages

const messages: Record<Locale, Messages> = { he }

export function getT<N extends Namespace>(locale: Locale, ns: N): Messages[N] {
  return messages[locale][ns]
}
