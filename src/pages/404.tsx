import React from "react"
import { type HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import type { PageContext } from "../locales/config"
import { useLocalePath, useT } from "../locales/LocaleContext"
import { getT } from "../locales/messages"

const NotFoundPage: React.FC = () => {
  const t = useT("pages/404")
  const lp = useLocalePath()
  return (
    <Layout>
      <section style={styles.section}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 className="gradient-text" style={styles.code}>404</h1>
          <h2 style={styles.title}>{t.title}</h2>
          <p style={styles.text}>{t.text}</p>
          <a href={lp("/")} className="gradient-btn" style={styles.btn}>
            {t.btn}
          </a>
        </div>
      </section>
    </Layout>
  )
}

export default NotFoundPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = getT(pageContext.locale, "pages/404")
  return <SEO locale={pageContext.locale} title={t.seo.title} />
}

const styles: Record<string, React.CSSProperties> = {
  section: { padding: "120px 0" },
  code: { fontSize: "8rem", fontWeight: 900, lineHeight: 1 },
  title: { fontSize: "1.8rem", fontWeight: 700, marginTop: "16px", marginBottom: "12px" },
  text: { color: "var(--text-gray)", fontSize: "1.1rem", marginBottom: "32px" },
  btn: { padding: "14px 40px" },
}
