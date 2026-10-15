import React from "react"

import trustLogos from "../images/image.png"
import { openSignup } from "./SignupDialog"
import { useText } from "../locales/LocaleContext"
import heText from "../locales/he/cta.json"

/* This component's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

const PANEL_URL = "https://panel.sendmsg.co.il/"

const CTA: React.FC = () => {
  const t = useText(TEXT)
  return (
    <section style={styles.section}>
      <div className="container" style={styles.container}>
        <h2 style={styles.title}>
          {t.title}
          <br />
          <span className="gradient-text">{t.titleHighlight}</span>
        </h2>
        <p style={styles.subtitle}>
          {t.subtitle}
        </p>
        <a href={PANEL_URL} className="primary-btn" style={styles.btn} onClick={openSignup}>
          {t.button}
        </a>
        <img
          src={trustLogos}
          alt={t.logosAlt}
          style={styles.trustLogos}
          loading="lazy"
        />
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: "80px 0",
    background: "var(--bg-soft)",
  },
  container: {
    textAlign: "center",
  },
  title: {
    // the section-heading step, so this h2 matches every other h2 on the
    // page instead of sitting 1.6px under them
    fontSize: "var(--fs-2xl)",
    fontWeight: 800,
    lineHeight: 1.3,
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "var(--fs-base)",
    color: "var(--text-gray)",
    marginBottom: "32px",
  },
  btn: {
    fontSize: "1.2rem",
    padding: "16px 56px",
  },
  trustLogos: {
    display: "block",
    margin: "40px auto 0",
    maxWidth: "700px",
    width: "100%",
    opacity: 0.6,
  },
}

export default CTA
