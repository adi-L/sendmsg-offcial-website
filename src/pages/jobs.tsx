import React, { useState, FormEvent } from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import CTA from "../components/CTA"
import { SUPPORT_EMAIL } from "../data/api"
import "../styles/jobs.css"

/* Applications have nowhere to go yet: the form flips to a success state
   in the browser, exactly like /contact/. The mail row beside it is the
   path that actually reaches a person, so it stays visible. */
const JOBS_EMAIL = SUPPORT_EMAIL

/* The site's icon set: 24-grid, 1.8 stroke, round caps, drawn rather
   than borrowed from a font. */
const stroke = (paths: React.ReactNode, size = 22) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {paths}
  </svg>
)

const MailIcon = () =>
  stroke(
    <>
      <rect x="2" y="4.5" width="20" height="15" rx="2.5" />
      <path d="m2.8 6 8.06 6.2a2 2 0 0 0 2.28 0L21.2 6" />
    </>
  )

/* Points the way the language runs. */
const GoIcon = ({ size = 20 }: { size?: number }) =>
  stroke(
    <>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </>,
    size
  )

const PlusIcon = () =>
  stroke(
    <>
      <path d="M12 5v14" className="jb-plus-v" />
      <path d="M5 12h14" />
    </>,
    20
  )

const factIcons: Record<string, React.ReactNode> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5 4.5 5.5V11c0 5 3.2 9 7.5 10.5 4.3-1.5 7.5-5.5 7.5-10.5V5.5z" />
      <path d="m8.8 11.8 2.3 2.4 4.1-4.6" />
    </>
  ),
  layers: (
    <>
      <path d="M12 2.5 2.5 7.5 12 12.5l9.5-5z" />
      <path d="m2.5 12.5 9.5 5 9.5-5" />
    </>
  ),
}

/* ── the openings ───────────────────────────────────────────────
   One list, and everything else on the page counts off it: the hero
   total, the badges, the options in the form's role menu. Changing a
   number here changes the whole page.

   First draft of the copy, written to match what the product actually
   is. Rewrite any line. */
type Opening = {
  id: string
  title: string
  count: number
  ltr?: boolean
  meta: string
  lede: string
  doing: string[]
  need: string[]
  plus: string[]
}

const OPENINGS: Opening[] = [
  {
    id: "support",
    title: "תמיכה ושירות לקוחות",
    count: 2,
    meta: "משרה מלאה · עבודה מרחוק",
    lede: "עונים ללקוחות בטלפון, בוואטסאפ ובמייל, ומלמדים אותם להוציא מהמערכת את המקסימום.",
    doing: [
      "מענה ללקוחות בטלפון, בוואטסאפ ובמייל בשעות הפעילות",
      "ליווי לקוחות חדשים בהקמת רשימות תפוצה, דיוורים ודפי נחיתה",
      "בירור תקלות מול צוות הפיתוח, מהפנייה הראשונה ועד הסגירה",
      "כתיבת מדריכים קצרים למרכז הידע מתוך השאלות שחוזרות",
    ],
    need: [
      "עברית רהוטה בכתב ובדיבור, וסבלנות אמיתית לאנשים",
      "שנה לפחות בתמיכה, בשירות לקוחות או בהדרכה",
      "נוחות עם מערכות אינטרנט: ממשקי ניהול, אקסל, דפדפן",
      "זמינות לשעות הפעילות, ראשון עד חמישי, 9:00 עד 17:00",
    ],
    plus: [
      "היכרות עם מערכת דיוור או CRM מהצד של המשתמש",
      "אנגלית טובה",
      "ניסיון בכתיבת תוכן הדרכה",
    ],
  },
  {
    id: "fullstack-ai",
    title: "Fullstack AI Developer",
    count: 1,
    ltr: true,
    meta: "משרה מלאה · עבודה מרחוק",
    lede: "בונים פיצ׳רים מקצה לקצה, ומכניסים מודלים של AI לתוך המוצר עצמו ולא לצידו.",
    doing: [
      "פיתוח פיצ׳רים שלמים, מהממשק ועד ה-API ועד הנתונים",
      "שילוב מודלים של LLM במוצר: כתיבת תוכן, פילוח, סיכומים ואוטומציות",
      "בנייה ותחזוקה של אינטגרציות ו-API למפתחים ולשותפים",
      "שיפור מהירות, אמינות ואבטחה בקוד שרץ בפרודקשן מול לקוחות",
    ],
    need: [
      "שלוש שנות ניסיון בפיתוח פולסטאק",
      "שליטה ב-JavaScript או TypeScript ובצד שרת, Node.js או PHP",
      "עבודה שוטפת עם בסיס נתונים רלציוני ועם REST API",
      "ניסיון מעשי בעבודה עם מודלים דרך API, לא רק קריאה עליהם",
    ],
    plus: [
      "React",
      "RAG, embeddings או בסיס נתונים וקטורי",
      "CI ותשתיות, ועבודה על מערכות בהיקף של מיליוני הודעות",
    ],
  },
  {
    id: "biz-dev",
    title: "פיתוח עסקי",
    count: 1,
    meta: "משרה מלאה · עבודה מרחוק",
    lede: "מביאים לקוחות ושותפים חדשים, מהפנייה הראשונה ועד החתימה ואחריה.",
    doing: [
      "יצירת הזדמנויות חדשות: פנייה יזומה, כנסים, סוכנויות ושותפויות",
      "ניהול תהליך מכירה שלם מול עסקים, ארגונים ועמותות",
      "הצגת דמו של המערכת ובניית הצעת מחיר שמתאימה לצורך",
      "עבודה מול השיווק והתמיכה, כדי שהלקוח יישאר גם אחרי החתימה",
    ],
    need: [
      "שנתיים לפחות במכירות B2B או בפיתוח עסקי",
      "יכולת לנהל שיחה עם בעלי עסקים ומנהלי שיווק בגובה העיניים",
      "סדר בעבודה מול CRM ובדיווח על צינור העסקאות",
      "רישיון נהיגה ונכונות לפגישה בשטח כשצריך",
    ],
    plus: [
      "היכרות עם עולם הדיוור, ה-SaaS או השיווק הדיגיטלי",
      "אנגלית",
      "ניסיון בבניית שותפויות",
    ],
  },
]

const TOTAL = OPENINGS.reduce((sum, job) => sum + job.count, 0)

const countLabel = (n: number) => (n === 1 ? "משרה אחת" : `${n} משרות`)

/* Facts the site already stands behind elsewhere: the founding years and
   the user count from /about/, the certificate from its documents
   section. Nothing here is a perk we made up. */
const facts = [
  {
    icon: "home",
    t: "עבודה מרחוק, לא היברידית",
    d: "כל המשרות מרחוק. הצוות עובד מכל מקום בארץ ונפגש כשיש סיבה.",
  },
  {
    icon: "users",
    t: "למעלה מ-50 אלף משתמשים",
    d: "מה שתבנו או תתמכו בו נוגע בעסקים אמיתיים באותו שבוע.",
  },
  {
    icon: "layers",
    t: "חברה עם קרקע מתחת לרגליים",
    d: "קומסטאר קמה ב-2004, שלח מסר עלתה לאוויר ב-2009 ומתפתחת מאז.",
  },
  {
    icon: "shield",
    t: "תקן ISO/IEC 27001:2022",
    d: "עובדים לפי נהלים כתובים של אבטחת מידע, גם בפיתוח וגם בתמיכה.",
  },
]

const steps = [
  {
    t: "שולחים פרטים",
    d: "טופס קצר, או מייל עם קורות חיים. שתי הדרכות מגיעות לאותו מקום.",
  },
  {
    t: "שיחת היכרות",
    d: "עשרים דקות בטלפון, בדרך כלל בתוך שבוע מהשליחה.",
  },
  {
    t: "פגישה מקצועית",
    d: "שיחה עם מי שתעבדו איתו יום יום, ובפיתוח גם משימה קטנה.",
  },
  {
    t: "תשובה, בכל מקרה",
    d: "גם כשזה לא מתאים. אף מועמד לא נשאר בלי מענה.",
  },
]

const JobsPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(OPENINGS[0].id)
  const [role, setRole] = useState(OPENINGS[0].title)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  /* The button inside an opening carries its role into the form, so
     nobody has to remember which one they were reading. */
  const applyFor = (title: string) => {
    setRole(title)
    document.getElementById("jb-apply")?.scrollIntoView({ block: "start" })
  }

  return (
    <Layout>
      <div className="jb">
        {/* The page says its own name first, then the one number that
            makes it worth reading: how many seats are actually open. */}
        <section className="jb-hero">
          <div className="container">
            <h1 className="jb-hero-title">דרושים</h1>
            <p className="jb-hero-claim">בואו לבנות איתנו את שלח מסר</p>
            <p className="jb-hero-lede">
              כל המשרות בעבודה מרחוק, בצוות שבונה את מערכת השיווק של עשרות אלפי
              עסקים בישראל.
            </p>
            <p className="jb-count">
              <span className="jb-count-n jb-ltr">{TOTAL}</span>
              <span>משרות פתוחות עכשיו</span>
            </p>
          </div>
        </section>

        {/* Narrow claim beside wide evidence: an asymmetric split, so the
            reasons do not arrive as four identical cards. */}
        <section className="jb-section">
          <div className="container jb-split jb-split-why">
            <div className="jb-why-said">
              <div className="jb-head">
                <h2>למה כאן</h2>
                <p>
                  שלח מסר היא מערכת שיווק ודיוור לעסקים ישראליים: ניוזלטרים, SMS,
                  דפי נחיתה, קורסים דיגיטליים ו-CRM במקום אחד. צוות קטן, מוצר
                  שמשתמשים בו כל יום, ומרחק קצר מאוד בין רעיון לאוויר.
                </p>
              </div>
            </div>

            <dl className="jb-facts">
              {facts.map(fact => (
                <div className="jb-fact" key={fact.t}>
                  <span className="jb-fact-icon">{stroke(factIcons[fact.icon])}</span>
                  <dt>{fact.t}</dt>
                  <dd>{fact.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* The openings: hairline rows that open in place. Not cards, and
            not three of anything, so the list can grow or shrink without
            the section falling apart. */}
        <section className="jb-section jb-roles-sec">
          <div className="container">
            <div className="jb-head">
              <h2>המשרות הפתוחות</h2>
              <p>
                {countLabel(TOTAL)} בסך הכול. פותחים משרה כדי לקרוא מה עושים בה, מה
                נדרש ומה נחשב יתרון.
              </p>
            </div>

            <div className="jb-roles">
              {OPENINGS.map(job => {
                const isOpen = openId === job.id
                return (
                  <div className="jb-role" key={job.id} data-open={isOpen}>
                    <h3 className="jb-role-h">
                      <button
                        type="button"
                        className="jb-role-btn"
                        id={`jb-role-${job.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`jb-panel-${job.id}`}
                        onClick={() => setOpenId(isOpen ? null : job.id)}
                      >
                        <span className="jb-role-main">
                          <span className="jb-role-top">
                            <span className={`jb-role-t${job.ltr ? " jb-ltr" : ""}`}>
                              {job.title}
                            </span>
                            <span className="jb-badge">{countLabel(job.count)}</span>
                          </span>
                          <span className="jb-role-meta">{job.meta}</span>
                          <span className="jb-role-lede">{job.lede}</span>
                        </span>
                        <span className="jb-role-sign" aria-hidden="true">
                          <PlusIcon />
                        </span>
                      </button>
                    </h3>

                    <div
                      className="jb-panel"
                      id={`jb-panel-${job.id}`}
                      role="region"
                      aria-labelledby={`jb-role-${job.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="jb-panel-in">
                        <div className="jb-lists">
                          <div className="jb-list">
                            <h4>מה עושים בתפקיד</h4>
                            <ul>
                              {job.doing.map(line => (
                                <li key={line}>{line}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="jb-list">
                            <h4>מה נדרש</h4>
                            <ul>
                              {job.need.map(line => (
                                <li key={line}>{line}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="jb-list">
                            <h4>יתרון</h4>
                            <ul>
                              {job.plus.map(line => (
                                <li key={line}>{line}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="jb-role-apply"
                          onClick={() => applyFor(job.title)}
                        >
                          להגיש מועמדות לתפקיד הזה
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="jb-none">
              לא מצאתם משרה מתאימה? שלחו קורות חיים בכל זאת ונשמור אותם אצלנו
              לתפקיד הבא שייפתח.
            </p>
          </div>
        </section>

        {/* Four steps read across, not down: a different family from the
            numbered column on /contact/. */}
        <section className="jb-section jb-flow-sec">
          <div className="container">
            <div className="jb-head">
              <h2>מה קורה אחרי שנשלח</h2>
              <p>התהליך קצר בכוונה. אנחנו צוות קטן ולא מגלגלים מועמדים בין חמישה ראיונות.</p>
            </div>
            <ol className="jb-flow">
              {steps.map((step, i) => (
                <li className="jb-flow-step" key={step.t}>
                  <span className="jb-flow-n jb-ltr" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="jb-flow-t">{step.t}</span>
                  <span className="jb-flow-d">{step.d}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* The form is wide, the alternative route is narrow. Same split
            as /contact/, mirrored, and the mail row stays because the
            form has no backend behind it yet. */}
        <section className="jb-section jb-apply-sec" id="jb-apply">
          <div className="container jb-split jb-split-apply">
            <div className="jb-form-col">
              <div className="jb-form">
                {submitted ? (
                  <div className="jb-sent" role="status">
                    <svg viewBox="0 0 52 52" width="68" height="68" aria-hidden="true">
                      <circle className="jb-sent-ring" cx="26" cy="26" r="24" fill="none" />
                      <path className="jb-sent-tick" fill="none" d="M14 27l8 8 16-17" />
                    </svg>
                    <h3>הפרטים נשלחו, תודה!</h3>
                    <p>נעבור על מה ששלחתם ונחזור אליכם, גם אם התשובה היא שזה לא מתאים כרגע.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <p className="jb-form-intro">הגשת מועמדות</p>
                    <p className="jb-form-sub">
                      ממלאים, מוסיפים קישור לקורות חיים או ללינקדאין, ואנחנו חוזרים
                      אליכם.
                    </p>

                    <div className="jb-field">
                      <label htmlFor="jb-name">איך קוראים לך?</label>
                      <input id="jb-name" name="name" type="text" autoComplete="name" required />
                    </div>

                    <div className="jb-pair">
                      <div className="jb-field">
                        <label htmlFor="jb-phone">מס׳ טלפון שניתן לחזור אליו?</label>
                        <input id="jb-phone" name="phone" type="tel" autoComplete="tel" required />
                      </div>
                      <div className="jb-field">
                        <label htmlFor="jb-email">כתובת מייל פעילה?</label>
                        <input
                          id="jb-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    <div className="jb-field">
                      <label htmlFor="jb-role">לאיזה תפקיד?</label>
                      <div className="jb-select">
                        <select
                          id="jb-role"
                          name="role"
                          value={role}
                          onChange={e => setRole(e.target.value)}
                        >
                          {OPENINGS.map(job => (
                            <option key={job.id} value={job.title}>
                              {job.title}
                            </option>
                          ))}
                          <option value="general">משרה אחרת, שולח בכל זאת</option>
                        </select>
                        <span className="jb-select-caret" aria-hidden="true">
                          {stroke(<path d="m6 9 6 6 6-6" />, 18)}
                        </span>
                      </div>
                    </div>

                    <div className="jb-field">
                      <label htmlFor="jb-cv">קישור לקורות חיים או ללינקדאין</label>
                      <input
                        id="jb-cv"
                        name="cv"
                        type="url"
                        inputMode="url"
                        placeholder="https://"
                        required
                      />
                    </div>

                    <div className="jb-field">
                      <label htmlFor="jb-about">
                        כמה מילים עליך
                        <span className="jb-opt">לא חובה</span>
                      </label>
                      <textarea id="jb-about" name="about" rows={4} />
                    </div>

                    <button type="submit" className="jb-submit">
                      שליחת מועמדות
                    </button>
                    <p className="jb-note">
                      הפרטים מגיעים לצוות שלנו בלבד ולא מועברים לאף גוף אחר.
                    </p>
                  </form>
                )}
              </div>
            </div>

            <div className="jb-aside">
              <div className="jb-head">
                <h2>או פשוט במייל</h2>
                <p>מעדיפים לצרף קובץ? שלחו קורות חיים ונענה משם.</p>
              </div>
              <a className="jb-row" href={`mailto:${JOBS_EMAIL}?subject=${encodeURIComponent("הגשת מועמדות")}`}>
                <span className="jb-row-icon">
                  <MailIcon />
                </span>
                <span className="jb-row-main">
                  <span className="jb-row-t">שליחת קורות חיים</span>
                  <span className="jb-row-v jb-ltr">{JOBS_EMAIL}</span>
                  <span className="jb-row-note">כתבו בשורת הנושא את שם התפקיד.</span>
                </span>
                <span className="jb-row-go">
                  <GoIcon />
                </span>
              </a>
            </div>
          </div>
        </section>
      </div>

      <CTA />
    </Layout>
  )
}

export default JobsPage

export const Head: HeadFC = () => (
  <SEO
    title="דרושים"
    description="המשרות הפתוחות בשלח מסר: תמיכה ושירות לקוחות, Fullstack AI Developer ופיתוח עסקי. כל המשרות בעבודה מרחוק."
    pathname="/jobs/"
  />
)
