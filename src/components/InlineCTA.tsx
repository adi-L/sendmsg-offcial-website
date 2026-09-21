import React from "react"
import { openSignup, PANEL_URL } from "./SignupDialog"

type Props = {
  title: string
  note?: string
}

const InlineCTA: React.FC<Props> = ({ title, note }) => (
  <section style={styles.section}>
    <div className="container" style={styles.container}>
      <p style={styles.title}>{title}</p>
      <a href={PANEL_URL} className="primary-btn" onClick={openSignup}>
        פתיחת חשבון חינם
      </a>
      {note && <p style={styles.note}>{note}</p>}
    </div>
  </section>
)

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: "48px 0",
    background: "var(--bg-white)",
    borderBottom: "1px solid var(--border-color)",
  },
  container: {
    textAlign: "center",
  },
  title: {
    fontSize: "1.35rem",
    fontWeight: 700,
    color: "var(--ink)",
    marginBottom: "20px",
  },
  note: {
    marginTop: "14px",
    fontSize: "0.9rem",
    color: "var(--text-gray)",
  },
}

export default InlineCTA
