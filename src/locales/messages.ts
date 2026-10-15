/* Every text file, for every language. Static imports: no fetching, and
   TypeScript checks each other language against Hebrew's shape, so a
   missing key in en/ is a typecheck error rather than a blank on the site.
   Keep the imports and the `he` keys alphabetical. */
import type { Locale } from "./config"
import heAiAssistant from "./he/ai-assistant.json"
import heCommon from "./he/common.json"
import heCta from "./he/cta.json"
import heEmailBank from "./he/email-bank.json"
import heFooter from "./he/footer.json"
import heFreePlan from "./he/free-plan.json"
import heHeader from "./he/header.json"
import heInlineCta from "./he/inline-cta.json"
import heLayout from "./he/layout.json"
import hePricing from "./he/pricing.json"
import hePromoPopup from "./he/promo-popup.json"
import heSmsBank from "./he/sms-bank.json"

const he = {
  "ai-assistant": heAiAssistant,
  common: heCommon,
  cta: heCta,
  "email-bank": heEmailBank,
  footer: heFooter,
  "free-plan": heFreePlan,
  header: heHeader,
  "inline-cta": heInlineCta,
  layout: heLayout,
  pricing: hePricing,
  "promo-popup": hePromoPopup,
  "sms-bank": heSmsBank,
}

export type Messages = typeof he
export type Namespace = keyof Messages

const messages: Record<Locale, Messages> = { he }

export function getT<N extends Namespace>(locale: Locale, ns: N): Messages[N] {
  return messages[locale][ns]
}
