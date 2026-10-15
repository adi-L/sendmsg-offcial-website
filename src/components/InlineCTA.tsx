import React from "react"
import { openSignup, PANEL_URL } from "./SignupDialog"
import { useText } from "../locales/LocaleContext"
import heText from "../locales/he/inline-cta.json"

/* This component's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

type Props = {
  title: string
  note?: string
  variant?: "light" | "dark"
}

const InlineCTA: React.FC<Props> = ({ title, note, variant = "light" }) => {
  const t = useText(TEXT)
  return (
    <section className={`inline-cta${variant === "dark" ? " is-dark" : ""}`}>
      <div className="container">
        <p className="inline-cta-title">{title}</p>
        <a href={PANEL_URL} className="primary-btn" onClick={openSignup}>
          {t.button}
        </a>
        {note && <p className="inline-cta-note">{note}</p>}
      </div>
    </section>
  )
}

export default InlineCTA
