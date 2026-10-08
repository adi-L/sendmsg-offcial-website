import React, { useState } from "react"
import { Link } from "gatsby"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/digital-courses.css"

/* Copy is the live /digitalcourses/ page's own, with its typos
   corrected: "ווצא]" -> וואטסאפ, "הקהליטו" -> הקליטו, "ניתן הגדיר
   את קורס" -> ניתן להגדיר את הקורס, "תהליך העלה" -> תהליך העלאה. */

const capabilities = [
  {
    t: "אוטומציה מלאה",
    d: "שילוב מלא עם דיוורים ומסרונים מותאמים אישית ישירות מתוך מערכת שלח מסר.",
  },
  {
    t: "מבחנים אמריקאיים",
    d: "אפשרות ליצירת מבחן אמריקאי אחרי כל שיעור או כל חלק, למעקב אחרי התקדמות התלמידים.",
  },
  {
    t: "סליקה חכמה",
    d: "התממשקות מלאה עם כל מערכות הסליקה, כך שרוכשים יוכלו לשלם ולקבל גישה לקורס שלכם גם כשאתם ישנים.",
  },
  {
    t: "עיצוב אישי",
    d: "ניתן לעצב את עמוד הקורס ואת השיעורים בהתאם למותג שלכם.",
  },
  {
    t: "דומיין אישי",
    d: "ניתן לחבר את הקורס תחת הדומיין האישי שלכם.",
  },
  {
    t: "קהילה מובנית",
    d: "אפשרות לתפריט עליון עבור וובינרים, קבוצות וואטסאפ ופייסבוק, לחיזוק הקהילה והתקשורת ההדדית.",
  },
]

/* Four steps that are genuinely a sequence, so they are numbered */
const steps = [
  {
    t: "הרשמה למערכת",
    d: "תהליך מהיר של 2 דקות והחשבון החינמי שלכם מוכן. קורס דיגיטלי אחד, עד 250 נרשמים ברשימת התפוצה, ועוד.",
  },
  {
    t: "בניית הקורס",
    d: "הגדרת מבנה הקורס, העלאת הווידאו, הגדרת מיילים שישלחו לתלמידים, וכל מה שצריך כדי שהקורס שלכם ירוץ.",
  },
  {
    t: "יצירת דף הרשמה",
    d: "בניית דף מכירה לקורס במערכת שלח מסר, חיבור למערכת הסליקה (לקורסים בתשלום) והפצה של דף נחיתה.",
  },
  {
    t: "המשתמשים מקבלים גישה אוטומטית",
    d: "התלמידים שנרשמים לקורס מקבלים מייל ״ברוכים הבאים״ אוטומטי, ויכולים לגשת לקורס מיידית ולהתחיל בלמידה.",
  },
]

/* The three "ללא" claims the live page sets under "קורס ראשון בחינם" */
const noLimits = [
  "ללא דמי אחסון או תחזוקת שרת, לתמיד",
  "ללא הגבלות זמן, בונים פעם אחת והקורס רץ אוטומטית",
  "ללא הגבלת שיעורים, קורס של 5 שיעורים או של 500",
]

const freeIncludes = [
  "קורס דיגיטלי אחד, ללא הגבלת שיעורים וללא הגבלת פרקים",
  "ניתן להגדיר את הקורס כחינמי לכל, חינם בהרשמה, או בתשלום",
  "כל השיעורים נפתחים מיד, או פתיחה מדורגת לפי תאריך או לפי זמן מרגע ההרשמה",
  "חיבור הקורס לסדרת מיילים, כמו הודעה שהשיעור הבא נפתח",
  "הוספת דפי עבודה בכל הפורמטים הנפוצים",
  "אזור תפריט מיוחד לבונוסים, וובינרים, מועדון, הודעות וכדומה",
  "שירות אנושי מלא מצוות שלח מסר לחודש הראשון",
  "עד 250 תלמידים במערכת שלכם",
  "אבטחה מלאה, רק משתמשים שהוספתם יכולים לצפות בקורס",
  "התלמידים מקבלים פרטי גישה, כולל מייל וסיסמה, בצורה אוטומטית ומאובטחת",
  "מוכן לאוטומציות סליקה, כך שרוכשים יקבלו פרטי גישה גם בזמן שאתם ישנים",
  "עורך גמיש ומותאם לקורסי טקסט",
  "מתאים לתהליכי הכשרת עובדים והדרכות צוות",
  "תצוגה נוחה במחשב, בסמארטפון או בטאבלט",
  "צפייה בכל תיעודי התלמיד, בקורסים ובתפוצה, ממסך אחד",
]

const premiumAdds = [
  "ללא הגבלת קורסים, בונים כמה שתרצו",
  "מערכת מבחנים אמריקאיים, עם מגוון הגדרות ואפשרויות",
  "חיבורי API ווובהוק ליצירת אוטומציות מתקדמות לפי פעולות המנוי",
  "חיבור הקורס לדומיין אישי",
  "תמיכה בהעברת קורסים ממערכות אחרות",
]

const audiences = [
  {
    t: "יועצים ועסקי מידע",
    d: "צרו קורסים דיגיטליים, העניקו גישה רק למשלמים, רק לרשומים, או חינם לכל. לבחירתכם.",
  },
  {
    t: "מורים ומדריכים",
    d: "חסכו את הנסיעות או את זמן הזום, הקליטו את התוכן פעם אחת. תנו לתלמיד לצפות בזמן הכי מתאים לו.",
  },
  {
    t: "עסקים וארגונים מבוססים",
    d: "הדריכו לקוחות בשימוש במוצר ובשירות שלכם בצורה מקצועית ואוטומטית. צרו קורס חינמי בנושא הנישה שלכם כדי להגדיל את בסיס הלקוחות, והכינו הדרכות עובדים, נהלי עבודה וסיסטמים בפורמט קורסים דיגיטליים.",
  },
]

const alsoIncluded = [
  { t: "מערכת דיוור", hook: "עד 250 מנויים, חינם ולתמיד", to: "/newsletters/" },
  { t: "דפי נחיתה", hook: "עד 5 דפים בחבילה החינמית", to: "/landing-pages/" },
  { t: "מערכת סמסים", hook: "100 סמסים ראשונים חינם", to: null },
  { t: "ניהול לקוחות CRM", hook: "כלול בחשבון", to: null },
]

/* The live page's four questions, answers verbatim */
const faqs = [
  {
    id: "catch",
    q: "חינם? איפה הקאץ׳?",
    a: [
      "מערכת שלח מסר מרוויחה בשיטת ״גדלים ביחד אתך״. לכן התשלום הוא רק עבור השימוש במערכת הדיוור ו-CRM, כל השאר בונוס.",
      "אנחנו נרוויח רק אם העסק שלך יגדל ותצטרך חבילת מנויים גדולה יותר (או אם תצטרך שירות פרימיום ישר בהתחלה).",
    ],
  },
  {
    id: "students",
    q: "האם תביאו לי תלמידים?",
    a: [
      "אצלנו תוכלו לצרף לחשבון שלכם את אנשי הקשר המורשים שלכם, תלמידים קיימים, מתעניינים, לקוחות, קהל אורגני מרשתות חברתיות ועוד.",
      "אנחנו נביא לכם כלי שיווק כמו דיוור למנויים שהצטרפו, אפשרות לבנות דפי נחיתה, ליצור פאנל מדריך, להכריז על וובינרים, חיבורים למערכות שיווק ועוד.",
      "כמובן שאחריות שלכם לספק ערך ולכתוב בפועל את ההצעה שלכם.",
      "נשמח להמליץ לכם על אנשי שיווק שיכולים להביא לכם קהל חדש וטרי, ותסכמו מולם את התנאים.",
    ],
  },
  {
    id: "video",
    q: "לאן מעלים את הווידאו של הקורס?",
    a: [
      "ניתן להעלות וידאו ליוטיוב ולהגדיר את הסרטון כ״לא רשום״ (unlisted).",
      "לקורסים רגישים או לצמצום הסיכון להעתקות והורדות, ניתן להעלות את הווידאו לשרתים מאובטחים יותר כמו Vimeo או אמזון (תהליך העלאה והטמעה דומה ליוטיוב).",
      "את הקישור לסרטון יש להדביק בשיעור המתאים בקורס.",
    ],
  },
  {
    id: "cost",
    q: "כמה זה עולה?",
    a: [
      "עד 250 תלמידים ומנויים, לא עולה. מעבר לזה המחירים מתחילים ב-71 שקלים לחודש, וכך גם אם יש לכם יותר מקורס אחד.",
    ],
  },
]

const PlusIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path className="dc-plus-v" d="M12 4v16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const ArrowIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path d="M14 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const DigitalCoursesPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Layout>
      <div className="dc">
        <section className="dc-hero">
          <div className="container">
            <h1>בנו קורס דיגיטלי על חשבוננו!</h1>
            <p className="dc-hero-sub">קורס עד 250 תלמידים, חינם לתמיד</p>
            <p className="dc-hero-note">
              המערכת היחידה שמאפשרת ליצור קורס דיגיטלי אחד גם במסלול החינמי, ללא
              הגבלת שיעורים וללא הגבלת מבחנים אמריקאיים.
            </p>
            <a href={PANEL_URL} className="dc-btn dc-btn-accent" onClick={openSignup}>
              קדימה להירשם ולבנות קורס
            </a>
          </div>
        </section>

        {/* Six capabilities, term then sentence. Two columns because
            they are six of the same kind of thing, not two opposed ones. */}
        <section className="dc-caps">
          <div className="container">
            <div className="dc-head">
              <h2>מה יש במערכת הקורסים</h2>
            </div>
            <dl className="dc-cap-list">
              {capabilities.map((c) => (
                <div key={c.t} className="dc-cap">
                  <dt>{c.t}</dt>
                  <dd>{c.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Numbered because this really is an order of operations: you
            cannot build the course before the account exists. */}
        <section className="dc-flow">
          <div className="container">
            <div className="dc-head">
              <h2>איך זה עובד</h2>
            </div>
            <ol className="dc-flow-list">
              {steps.map((s, i) => (
                <li key={s.t}>
                  <span className="dc-flow-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="dc-flow-body">
                    <span className="dc-flow-t">{s.t}</span>
                    <span className="dc-flow-d">{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Two genuinely parallel lists, so they face each other: what
            the free course already is, and what paying adds to it. */}
        <section className="dc-plans">
          <div className="container">
            <div className="dc-head">
              <h2>קורס ראשון בחינם לגמרי</h2>
              <p>לא רק חשבון בחינם.</p>
            </div>

            <ul className="dc-nolimits">
              {noLimits.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>

            <div className="dc-compare">
              <div className="dc-col">
                <h3>מה כלול בחינם</h3>
                <ul>
                  {freeIncludes.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="dc-col dc-col-pro">
                <h3>לקוחות פרימיום מקבלים גם</h3>
                <ul>
                  {premiumAdds.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="dc-col-note">
                  התשלום הוא לפי כמות המנויים בחשבון. חשבון חינמי הופך לפרימיום
                  מ-<span className="dc-ltr">₪40</span> לחודש, וחשבונות של{" "}
                  <span className="dc-ltr">251–500</span> מנויים מ-
                  <span className="dc-ltr">₪79</span> לחודש, או{" "}
                  <span className="dc-ltr">₪71</span> בחבילה שנתית.
                </p>
                <Link to="/pricing/" className="dc-col-link">
                  למחירון המלא
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="dc-who">
          <div className="container">
            <div className="dc-head">
              <h2>למי זה מתאים</h2>
              <p>
                דרך קורס דיגיטלי אפשר ללמד, לייעץ ולהדריך, והכל בצורה אוטומטית
                לגמרי.
              </p>
            </div>
            <dl className="dc-who-list">
              {audiences.map((a) => (
                <div key={a.t} className="dc-who-row">
                  <dt>{a.t}</dt>
                  <dd>{a.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="dc-also">
          <div className="container">
            <div className="dc-head">
              <h2>מה עוד נכנס לחשבון</h2>
              <p>
                אותו חשבון חינמי פותח גם את שאר המערכת, בלי כרטיס אשראי ובלי
                התחייבות.
              </p>
            </div>
            <ul className="dc-also-list">
              {alsoIncluded.map((a) => (
                <li key={a.t}>
                  {a.to ? (
                    <Link to={a.to}>
                      <span className="dc-also-t">{a.t}</span>
                      <span className="dc-also-hook">{a.hook}</span>
                      <span className="dc-also-go" aria-hidden="true">
                        <ArrowIcon />
                      </span>
                    </Link>
                  ) : (
                    <div>
                      <span className="dc-also-t">{a.t}</span>
                      <span className="dc-also-hook">{a.hook}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Collapsed panels are 0fr and invisible, so they leave the tab
            order instead of merely going out of sight. */}
        <section className="dc-faq">
          <div className="container">
            <div className="dc-head">
              <h2>שאלות ותשובות</h2>
            </div>

            <div className="dc-qs">
              {faqs.map((f) => {
                const isOpen = openId === f.id
                return (
                  <div className="dc-q" key={f.id} data-open={isOpen}>
                    <h3 className="dc-q-h">
                      <button
                        type="button"
                        className="dc-q-btn"
                        id={`dc-q-${f.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`dc-a-${f.id}`}
                        onClick={() => setOpenId(isOpen ? null : f.id)}
                      >
                        <span>{f.q}</span>
                        <span className="dc-q-sign" aria-hidden="true">
                          <PlusIcon />
                        </span>
                      </button>
                    </h3>
                    <div
                      className="dc-a"
                      id={`dc-a-${f.id}`}
                      role="region"
                      aria-labelledby={`dc-q-${f.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="dc-a-in">
                        {f.a.map((para) => (
                          <p key={para}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="dc-faq-foot">
              שאלות על מערכת הקורסים?{" "}
              <Link to="/contact/" className="dc-inline-link">
                דברו איתנו
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default DigitalCoursesPage

export const Head: HeadFC = () => (
  <SEO
    title="קורסים דיגיטליים"
    description="פלטפורמת קורסים דיגיטליים של שלח מסר: קורס אחד עד 250 תלמידים חינם לתמיד, ללא הגבלת שיעורים, עם סליקה, אוטומציות ומבחנים אמריקאיים."
    pathname="/digital-courses/"
  />
)
