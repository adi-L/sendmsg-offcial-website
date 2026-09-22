import React from "react"
import { openSignup, PANEL_URL } from "./SignupDialog"

type Props = {
  title: string
  note?: string
  variant?: "light" | "dark"
}

const InlineCTA: React.FC<Props> = ({ title, note, variant = "light" }) => (
  <section className={`inline-cta${variant === "dark" ? " is-dark" : ""}`}>
    <div className="container">
      <p className="inline-cta-title">{title}</p>
      <a href={PANEL_URL} className="primary-btn" onClick={openSignup}>
        פתיחת חשבון חינם
      </a>
      {note && <p className="inline-cta-note">{note}</p>}
    </div>
  </section>
)

export default InlineCTA
