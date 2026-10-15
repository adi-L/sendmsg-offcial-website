import React, { useState } from "react"
import { useText } from "../locales/LocaleContext"
import heText from "../locales/he/faq.json"

/* This component's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

const FAQ: React.FC = () => {
  const t = useText(TEXT)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="section" style={styles.section}>
      <div className="container" style={styles.container}>
        <h2 className="section-title">
          {t.title} <span className="gradient-text">{t.titleHighlight}</span>
        </h2>

        <div style={styles.list}>
          {t.faqs.map((faq, i) => (
            <div key={i} style={styles.item}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={styles.question}
              >
                <span>{faq.q}</span>
                <span style={{
                  ...styles.arrow,
                  transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                }}>
                  ▾
                </span>
              </button>
              {openIndex === i && (
                <div style={styles.answer}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "var(--bg-soft)",
  },
  container: {
    maxWidth: "800px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "40px",
  },
  item: {
    background: "#fff",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-color)",
    overflow: "hidden",
  },
  question: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 24px",
    fontSize: "1.05rem",
    fontWeight: 600,
    textAlign: "right",
    color: "var(--text-dark)",
    background: "transparent",
    cursor: "pointer",
    border: "none",
    fontFamily: "inherit",
    gap: "16px",
  },
  arrow: {
    fontSize: "1.2rem",
    transition: "transform 0.2s",
    flexShrink: 0,
    color: "var(--primary-pink)",
  },
  answer: {
    padding: "0 24px 18px",
    fontSize: "0.95rem",
    color: "var(--text-gray)",
    lineHeight: 1.7,
  },
}

export default FAQ
