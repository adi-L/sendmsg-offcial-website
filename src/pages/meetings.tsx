import React from "react"
import { Link } from "gatsby"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/meetings.css"

/* Copy is the live /meetings/ page's own, grouped rather than
   rewritten. Its "מודל" is corrected to "מודול" throughout: the
   page's own second paragraph already spells it that way. */

/* Three of the live bullets really are a sequence, so they are set
   as one. Every sentence below is the page's own. */
const steps = [
  {
    t: "האלגוריתם מזהה",
    d: "האלגוריתם שלנו יזהה ויציע לכם פגישות עם עסקים פוטנציאליים לשיתוף פעולה, על בסיס זיהוי האנשים הרלוונטיים לכם ברמה העסקית והאישית.",
  },
  {
    t: "בוחרים תאריך ושעה",
    d: "רק לבחור תאריך ושעה דרך הממשק, או לאשר פגישות עם אנשים ועסקים שביקשו להיפגש אתכם.",
  },
  {
    t: "נפגשים",
    d: "כל לקוחות שלח מסר משתפים פעולה במקום אחד, במודול מבוסס Zoom.",
  },
]

/* The rest of the live list: what the module is for */
const uses = [
  "תציעו את השירות המקצועי שלכם לעסקים",
  "אתרו נותני שירות חדשים ואיכותיים לעסק שלכם",
  "מצאו שותף או שיתוף פעולה להעצמה עסקית הדדית",
  "חיפוש בעל מקצוע או שירות לפי תחום עיסוק",
]

const MeetingsPage: React.FC = () => (
  <Layout>
    <div className="mt">
      <section className="mt-hero">
        <div className="container">
          <h1>מודול פגישות ושיתופי פעולה</h1>
          <p className="mt-hero-sub">
            שיתופי פעולה הם אחת הדרכים המצמיחות ביותר מבחינה עסקית.
          </p>
          <p className="mt-hero-note">
            אנחנו נפעל כדי לאתר לכם את שיתופי הפעולה הטובים ביותר עבורכם. החיבורים
            יופיעו בממשק ויישלחו אליכם במייל, בהתאם להזדמנויות ולאנשים שחברים
            בקהילה ומשתמשים במודול.
          </p>
          <a href={PANEL_URL} className="mt-btn mt-btn-accent" onClick={openSignup}>
            פתיחת חשבון בחינם
          </a>
        </div>
      </section>

      {/* Numbered because it is an order of operations, and closed by
          the line that is the actual offer: the work you do not do. */}
      <section className="mt-flow">
        <div className="container">
          <div className="mt-head">
            <h2>איך זה עובד</h2>
          </div>

          <ol className="mt-flow-list">
            {steps.map((s, i) => (
              <li key={s.t}>
                <span className="mt-flow-n" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="mt-flow-body">
                  <span className="mt-flow-t">{s.t}</span>
                  <span className="mt-flow-d">{s.d}</span>
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-claim">
            לא צריך להתקשר, לא לתאם, לא לשכנע ולא למכור.
          </p>
        </div>
      </section>

      <section className="mt-uses">
        <div className="container">
          <div className="mt-uses-split">
            <div className="mt-head">
              <h2>למה משתמשים במודול</h2>
            </div>
            <ul className="mt-use-list">
              {uses.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Whose technology this is, and what you have to agree to before
          it can match you. Both belong on the page, quietly. */}
      <section className="mt-partner">
        <div className="container">
          <div className="mt-partner-in">
            <h2>על שיתוף הפעולה עם מיטנגו</h2>
            <p>
              המודול הוא תוצר של שיתוף פעולה בין שלח מסר לבין מיטנגו, שמתמחה
              בטכנולוגיה לחיבורים עסקיים. כדי שנוכל לשלוח לכם חיבורים אפשריים יש
              לאשר את תנאי השימוש ולהמשיך בתהליך קצר שיעזור לנו לאתר עבורכם
              שיתופי פעולה טובים.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-plans">
        <div className="container">
          <div className="mt-plans-row">
            <div>
              <h2>המודול כלול בחשבון</h2>
              <p>
                מתחילים בחינם עד 250 מנויים. חבילה בתשלום מ-
                <span className="mt-ltr">₪40</span> לחודש, או{" "}
                <span className="mt-ltr">₪36</span> לחודש בחיוב שנתי, לא כולל
                מע״מ.
              </p>
            </div>
            <Link to="/pricing/" className="mt-btn mt-btn-light">
              למחירון המלא
            </Link>
          </div>
        </div>
      </section>
    </div>
    <CTA />
  </Layout>
)

export default MeetingsPage

export const Head: HeadFC = () => (
  <SEO
    title="פגישות ושיתופי פעולה"
    description="מודול הפגישות ושיתופי הפעולה של שלח מסר: אלגוריתם שמזהה עסקים רלוונטיים לשיתוף פעולה, ופגישות שנקבעות בבחירת תאריך ושעה בממשק."
    pathname="/meetings/"
  />
)
