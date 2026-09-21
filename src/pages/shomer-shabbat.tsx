import React, { useState } from "react"
import type { HeadFC } from "gatsby"
import { Link } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/shomer-shabbat.css"

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2 6.5L4.5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const icon = (paths: React.ReactNode) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {paths}
  </svg>
)

const CandlesIcon = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 10v10M16 10v10M5 20h14" />
    <path d="M8 7c1 -1 1 -2.4 0 -3.4C7 4.6 7 6 8 7zM16 7c1 -1 1 -2.4 0 -3.4C15 4.6 15 6 16 7z" />
  </svg>
)

const steps = [
  {
    label: "ערב שבת",
    title: "המערכת נכנסת לשבת",
    text: "עם כניסת השבת, לפי הזמנים המדויקים, דפי הנחיתה והקורסים נחסמים ומוצגת הודעה מכובדת.",
    icon: <CandlesIcon />,
  },
  {
    label: "במהלך השבת",
    title: "הכל ממתין בשקט",
    text: "דיוורים והודעות שתוזמנו לשבת או לחג פשוט ממתינים. אף הודעה לא יוצאת.",
    icon: icon(<><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></>),
  },
  {
    label: "צאת השבת",
    title: "הכל חוזר לפעול מעצמו",
    text: "הדפים נפתחים מחדש, והדיוורים שהמתינו נשלחים אוטומטית. בלי לזכור ובלי להתעסק.",
    icon: icon(<><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" /></>),
  },
  {
    label: "אחרי שבת וחג",
    title: "רצפים נדחים ביום",
    text: "מיילים ברצף אוטומטי נדחים ביום קדימה, כדי שהמנויים לא יקבלו הכל בבת אחת.",
    icon: icon(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18M11 15h4M13 13v4" /></>),
  },
]

const features = [
  {
    title: "חסימת דפים וקורסים",
    desc: "דפי נחיתה, אתרים וקורסים דיגיטליים נחסמים אוטומטית מכניסת השבת ועד צאתה, וגם בחגים.",
    icon: icon(<><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M9 9a3 3 0 0 1 6 0v2M8.5 11h7v4h-7z" /></>),
  },
  {
    title: "עיכוב דיוורים מתוזמנים",
    desc: "דיוור שנופל על שבת או חג ממתין, ונשלח אוטומטית אחרי צאת השבת או החג.",
    icon: icon(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
  },
  {
    title: "תאריכים עבריים",
    desc: "התאריך העברי מוצג לצד הלועזי בכל המערכת, כדי שיהיה קל לתזמן סביב חגים ומועדים.",
    icon: icon(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>),
  },
  {
    title: "תזמון לפי חגי ישראל",
    desc: "מתזמנים קמפיין לחג לפי התאריך העברי, כולל תזמון שחוזר על עצמו בכל שנה מחדש.",
    icon: icon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>),
  },
  {
    title: "בס״ד בכל שליחה",
    desc: "הוספה אוטומטית של בס״ד בראש הניוזלטרים, דפי הנחיתה וההודעות.",
    icon: <span>בס״ד</span>,
  },
  {
    title: "גופני רש״י וסת״ם",
    desc: "ספריית גופנים עבריים ייחודית, כולל כתב רש״י, לשימוש חופשי בניוזלטרים ובדפים.",
    icon: <span>א</span>,
  },
  {
    title: "מותאם לאינטרנט מסונן",
    desc: "טכנולוגיית תמונות מוטמעות בגוף המייל, כדי שהדיוור ייראה טוב גם אצל גולשים עם סינון.",
    icon: icon(<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M3 17l5-4 4 3 4-4 5 5" /></>),
  },
  {
    title: "מובנה בכל החבילות",
    desc: "מצב שומר שבת הוא חלק מהמערכת, לא תוספת בתשלום. גם בחבילה החינמית.",
    icon: icon(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>),
  },
]

const faqs = [
  {
    q: "מה קורה לדיוור שתוזמן בטעות לשבת?",
    a: "שום דבר רע. הדיוור פשוט ממתין, ונשלח אוטומטית אחרי צאת השבת או החג. ברצפים אוטומטיים ההודעות הבאות נדחות ביום, כדי לשמור על קצב נעים למנויים.",
  },
  {
    q: "מה רואים גולשים שנכנסים לדף נחיתה בשבת?",
    a: "הודעה מעוצבת ומכובדת שמסבירה שהדף נח לרגל שבת קודש. במוצאי שבת הדף נפתח מחדש אוטומטית.",
  },
  {
    q: "לפי אילו זמנים המערכת נכנסת לשבת?",
    a: "החסימה והעיכוב פועלים מכניסת השבת או החג ועד צאתם, לפי זמנים גיאוגרפיים מדויקים.",
  },
  {
    q: "האם המערכת מתאימה לקהל עם אינטרנט מסונן?",
    a: "כן. יש טכנולוגיית תמונות מוטמעות בגוף המייל, כך שהדיוורים מוצגים כמו שצריך גם בסביבות מסוננות.",
  },
  {
    q: "כמה עולה מצב שומר שבת?",
    a: "כלום. זו לא תוספת בתשלום אלא חלק מהמערכת, בכל החבילות, כולל החבילה החינמית עד 250 מנויים.",
  },
]

const ShomerShabbatPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <Layout>
      <div className="sh">
        {/* Hero */}
        <section className="sh-hero">
          <div className="container">
            <h1>מערכת הדיוור היחידה בעולם עם מצב שומר שבת</h1>
            <p className="sh-hero-sub">
              דפי נחיתה נחסמים, דיוורים ממתינים, והכל חוזר לפעול במוצאי שבת.
              אוטומטית, לפי זמני השבת המדויקים, בלי שתצטרכו לזכור כלום.
            </p>
            <div className="sh-hero-actions">
              <a href={PANEL_URL} className="primary-btn" onClick={openSignup}>
                פתיחת חשבון בחינם
              </a>
              <Link to="/pricing/" className="sh-link">
                לכל החבילות ←
              </Link>
            </div>
            <div className="sh-hero-trust">
              {["מובנה בכל החבילות", "בחינם עד 250 מנויים", "מותאם גם לאינטרנט מסונן"].map((t) => (
                <span key={t}>
                  <CheckIcon />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Shabbat timeline */}
        <section className="sh-band">
          <div className="container">
            <h2>מה קורה כשנכנסת שבת?</h2>
            <p className="sh-band-sub">המערכת שומרת שבת יחד איתכם, מהדלקת נרות ועד הבדלה</p>
            <div className="sh-steps">
              {steps.map((step) => (
                <div key={step.label} className="sh-step">
                  <div className="sh-step-icon">{step.icon}</div>
                  <div className="sh-step-label">{step.label}</div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="sh-section">
          <div className="container">
            <h2 className="sh-section-title">בנוי לקהל שומר מסורת, לא מותאם בדיעבד</h2>
            <p className="sh-section-sub">
              כל פרט במצב שומר שבת נבנה מתוך הקשבה לעסקים, לעמותות ולמוסדות מהציבור הדתי והחרדי.
            </p>
            <div className="sh-features">
              {features.map((f) => (
                <div key={f.title} className="sh-feature">
                  <div className="sh-feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blocked page mockup */}
        <section className="sh-section sh-mock-section">
          <div className="container">
            <div className="sh-mock-grid">
              <div className="sh-mock-text">
                <h2>מה רואים הגולשים בשבת?</h2>
                <p>
                  במקום דף שבור או שגיאה, הגולשים פוגשים הודעה מעוצבת ומכובדת שמסבירה
                  שהדף נח לרגל שבת קודש.
                </p>
                <p>
                  ההודעה מוצגת אוטומטית מכניסת השבת, ובמוצאי שבת הדף חוזר לפעול מעצמו.
                  אותו הדבר קורה גם בחגים.
                </p>
              </div>
              <div className="sh-browser" role="img" aria-label="הדגמה של דף נחיתה חסום בשבת">
                <div className="sh-browser-bar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="sh-browser-body">
                  <p className="sh-browser-bsd">בס״ד</p>
                  <div className="sh-browser-candles">
                    <CandlesIcon size={40} />
                  </div>
                  <p className="sh-browser-title">הדף נח כעת לרגל שבת קודש</p>
                  <p className="sh-browser-text">
                    נשמח לראותכם שוב במוצאי שבת.
                    <br />
                    שבת שלום ומבורך!
                  </p>
                  <div className="sh-browser-tear" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="sh-section">
          <div className="container">
            <h2 className="sh-section-title">שאלות נפוצות</h2>
            <div className="sh-faq-list">
              {faqs.map((faq, i) => (
                <div key={faq.q} className="sh-faq-item" data-open={openFaq === i}>
                  <button
                    className="sh-faq-q"
                    aria-expanded={openFaq === i}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <span className="sh-faq-arrow" aria-hidden="true">▾</span>
                  </button>
                  {openFaq === i && <div className="sh-faq-a">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <CTA />
    </Layout>
  )
}

export default ShomerShabbatPage

export const Head: HeadFC = () => (
  <SEO
    title="שומר שבת"
    description="מערכת הדיוור היחידה בעולם עם מצב שומר שבת מובנה: חסימת דפים בשבת ובחג, עיכוב דיוורים, תאריכים עבריים ועוד. בחינם עד 250 מנויים."
    pathname="/shomer-shabbat/"
  />
)
