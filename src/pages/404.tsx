import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"

const NotFoundPage: React.FC = () => (
  <Layout>
    <section style={styles.section}>
      <div className="container" style={{ textAlign: "center" }}>
        <h1 className="gradient-text" style={styles.code}>404</h1>
        <h2 style={styles.title}>העמוד לא נמצא</h2>
        <p style={styles.text}>מצטערים, העמוד שחיפשתם לא קיים או הועבר.</p>
        <a href="/" className="gradient-btn" style={styles.btn}>
          חזרה לדף הבית
        </a>
      </div>
    </section>
  </Layout>
)

export default NotFoundPage

export const Head: HeadFC = () => <SEO title="404 - העמוד לא נמצא" />

const styles: Record<string, React.CSSProperties> = {
  section: { padding: "120px 0" },
  code: { fontSize: "8rem", fontWeight: 900, lineHeight: 1 },
  title: { fontSize: "1.8rem", fontWeight: 700, marginTop: "16px", marginBottom: "12px" },
  text: { color: "var(--text-gray)", fontSize: "1.1rem", marginBottom: "32px" },
  btn: { padding: "14px 40px" },
}
