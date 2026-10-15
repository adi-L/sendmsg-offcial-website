/* Every text file, for every language. Static imports: no fetching, and
   TypeScript checks each other language against Hebrew's shape, so a
   missing key in en/ is a typecheck error rather than a blank on the site.
   Keep the imports and the `he` keys alphabetical. */
import type { Locale } from "./config"
import heCommon from "./he/common.json"

const he = {
  common: heCommon,
}

export type Messages = typeof he
export type Namespace = keyof Messages

const messages: Record<Locale, Messages> = { he }

export function getT<N extends Namespace>(locale: Locale, ns: N): Messages[N] {
  return messages[locale][ns]
}
