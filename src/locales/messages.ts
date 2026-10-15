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
import hePages404 from "./he/pages/404.json"
import hePagesAbout from "./he/pages/about.json"
import hePagesAccessibility from "./he/pages/accessibility.json"
import hePagesCreaditor from "./he/pages/creaditor.json"
import hePagesDigitalCourses from "./he/pages/digital-courses.json"
import hePagesDomain from "./he/pages/domain.json"
import hePagesIndex from "./he/pages/index.json"
import hePagesJobs from "./he/pages/jobs.json"
import hePagesNewsletters from "./he/pages/newsletters.json"
import hePagesServices from "./he/pages/services.json"
import hePagesShomerShabbat from "./he/pages/shomer-shabbat.json"
import hePagesSms from "./he/pages/sms.json"
import hePagesSupport from "./he/pages/support.json"
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
  "pages/404": hePages404,
  "pages/about": hePagesAbout,
  "pages/accessibility": hePagesAccessibility,
  "pages/creaditor": hePagesCreaditor,
  "pages/digital-courses": hePagesDigitalCourses,
  "pages/domain": hePagesDomain,
  "pages/index": hePagesIndex,
  "pages/jobs": hePagesJobs,
  "pages/newsletters": hePagesNewsletters,
  "pages/services": hePagesServices,
  "pages/shomer-shabbat": hePagesShomerShabbat,
  "pages/sms": hePagesSms,
  "pages/support": hePagesSupport,
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
