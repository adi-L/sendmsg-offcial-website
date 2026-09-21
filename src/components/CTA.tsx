import React from "react"

import trustLogos from "../images/image.png"
import { openSignup } from "./SignupDialog"

const PANEL_URL = "https://panel.sendmsg.co.il/"

const CTA: React.FC = () => (
  <section style={styles.section}>
    <div className="container" style={styles.container}>
      <h2 style={styles.title}>
        הגיע הזמן למערכת דיוור אלקטרוני
        <br />
        <span className="gradient-text">ידידותית ומתקדמת</span>
      </h2>
      <p style={styles.subtitle}>
        הצטרפו לאלפי עסקים שכבר משתמשים בשלח מסר לשיווק חכם
      </p>
      <a href={PANEL_URL} className="primary-btn" style={styles.btn} onClick={openSignup}>
        פתיחת חשבון בחינם →
      </a>
      <img
        src={trustLogos}
        alt="Max, Cardcom, American Express, Visa, ישראכרט, מכון התקנים הישראלי, משרד הביטחון"
        style={styles.trustLogos}
        loading="lazy"
      />
    </div>
  </section>
)

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: "80px 0",
    background: "var(--bg-soft)",
  },
  container: {
    textAlign: "center",
  },
  title: {
    fontSize: "2.4rem",
    fontWeight: 800,
    lineHeight: 1.3,
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "1.1rem",
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
