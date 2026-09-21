import React from "react"

import isoCertificate from "../images/iso-27001-certificate.png"

const ISOCertification: React.FC = () => (
  <section className="section" style={styles.section}>
    <div className="container" style={styles.container}>
      <div style={styles.textCol}>
        <div style={styles.badge}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 2L4 5.5V11c0 5 3.4 9.4 8 10.5 4.6-1.1 8-5.5 8-10.5V5.5L12 2z"
              fill="var(--primary-blue)"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>אבטחת מידע</span>
        </div>
        <h2 style={styles.heading}>ISO 27001</h2>
        <p style={styles.subtitle}>עומדים בתקן הבינלאומי לאבטחת מידע</p>
        <p style={styles.description}>
          המערכת שלנו מוסמכת לתקן ISO/IEC 27001:2022 על ידי מכון התקנים
          הישראלי. המידע והנתונים שלכם מנוהלים לפי הסטנדרט המחמיר בעולם.
        </p>
      </div>

      <div style={styles.certCol}>
        <img
          src={isoCertificate}
          alt="תעודת הסמכה ISO/IEC 27001:2022 ממכון התקנים הישראלי"
          style={styles.certImg}
          loading="lazy"
        />
      </div>
    </div>
  </section>
)

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "var(--bg-white)",
    paddingTop: "72px",
    paddingBottom: "72px",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "64px",
    flexWrap: "wrap" as const,
  },
  textCol: {
    maxWidth: "440px",
    textAlign: "right" as const,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(13, 89, 140, 0.08)",
    color: "var(--primary-blue)",
    fontWeight: 600,
    fontSize: "0.9rem",
    padding: "6px 14px",
    borderRadius: "var(--radius-xl)",
    marginBottom: "16px",
  },
  heading: {
    fontSize: "2.6rem",
    fontWeight: 800,
    color: "var(--primary-blue)",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "var(--ink)",
    marginBottom: "16px",
  },
  description: {
    fontSize: "1rem",
    lineHeight: 1.7,
    color: "var(--text-gray)",
  },
  certCol: {
    flexShrink: 0,
  },
  certImg: {
    display: "block",
    width: "min(420px, 90vw)",
    height: "auto",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-lg)",
    border: "1px solid var(--border-color)",
    background: "#fff",
  },
}

export default ISOCertification
