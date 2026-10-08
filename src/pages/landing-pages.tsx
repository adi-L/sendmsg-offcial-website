import React, { useState } from "react"
import { Link } from "gatsby"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import tplWorkshop from "../images/templates/template-workshop.webp"
import tplProgram from "../images/templates/template-program.webp"
import tplTherapy from "../images/templates/template-therapy.webp"
import tplTech from "../images/templates/template-tech.webp"
import "../styles/landing-pages.css"

/* Copy below is the live /landingpages/ page's own. */

/* The nine things the live page lists under the opening claim */
const canDo = [
  "בניית דף נחיתה ללא צורך בדומיין משלכם, או עם אפשרות לחיבור דומיין משלכם",
  "יצירת טפסים מעוצבים להגדלת אחוזי הרשמה בקלות",
  "עיצוב רספונסיבי שמותאם אוטומטית למובייל ולדסקטופ",
  "יצירת דף נחיתה ממגוון תבניות לפי סיווגים",
  "שכפול, גרירה, מחיקה והוספה של בלוקים שונים בדף",
  "אפשרויות הנפשה ואנימציות לכל חלק בדף",
  "התממשקות למערכות סליקה",
  "הטמעת פיקסלים לגוגל אדוורדס ופייסבוק ממומן בקליק",
  "סידור ושליטה נוחים של קבצי המדיה",
]

/* Four of the live gallery's templates, pulled from the live page.
   Each image is the whole page, 2560px tall, so the preview shows the
   top and travels down on hover: the length is the point. */
const templates = [
  { src: tplWorkshop, alt: "תבנית דף נחיתה להרשמה לסדנה", t: "הרשמה לסדנה" },
  { src: tplProgram, alt: "תבנית דף נחיתה לתכנית דיגיטלית", t: "תכנית דיגיטלית" },
  { src: tplTherapy, alt: "תבנית דף נחיתה לקליניקת טיפול", t: "טיפול" },
  { src: tplTech, alt: "תבנית דף נחיתה לשירות טכנולוגי", t: "שירות טכנולוגי" },
]

/* The bonuses the live page spells out in five paragraphs, as the
   hooks themselves. Linked only where the page already exists. */
const alsoIncluded = [
  { t: "מערכת דיוור", hook: "עד 250 מנויים, חינם ולתמיד", to: "/newsletters/" },
  { t: "מערכת סמסים", hook: "100 סמסים ראשונים חינם", to: null },
  { t: "קורסים", hook: "קורס ראשון חינם ולתמיד", to: null },
  { t: "ניהול לקוחות CRM", hook: "כלול בחשבון", to: null },
]

/* The live page's seven questions and their answers, verbatim */
const faqs = [
  {
    id: "speed",
    q: "אין לי הרבה זמן פנוי. כמה מהר אוכל להקים דף נחיתה והאם נדרש מתכנת?",
    a: "המערכת כוללת עורך מתקדם ומהיר (Creaditor 3.0) עם אפשרויות עיצוב מלאות וגרירת בלוקים, כך שניתן להקים דף נחיתה ולעלות איתו לאוויר תוך כרבע שעה, אפילו בלי לדעת לעצב או לבנות דפים מורכבים, ללא צורך במתכנת כלל.",
  },
  {
    id: "cost",
    q: "מה העלות? האם אני יכול לבנות דף נחיתה בלי לשלם מראש?",
    a: "בחבילה הבסיסית החינמית, ניתן ליצור עד 5 דפי נחיתה ללא עלות או התחייבות כלשהי.",
  },
  {
    id: "mobile",
    q: "האם הדף ייראה מקצועי ומותאם למובייל?",
    a: "כן. המערכת יוצרת עיצוב רספונסיבי שמותאם למובייל או כל סוג מכשיר (מחשב, טאבלט או נייד) באופן אוטומטי. בנוסף, ניתן לבצע התאמות נקודתיות לפי סוג מכשיר בקלות.",
  },
  {
    id: "domain",
    q: "האם אוכל להשתמש בדומיין הפרטי של העסק שלי?",
    a: "כן, המערכת מספקת קישור דומיין ייחודי וחינמי, אך המערכת מאפשרת גם רישום דפי נחיתה תחת דומיין פרטי שלך, ללא עלויות נוספות. במידה ואין דומיין פרטי, ניתן לרכוש דומיין בממשק עצמו שכבר יוגדר מאחורי הקלעים לדפי נחיתה (ושאר השירותים).",
  },
  {
    id: "pixels",
    q: "אני מריץ קמפיינים. האם אוכל לעקוב אחרי המרות ולהטמיע פיקסלים?",
    a: "ניתן להטמיע פיקסלים של גוגל ופייסבוק בקליק, וכן לחבר את הדף למערכות סליקה ולעקוב אחר המרות.",
  },
  {
    id: "leads",
    q: "איך מתבצע איסוף הלידים והאם הטפסים ניתנים להתאמה אישית?",
    a: "הטפסים מובנים בתוך הדפים, ניתנים להתאמה מלאה וכוללים אפשרויות ניהול, שליטה מלאה על עיצוב והפעלת אוטומציות והודעות מיד לאחר ההרשמה. המערכת מאפשרת איסוף לידים ברמת ניהול גבוהה, אפילו בחבילה הבסיסית. בנוסף, ניתן לייצר טפסים נפרדים להטמעה לאתר חיצוני.",
  },
  {
    id: "integrations",
    q: "האם ניתן לשלב את דפי הנחיתה והלידים עם מערכות נוספות?",
    a: "כן. דפי הנחיתה של שלח מסר מחוברים למערכת הדיוור עצמה, ומאפשרים שילוב אוטומציות, התאמת מסע לקוח וגם אינטגרציות עם כלים חיצוניים נוספים לצורך טיוב ושיווק ממוקד של לידים על ידי חיבור עם מייק (Make), זאפייר (Zapier) או וובהוק (Webhook).",
  },
]

const PlusIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path className="lp-plus-v" d="M12 4v16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const ArrowIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path d="M14 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const LandingPagesPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Layout>
      <div className="lp">
        <section className="lp-hero">
          <div className="container">
            <h1>יצירת דפי נחיתה</h1>
            <p className="lp-hero-sub">
              לבנות דפי נחיתה רספונסיביים ולהגדיל את מועדון הלקוחות
            </p>
            <p className="lp-hero-note">עד 5 דפי נחיתה בחבילה החינמית</p>
            <a href={PANEL_URL} className="lp-btn lp-btn-accent" onClick={openSignup}>
              פתיחת חשבון בחינם
            </a>
          </div>
        </section>

        {/* A heading that stays beside the list it names, and nine plain
            rows. No ticks: nine identical checkmarks would say nothing
            the heading has not already said. */}
        <section className="lp-can">
          <div className="container">
            <div className="lp-can-split">
              <div className="lp-head">
                <h2>מה אפשר לעשות</h2>
              </div>
              <ul className="lp-can-list">
                {canDo.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* The templates are whole pages, so the preview behaves like
            one: it opens at the top and travels down when you point at
            it. The length is the argument. */}
        <section className="lp-templates">
          <div className="container">
            <div className="lp-head">
              <h2>טמפלייטים לדוגמה</h2>
              <p>
                עצבו בעצמכם או בחרו מתוך ספריה של עשרות טמפלייטים מוכנים לפי
                סיווגים.
              </p>
            </div>

            <ul className="lp-tpl-grid">
              {templates.map((t) => (
                <li key={t.t} className="lp-tpl">
                  <div className="lp-tpl-frame">
                    <img src={t.src} alt={t.alt} loading="lazy" />
                  </div>
                  <p className="lp-tpl-name">{t.t}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="lp-also">
          <div className="container">
            <div className="lp-head">
              <h2>מה עוד נכנס לחשבון</h2>
              <p>
                אותו חשבון חינמי פותח גם את שאר המערכת, בלי כרטיס אשראי ובלי
                התחייבות.
              </p>
            </div>

            <ul className="lp-also-list">
              {alsoIncluded.map((a) => (
                <li key={a.t}>
                  {a.to ? (
                    <Link to={a.to}>
                      <span className="lp-also-t">{a.t}</span>
                      <span className="lp-also-hook">{a.hook}</span>
                      <span className="lp-also-go" aria-hidden="true">
                        <ArrowIcon />
                      </span>
                    </Link>
                  ) : (
                    <div>
                      <span className="lp-also-t">{a.t}</span>
                      <span className="lp-also-hook">{a.hook}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Collapsed panels are 0fr and invisible, so they leave the tab
            order instead of merely going out of sight. */}
        <section className="lp-faq">
          <div className="container">
            <div className="lp-head">
              <h2>שאלות נפוצות</h2>
            </div>

            <div className="lp-qs">
              {faqs.map((f) => {
                const isOpen = openId === f.id
                return (
                  <div className="lp-q" key={f.id} data-open={isOpen}>
                    <h3 className="lp-q-h">
                      <button
                        type="button"
                        className="lp-q-btn"
                        id={`lp-q-${f.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`lp-a-${f.id}`}
                        onClick={() => setOpenId(isOpen ? null : f.id)}
                      >
                        <span>{f.q}</span>
                        <span className="lp-q-sign" aria-hidden="true">
                          <PlusIcon />
                        </span>
                      </button>
                    </h3>
                    <div
                      className="lp-a"
                      id={`lp-a-${f.id}`}
                      role="region"
                      aria-labelledby={`lp-q-${f.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="lp-a-in">
                        <p>{f.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="lp-plans">
          <div className="container">
            <div className="lp-plans-row">
              <div>
                <h2>עד 5 דפי נחיתה בחינם</h2>
                <p>
                  בחבילה בתשלום אין הגבלה על כמות הדפים. מ-
                  <span className="lp-ltr">₪40</span> לחודש, או{" "}
                  <span className="lp-ltr">₪36</span> לחודש בחיוב שנתי, לא כולל
                  מע״מ.
                </p>
              </div>
              <Link to="/pricing/" className="lp-btn lp-btn-light">
                למחירון המלא
              </Link>
            </div>
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default LandingPagesPage

export const Head: HeadFC = () => (
  <SEO
    title="יצירת דפי נחיתה"
    description="בונים דפי נחיתה רספונסיביים בשלח מסר, בלי מתכנת ובלי דומיין משלכם. טפסים מעוצבים, פיקסלים, סליקה ולידים שנכנסים ישר למערכת. עד 5 דפים בחינם."
    pathname="/landing-pages/"
  />
)
