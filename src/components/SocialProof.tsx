import React from "react"
import ClientMarquee from "./ClientMarquee"
import { useText } from "../locales/LocaleContext"
import heText from "../locales/he/social-proof.json"

/* This component's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

/* Straight under the hero: one line saying how many, then their own
   marks moving past. A band, not a section -- the static two-row grid
   it replaces stood a full screen tall on a phone and left orphans on
   desktop, which is too much weight between the promise and the product. */
const SocialProof: React.FC = () => {
  const t = useText(TEXT)
  return (
    <section className="sp-band" aria-labelledby="sp-heading">
      <div className="container">
        <h2 id="sp-heading" className="sp-heading">{t.heading}</h2>
      </div>
      <ClientMarquee />
    </section>
  )
}

export default SocialProof
