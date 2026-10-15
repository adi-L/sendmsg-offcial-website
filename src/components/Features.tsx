import React from "react"
import Rich from "../locales/Rich"
import { useText } from "../locales/LocaleContext"
import heText from "../locales/he/features.json"

/* This component's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

const Features: React.FC = () => {
  const t = useText(TEXT)
  return (
    <section className="section dot-grid">
      <div className="container">
        <h2 style={styles.heading}>
          <Rich text={t.heading} />
        </h2>
        <div style={styles.divider} />

        <div className="features-grid">
          {t.features.map((f) => (
            <div key={f.title} style={styles.card}>
              <h3 style={styles.cardTitle}>{f.title}</h3>
              <p style={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  heading: {
    fontSize: "2.4rem",
    fontWeight: 800,
    textAlign: "center",
    marginBottom: "16px",
    lineHeight: 1.4,
  },
  divider: {
    width: "40px",
    height: "3px",
    background: "var(--primary-pink)",
    margin: "16px auto 48px",
    borderRadius: "2px",
  },
  card: {
    textAlign: "right",
    padding: "0 8px",
  },
  cardTitle: {
    fontSize: "1.15rem",
    fontWeight: 800,
    marginBottom: "12px",
    color: "var(--text-dark)",
  },
  cardDesc: {
    fontSize: "0.92rem",
    color: "var(--text-gray)",
    lineHeight: 1.7,
  },
}

export default Features
