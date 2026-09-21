import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import LandingPagesFeature from "../components/LandingPagesFeature"

const services = [
  {
    id: "newsletters",
    icon: "📧",
    title: "ניוזלטרים",
    desc: "צרו ושלחו ניוזלטרים מקצועיים עם עורך גרור-ושחרר מתקדם. תבניות מעוצבות, A/B testing וסטטיסטיקות מפורטות.",
  },
  {
    id: "sms",
    icon: "📱",
    title: "מערכת SMS",
    desc: "שלחו הודעות SMS לרשימות התפוצה שלכם. כולל תמיכה בעברית, תזמון, והפרדה לקבוצות.",
  },
  {
    id: "courses",
    icon: "🎓",
    title: "קורסים דיגיטליים",
    desc: "בנו ומכרו קורסים דיגיטליים. כולל וידאו, טקסט, שאלונים ומעקב אחרי התקדמות התלמידים.",
  },
  {
    id: "crm",
    icon: "👥",
    title: "CRM",
    desc: "נהלו את אנשי הקשר שלכם, סגמנטו קבוצות, תייגו ועקבו אחרי אינטראקציות.",
  },
  {
    id: "meetings",
    icon: "📅",
    title: "ניהול פגישות",
    desc: "אפשרו ללקוחות לקבוע פגישות ישירות מהמייל או מדף הנחיתה. סנכרון יומן אוטומטי.",
  },
  {
    id: "ai",
    icon: "🤖",
    title: "AI דיוור",
    desc: "כתיבת תוכן באמצעות בינה מלאכותית, הצעות כותרות, עריכה חכמה ועיצוב אוטומטי עם Creaditor 2.0.",
  },
  {
    id: "automations",
    icon: "⚡",
    title: "אוטומציות",
    desc: "צרו רצפי דיוור אוטומטיים, ברוכים הבאים, עגלה נטושה, יום הולדת, ואוטומציות מותאמות אישית.",
  },
  {
    id: "domains",
    icon: "🌐",
    title: "רכישת דומיין",
    desc: "אנחנו מוכרים דומיינים ועוזרים לכם למצוא ולרכוש דומיין חדש לעסק, כולל חיבור מלא לדיוור ולדפי הנחיתה שלכם.",
  },
]

const ServicesPage: React.FC = () => (
  <Layout>
    <section style={{ padding: "80px 0 40px", textAlign: "center" }}>
      <div className="container">
        <h1 className="section-title">
          <span className="gradient-text">השירותים שלנו</span>
        </h1>
        <p className="section-subtitle">
          הכל במקום אחד, כל מה שצריך לשיווק דיגיטלי מוצלח
        </p>
      </div>
    </section>

    <LandingPagesFeature />

    <section className="section">
      <div className="container">
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} id={service.id} style={styles.card}>
              <span style={styles.icon}>{service.icon}</span>
              <h2 style={styles.title}>{service.title}</h2>
              <p style={styles.desc}>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
)

export default ServicesPage

export const Head: HeadFC = () => (
  <SEO title="שירותים" description="ניוזלטרים, SMS, דפי נחיתה, קורסים, CRM, רכישת דומיינים ועוד" pathname="/services/" />
)

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    borderRadius: "var(--radius-md)",
    padding: "36px 28px",
    boxShadow: "var(--shadow-sm)",
    border: "1px solid var(--border-color)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  icon: {
    fontSize: "2.5rem",
    display: "block",
    marginBottom: "16px",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: 700,
    marginBottom: "12px",
  },
  desc: {
    fontSize: "0.95rem",
    color: "var(--text-gray)",
    lineHeight: 1.7,
  },
}
