import React from "react"
import { openSignup, PANEL_URL } from "./SignupDialog"
import LocalizedLink from "../locales/LocalizedLink"
import { useT } from "../locales/LocaleContext"

const Check: React.FC = () => (
  <span style={styles.checkWrap} aria-hidden="true">
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
      <path
        d="M4 12.5l5 5L20 6.5"
        stroke="var(--primary-blue)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
)

const FreePlan: React.FC = () => {
  const t = useT("free-plan")
  return (
    <section className="section" style={styles.section}>
      <div className="container" style={styles.container}>
        <h2 className="section-title">{t.title}</h2>
        <p className="section-subtitle">
          {t.subtitle}
        </p>

        <div style={styles.itemsRow}>
          {t.items.map((item) => (
            <span key={item} style={styles.item}>
              <Check />
              {item}
            </span>
          ))}
        </div>

        <p style={styles.extra}>{t.extra}</p>

        <a href={PANEL_URL} className="primary-btn" style={styles.btn} onClick={openSignup}>
          {t.button}
        </a>

        <div>
          <LocalizedLink to="/pricing" style={styles.link}>
            {t.compare}
          </LocalizedLink>
        </div>
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "var(--bg-white)",
    borderBottom: "1px solid var(--border-color)",
  },
  container: {
    textAlign: "center",
  },
  itemsRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: "14px 40px",
    marginTop: "32px",
    fontSize: "1.15rem",
    fontWeight: 500,
    color: "var(--ink)",
  },
  item: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
  },
  checkWrap: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "rgba(13, 89, 140, 0.08)",
    flexShrink: 0,
  },
  extra: {
    marginTop: "20px",
    fontSize: "1rem",
    color: "var(--text-gray)",
  },
  btn: {
    marginTop: "28px",
  },
  link: {
    display: "inline-block",
    marginTop: "18px",
    color: "var(--primary-blue)",
    fontWeight: 600,
    fontSize: "0.95rem",
    textDecoration: "none",
  },
}

export default FreePlan
