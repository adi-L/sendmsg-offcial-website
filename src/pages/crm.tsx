import React from "react"
import { Link } from "gatsby"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/crm.css"

/* Copy is the live /crm/ page's own. */

/* The nine things the live page lists under its headline */
const capabilities = [
  "גמישות מלאה ביצירת כרטסת שדות עבור לקוחות",
  "פילוח מדויק של לקוחות לפי קריטריונים",
  "התאמת המסרים באופן אישי לכל לקוח",
  "שליחת הטבה לפני ימי הולדת או תזכורות לחידוש תור",
  "ניהול משימות ושליחת תזכורות במייל וב-SMS",
  "מעקב אחרי לקוחות פעילים יותר ופעילים פחות",
  "הרשאות שונות בחשבון לתפקידים שונים בחברה",
  "תיעוד שיחות ופעילויות עבור כל לקוח",
  "דוחות וחיפושים מתקדמים לפי תיעוד בכרטסת הלקוח",
]

/* Every one of these pages now exists, so every row links */
const alsoIncluded = [
  { t: "מערכת דיוור", hook: "עד 250 מנויים, חינם ולתמיד", to: "/newsletters/" },
  { t: "מערכת סמסים", hook: "קישורים מקוצרים ואוטומציות", to: "/sms/" },
  { t: "דפי נחיתה", hook: "עד 5 דפים בחבילה החינמית", to: "/landing-pages/" },
  { t: "קורסים דיגיטליים", hook: "קורס ראשון חינם ולתמיד", to: "/digital-courses/" },
]

const ArrowIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path d="M14 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CrmPage: React.FC = () => (
  <Layout>
    <div className="crm">
      <section className="crm-hero">
        <div className="container">
          <h1>מועדון לקוחות (CRM)</h1>
          <p className="crm-hero-sub">
            כל עסק, החל מהקטן ביותר של אדם אחד, חייב לנהל את הלקוחות שלו.
          </p>
          <p className="crm-hero-note">
            ניהול הלקוחות, היסטוריית הפעולות מולם וניהול הפרטים החיוניים לצורך
            עסקאות הם כלי מאוד יעיל לעבודה נכונה.
          </p>
          <a href={PANEL_URL} className="crm-btn crm-btn-accent" onClick={openSignup}>
            פתיחת חשבון בחינם
          </a>
        </div>
      </section>

      {/* The page's own admission, set as type. It is the most useful
          sentence here precisely because it is not a boast, so it gets
          the size and the quiet around it rather than a frame. */}
      <section className="crm-claim">
        <div className="container">
          <div className="crm-claim-in">
            <p className="crm-claim-lead">
              אנחנו לא מתיימרים להיות מערכת ברמת{" "}
              <span className="crm-ltr">SalesForce</span>.
            </p>
            <p className="crm-claim-body">
              אבל כבר בחבילה הבסיסית המערכת שלנו תאפשר לכם לנהל בחינם את פרטי
              היסטוריית הלקוחות, להתנהל בסמסים מולם עם ממשק צ׳אט, לעדכן כרטיס
              לקוח, ליצור תזכורות לפני פגישה, לפלח לפי חתכים שונים ברמה מתקדמת,
              ולנהל את ההיסטוריה של כלל הלקוחות במרוכז, כך שתוכלו לראות כל מי
              שקיבל שירות או מוצר לפי תקופה ועוד.
            </p>
          </div>
        </div>
      </section>

      <section className="crm-caps">
        <div className="container">
          <div className="crm-caps-split">
            <div className="crm-head">
              <h2>ניהול לקוחות באמצעות מערכת CRM</h2>
            </div>
            <ul className="crm-cap-list">
              {capabilities.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="crm-also">
        <div className="container">
          <div className="crm-head">
            <h2>מה עוד נכנס לחשבון</h2>
            <p>
              הכרטסת היא אותה כרטסת בכל המערכת, כך שכל דיוור, מסרון, דף נחיתה
              וקורס מתועדים על אותו לקוח.
            </p>
          </div>
          <ul className="crm-also-list">
            {alsoIncluded.map((a) => (
              <li key={a.t}>
                <Link to={a.to}>
                  <span className="crm-also-t">{a.t}</span>
                  <span className="crm-also-hook">{a.hook}</span>
                  <span className="crm-also-go" aria-hidden="true">
                    <ArrowIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="crm-plans">
        <div className="container">
          <div className="crm-plans-row">
            <div>
              <h2>ה-CRM כלול בחשבון</h2>
              <p>
                מתחילים בחינם עד 250 מנויים. חבילה בתשלום מ-
                <span className="crm-ltr">₪40</span> לחודש, או{" "}
                <span className="crm-ltr">₪36</span> לחודש בחיוב שנתי, לא כולל
                מע״מ.
              </p>
            </div>
            <Link to="/pricing/" className="crm-btn crm-btn-light">
              למחירון המלא
            </Link>
          </div>
        </div>
      </section>
    </div>
    <CTA />
  </Layout>
)

export default CrmPage

export const Head: HeadFC = () => (
  <SEO
    title="מועדון לקוחות (CRM)"
    description="ניהול מועדון לקוחות בשלח מסר: כרטיס לקוח, פילוח מתקדם, תיעוד שיחות, משימות ותזכורות במייל וב-SMS, הכל מחובר לדיוור ולמסרונים."
    pathname="/crm/"
  />
)
