import React, { useState, useEffect, useRef } from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import InlineCTA from "../components/InlineCTA"
import CTA from "../components/CTA"
import "../styles/about.css"

import heroIllustration from "../images/illustrations/company-vision.svg"
import historyIllustration from "../images/illustrations/how-it-started.svg"
import isoCert from "../images/logos/iso-27001-2025.webp"
import escReport from "../images/logos/esc-report.webp"

import asafStern from "../images/team/asaf-stern.webp"
import mayaMushkin from "../images/team/maya-mushkin.webp"
import dudiOchion from "../images/team/dudi-ochion.webp"
import marian from "../images/team/marian.webp"
import adiLevi from "../images/team/adi-levi.webp"
import shaiGoldstein from "../images/team/shai-goldstein.webp"
import almogKapach from "../images/team/almog-kapach.webp"
import mariaKal from "../images/team/maria.webp"
import yifatHalevi from "../images/team/yifat.webp"
import orSkahi from "../images/team/or.webp"

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2 6.5L4.5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const story = [
  {
    year: "2004",
    title: "הכל התחיל מהקשבה",
    text: "חברת Comstar בונה אתרים לעסקים ישראליים, ומהלקוחות עולה שוב ושוב אותה בקשה: כלי פשוט לניהול לקוחות ולשליחת ניוזלטרים.",
  },
  {
    year: "2009",
    title: "שלח מסר יוצאת לדרך",
    text: "נולדה מערכת דיוור ישראלית שנבנתה מתוך הצרכים האמיתיים של עסקים בשטח: פשוטה, בעברית, עם אנשים אמיתיים מאחוריה.",
  },
  {
    year: "היום",
    title: "פלטפורמה אחת לכל השיווק",
    text: "דיוור, SMS, דפי נחיתה, קורסים דיגיטליים, CRM ובינה מלאכותית, בממשק אחד. מעל 51,000 משתמשים, וממשיכים לגדול.",
  },
]

const tools = [
  "מערכת דיוור אלקטרוני",
  "מערכת SMS חכמה",
  "דפי נחיתה מקצועיים",
  "מערכת CRM מתקדמת",
  "אוטומציות שיווקיות",
  "מערכת קורסים דיגיטליים",
  "חיבור דומיין פרטי ו-API",
]

const values = [
  {
    title: "פשטות קודם כל",
    desc: "טכנולוגיה נגישה וידידותית, גם למי שלא מגיע מרקע טכני. ממשק בעברית, ברור ופשוט.",
    color: "#0d598c",
    icon: "simple",
  },
  {
    title: "אנושיות",
    desc: "מאחורי המערכת עומד צוות תמיכה אמיתי שמלווה אתכם אישית, לא בוטים.",
    color: "#a8107e",
    icon: "human",
  },
  {
    title: "מקצועיות",
    desc: "פיתוח מתמיד, מערכת יציבה ומאובטחת עם זמינות גבוהה ותשתית ענן מתקדמת.",
    color: "#6328a7",
    icon: "pro",
  },
  {
    title: "התאמה לשוק הישראלי",
    desc: "ממשק בעברית מלאה, מצב שומר שבת, עמידה בדרישות חוק הגנת הפרטיות הישראלי.",
    color: "#0d598c",
    icon: "israel",
  },
  {
    title: "אחריות",
    desc: "עמידה בדרישות GDPR, תקן ISO 27001 לאבטחת מידע, דוח ESG לאחריות חברתית.",
    color: "#28a745",
    icon: "responsibility",
  },
  {
    title: "תרומה לקהילה",
    desc: "תמיכה קבועה בעמותות וארגונים ללא מטרות רווח, כי שיווק טוב הוא לא רק לעסקים.",
    color: "#a8107e",
    icon: "community",
  },
]

const team = [
  { name: "אסף שטרן", role: "מנכ״ל ובעלים", photo: asafStern },
  { name: "מאיה מושקין", role: "מנהלת משרד וכספים", photo: mayaMushkin },
  { name: "דודי אוחיון", role: "מנהל פיתוח", photo: dudiOchion },
  { name: "מריאן", role: "מפתחת", photo: marian },
  { name: "עדי לוי", role: "מפתח קריאדיטור", photo: adiLevi },
  { name: "שי גולדשטיין", role: "מנהל מוצר וצוות תמיכה", photo: shaiGoldstein },
  { name: "אלמוג כפח", role: "תומך בכיר", photo: almogKapach },
  { name: "מריה קאל", role: "צוות שירות ותמיכה", photo: mariaKal },
  { name: "יפת הלוי", role: "צוות שירות ותמיכה", photo: yifatHalevi },
  { name: "אור סקהי", role: "תפעול וכתיבת תוכן", photo: orSkahi },
]

const aboutFaqs = [
  {
    q: "מה הערך המוסף שלכם?",
    a: "מערכת All-in-One עם יכולות מתקדמות, תפריטי קורסים, פרסונליזציה ב-SMS, מפות חום, אינטגרציות ועוד. פתרון מקיף בפלטפורמה אחת.",
  },
  {
    q: "למי מתאימה מערכת שלח מסר?",
    a: "לעסקים קטנים וגדולים, ארגונים, עמותות, מרצים ויוצרי תוכן. כל מי שרוצה לשווק בצורה מקצועית ופשוטה.",
  },
  {
    q: "איך עוברים ממערכת אחרת?",
    a: "תהליך פשוט עם ליווי צוות התמיכה. למנויים שנתיים, העברת תוכן חינם ללא הגבלה.",
  },
  {
    q: "איזו תמיכה אתם מספקים?",
    a: "מדריכים מפורטים ותמיכה במייל לכולם. לקוחות משלמים מקבלים צ׳אט, וואטסאפ ותמיכה טלפונית בשעות הפעילות.",
  },
  {
    q: "האם ניתן לנסות לפני רכישה?",
    a: "בהחלט! יש תוכנית חינמית עם עד 250 מנויים, ללא כרטיס אשראי, ללא התחייבות.",
  },
  {
    q: "האם המערכת עומדת בדרישות חוק הגנת הפרטיות?",
    a: "כן. המערכת מספקת כלים לניהול פרטיות ועומדת בדרישות GDPR. באחריות המשתמש ליישם את ההגדרות בהתאם לחוק.",
  },
]

function ValueIcon({ type, color }: { type: string; color: string }) {
  const svgProps = { width: 22, height: 22, fill: color, viewBox: "0 0 24 24" }

  const icons: Record<string, React.ReactNode> = {
    simple: (
      <svg {...svgProps}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    human: (
      <svg {...svgProps}>
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    pro: (
      <svg {...svgProps}>
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
      </svg>
    ),
    israel: (
      <svg {...svgProps}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
    responsibility: (
      <svg {...svgProps}>
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
      </svg>
    ),
    community: (
      <svg {...svgProps}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  }

  return (
    <div className="ab-value-icon" style={{ background: `${color}14` }} aria-hidden="true">
      {icons[type]}
    </div>
  )
}

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1800
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {count.toLocaleString("he-IL")}
      {suffix}
    </span>
  )
}

const AboutPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <Layout>
      <div className="ab">
        {/* Hero */}
        <section className="ab-hero">
          <div className="container">
            <div className="ab-hero-grid">
              <div className="ab-hero-text">
                <h1>מערכת השיווק הישראלית, מאז 2009</h1>
                <p className="ab-hero-sub">
                  שלח מסר היא מערכת אחת לכל השיווק של העסק: ניוזלטרים, SMS, דפי נחיתה,
                  קורסים דיגיטליים ו-CRM, בממשק אחד בעברית, עם צוות אמיתי שמלווה אתכם אישית.
                </p>
                <p className="ab-hero-sub">
                  בין הלקוחות שלנו תמצאו עסקים קטנים וגדולים, ארגונים, עמותות, מרצים ויוצרי תוכן.
                </p>
                <div className="ab-trust">
                  {["מעל 51,000 עסקים בחרו בנו", "תקן אבטחת מידע ISO 27001", "מצב שומר שבת מובנה"].map((t) => (
                    <span key={t}>
                      <CheckIcon />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ab-hero-art">
                <img src={heroIllustration} alt="" role="presentation" />
              </div>
            </div>
          </div>
        </section>

        {/* Story timeline */}
        <section className="ab-section">
          <div className="container">
            <h2 className="ab-section-title">איך הכל התחיל</h2>
            <p className="ab-section-sub">
              שלח מסר לא נולדה במצגת. היא נולדה מהבקשות של לקוחות אמיתיים.
            </p>
            <div className="ab-story-grid">
              <div className="ab-timeline">
                {story.map((stop) => (
                  <div key={stop.year} className="ab-stop">
                    <span className="ab-stamp">{stop.year}</span>
                    <h3>{stop.title}</h3>
                    <p>{stop.text}</p>
                  </div>
                ))}
              </div>
              <div className="ab-story-side">
                <img src={historyIllustration} alt="" role="presentation" />
                <div className="ab-quote">
                  <blockquote>
                    ״אנחנו מאמינים שלכל בעל עסק יש ערך ייחודי לתת לעולם, וששום מכשול טכנולוגי
                    או שיווקי לא צריך לעמוד בדרך של החופש שלו לצמוח ולהצליח.״
                  </blockquote>
                  <div className="ab-quote-person">
                    <img src={asafStern} alt="אסף שטרן" />
                    <div>
                      <strong>אסף שטרן</strong>
                      <span>מנכ״ל ומייסד</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform */}
        <section className="ab-section" style={{ background: "var(--bg-soft)" }}>
          <div className="container">
            <h2 className="ab-section-title">כל הכלים בפלטפורמה אחת</h2>
            <p className="ab-section-sub">
              במקום לתחזק חמש מערכות נפרדות, אצלנו הכל מחובר: אנשי הקשר, הדפים,
              ההודעות והנתונים עובדים יחד.
            </p>
            <div className="ab-tools">
              {tools.map((tool) => (
                <span key={tool} className="ab-tool">
                  <CheckIcon />
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        <InlineCTA
          title="רוצים לראות איך זה מרגיש מבפנים?"
          note="בלי כרטיס אשראי, בלי התחייבות"
        />

        {/* Values */}
        <section className="ab-section">
          <div className="container">
            <h2 className="ab-section-title">מה מנחה אותנו</h2>
            <p className="ab-section-sub">
              החזון שלנו: להיות הבחירה הראשונה של כל עסק לשיווק דיגיטלי פשוט, נגיש ואוטומטי,
              כדי שתוכלו להתרכז במה שאתם טובים בו.
            </p>
            <div className="ab-values-grid">
              {values.map((v) => (
                <div key={v.title} className="ab-value">
                  <ValueIcon type={v.icon} color={v.color} />
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Numbers band */}
        <section className="ab-band">
          <div className="container">
            <div className="ab-band-grid">
              <div>
                <div className="ab-band-num">2009</div>
                <div className="ab-band-label">השנה שבה נולדה שלח מסר</div>
              </div>
              <div>
                <div className="ab-band-num">
                  <AnimatedCounter target={51000} suffix="+" />
                </div>
                <div className="ab-band-label">עסקים בחרו בנו עד היום</div>
              </div>
              <div>
                <div className="ab-band-num">7</div>
                <div className="ab-band-label">כלי שיווק בפלטפורמה אחת</div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="ab-section">
          <div className="container">
            <h2 className="ab-section-title">אחריות היא חלק מהמוצר</h2>
            <p className="ab-section-sub">
              המידע של הלקוחות שלכם שמור אצלנו לפי תקנים בינלאומיים, וגם האחריות
              החברתית והסביבתית שלנו מתועדת ושקופה.
            </p>
            <div className="ab-certs">
              <div className="ab-cert-cards">
                <div className="ab-cert-badge">
                  <img src={isoCert} alt="ISO 27001" loading="lazy" />
                  <div>
                    <strong>ISO 27001</strong>
                    <p>תקן אבטחת מידע בינלאומי</p>
                  </div>
                </div>
                <div className="ab-cert-badge">
                  <img src={escReport} alt="דוח ESG" loading="lazy" />
                  <div>
                    <strong>דוח ESG</strong>
                    <p>אחריות חברתית, ממשל תאגידי, קיימות</p>
                  </div>
                </div>
              </div>
              <div className="ab-cert-photo">
                <img src={isoCert} alt="תעודת ISO 27001 של שלח מסר" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="ab-section" style={{ background: "var(--bg-soft)" }}>
          <div className="container">
            <h2 className="ab-section-title">הצוות שמאחורי המסרים</h2>
            <p className="ab-section-sub">
              מנהלים ומנהלות, מפתחים ומפתחות, אנשי תמיכה ותוכן.
              כולנו כאן כדי שהשיווק שלכם פשוט יעבוד.
            </p>
            <div className="ab-team-grid">
              {team.map((member) => (
                <div key={member.name} className="ab-member">
                  <img src={member.photo} alt={member.name} loading="lazy" />
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="ab-section">
          <div className="container">
            <h2 className="ab-section-title">שאלות נפוצות</h2>
            <div className="ab-faq-list" style={{ marginTop: "36px" }}>
              {aboutFaqs.map((faq, i) => (
                <div key={faq.q} className="ab-faq-item" data-open={openFaq === i}>
                  <button
                    className="ab-faq-q"
                    aria-expanded={openFaq === i}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <span className="ab-faq-arrow" aria-hidden="true">▾</span>
                  </button>
                  {openFaq === i && <div className="ab-faq-a">{faq.a}</div>}
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

export default AboutPage

export const Head: HeadFC = () => (
  <SEO
    title="אודות"
    description="הכירו את שלח מסר, מערכת דיוור ושיווק חכמה לעסקים ישראליים מאז 2009. מעל 51,000 משתמשים מרוצים."
    pathname="/about/"
  />
)
