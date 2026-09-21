import React from "react"
import worldMap from "../images/illustrations/world-map.png"

const GlobalReach: React.FC = () => (
  <section className="section" style={styles.section}>
    <div className="container" style={styles.container}>
      <h2 className="section-title" style={{ color: "#fff" }}>
        התחלנו בישראל ב-2009,
        <br />
        והיום צומחים איתנו עסקים <span style={styles.highlight}>גם בעולם</span>
      </h2>
      <p style={styles.subtitle}>
        למעלה מ-50 אלף משתמשים כבר עושים שיווק נכון עם שלח מסר
      </p>

      <div style={styles.mapWrapper}>
        <img src={worldMap} alt="מפת הפעילות העולמית של שלח מסר" style={styles.mapImg} />
      </div>
    </div>
  </section>
)

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "var(--bg-dark)",
    overflow: "hidden",
  },
  container: {
    textAlign: "center",
  },
  highlight: {
    color: "#c77dff",
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "1.2rem",
    marginTop: "12px",
  },
  mapWrapper: {
    maxWidth: "800px",
    margin: "40px auto 0",
  },
  mapImg: {
    width: "100%",
    height: "auto",
  },
}

export default GlobalReach
