import React, { useState, useEffect, useRef } from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import InlineCTA from "../components/InlineCTA"
import CTA from "../components/CTA"
import "../styles/about.css"

import heroArt from "../images/about-hero.webp"
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
    icon: "simple",
  },
  {
    title: "אנושיות",
    desc: "מאחורי המערכת עומד צוות תמיכה אמיתי שמלווה אתכם אישית, לא בוטים.",
    icon: "human",
  },
  {
    title: "מקצועיות",
    desc: "פיתוח מתמיד, מערכת יציבה ומאובטחת עם זמינות גבוהה ותשתית ענן מתקדמת.",
    icon: "pro",
  },
  {
    title: "התאמה לשוק הישראלי",
    desc: "ממשק בעברית מלאה, מצב שומר שבת, עמידה בדרישות חוק הגנת הפרטיות הישראלי.",
    icon: "israel",
  },
  {
    title: "אחריות",
    desc: "עמידה בדרישות GDPR, תקן ISO 27001 לאבטחת מידע, דוח ESG לאחריות חברתית.",
    icon: "responsibility",
  },
  {
    title: "תרומה לקהילה",
    desc: "תמיכה קבועה בעמותות וארגונים ללא מטרות רווח, כי שיווק טוב הוא לא רק לעסקים.",
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

/* Both documents are full pages meant to be read, so the section shows one at
   full width and lets the other be swapped in — the facts beside it come off
   the document itself, which is what a 56px thumbnail was failing to convey. */
const certificates = [
  {
    id: "iso",
    name: "ISO 27001",
    desc: "תקן בינלאומי לניהול אבטחת מידע",
    mark: "seal",
    image: isoCert,
    alt: "תעודת ISO/IEC 27001:2022 של קומסטאר מערכות בע״מ, מונפקת על ידי מכון התקנים הישראלי",
    caption: "תעודת ההסמכה כפי שהונפקה על ידי מכון התקנים הישראלי",
    facts: [
      ["התקן", "ת״י ISO/IEC 27001:2022"],
      ["גוף מסמיך", "מכון התקנים הישראלי"],
      ["מספר אישור", "1124792"],
      ["בתוקף עד", "06/11/2028"],
    ],
  },
  {
    id: "esg",
    name: "דוח ESG",
    desc: "סביבה, חברה וממשל תאגידי",
    mark: "leaf",
    image: escReport,
    alt: "העמוד הראשון של דוח ה-ESG של קומסטאר מערכות בע״מ",
    caption: "העמוד הראשון של הדוח השנתי",
    facts: [
      ["סביבה", "מעבר מלא לדיגיטל, צמצום השימוש בנייר ובשינוע פיזי"],
      ["חברה", "50% נשים בצוות, גיוס מכלל המגזרים"],
      ["קהילה", "תרומות וסיוע טכנולוגי לעמותות"],
    ],
  },
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

/* Engraved marks, drawn as single-weight line work so the sheet reads as one
   printing rather than six differently-coloured chips. "התאמה לשוק הישראלי"
   is set as the Hebrew letter א — the market itself, not a globe. */
function ValueMark({ type }: { type: string }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }

  const marks: Record<string, React.ReactNode> = {
    simple: (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.4" {...stroke} />
        <path d="M8.3 12.3l2.6 2.6 4.9-5.4" {...stroke} />
      </svg>
    ),
    human: (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9.4" cy="8.4" r="3.2" {...stroke} />
        <path d="M3.9 19.4c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5" {...stroke} />
        <circle cx="16.9" cy="9" r="2.4" {...stroke} opacity="0.55" />
        <path d="M16.1 15.1c2.6.2 4.7 1.7 4.7 4.1" {...stroke} opacity="0.55" />
      </svg>
    ),
    pro: (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.2 18.6a4.3 4.3 0 0 0 .4-8.57 5.8 5.8 0 0 0-11.1 1.16 3.8 3.8 0 0 0 .4 7.41h10.3z" {...stroke} />
        <path d="M9.9 14.1l1.8 1.8 3.2-3.6" {...stroke} />
      </svg>
    ),
    israel: (
      <span className="ab-mark-letter" aria-hidden="true">
        א
      </span>
    ),
    responsibility: (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.8" y="10.4" width="14.4" height="9.4" rx="2.2" {...stroke} />
        <path d="M8.4 10.4V7.9a3.6 3.6 0 0 1 7.2 0v2.5" {...stroke} />
        <circle cx="12" cy="15.1" r="1.25" {...stroke} />
      </svg>
    ),
    community: (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 19.6C7.4 15.6 4.6 13.2 4.6 10.2A3.9 3.9 0 0 1 12 8.4a3.9 3.9 0 0 1 7.4 1.8c0 3-2.8 5.4-7.4 9.4z"
          {...stroke}
        />
      </svg>
    ),
  }

  return <div className="ab-mark">{marks[type]}</div>
}

/* The cancellation mark that sits over the corner of the sheet. It carries the
   one fact the values grow out of: this has been running since 2009. */
function Postmark() {
  return (
    <div className="ab-postmark" aria-hidden="true">
      <span>שלח מסר</span>
      <b>2009</b>
      <span>ישראל</span>
    </div>
  )
}

function CertMark({ type }: { type: string }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }

  return (
    <div className="ab-mark">
      {type === "seal" ? (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="9.3" r="5.5" {...stroke} />
          <path d="M9.7 9.4l1.7 1.7 3-3.2" {...stroke} />
          <path d="M8.7 14.1L7.6 20.6l4.4-2.2 4.4 2.2-1.1-6.5" {...stroke} />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.6 4.4c0 8-4.2 12.8-9.1 12.8a5.4 5.4 0 0 1-5.4-5.4c0-4.7 5.7-7.4 14.5-7.4z" {...stroke} />
          <path d="M8 20.2c1.2-4.2 3.6-7.3 6.9-9.2" {...stroke} />
        </svg>
      )}
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
  const [activeCert, setActiveCert] = useState(0)
  const cert = certificates[activeCert]

  return (
    <Layout>
      <div className="ab">
        {/* Title plate: the page says its name back to whoever clicked it */}
        <section className="ab-hero ink-hero">
          <div className="container">
            <h1 className="ab-hero-title">אודות</h1>
            <p className="ab-hero-desc">
              הסיפור, הצוות והערכים שמאחורי מערכת הדיוור והשיווק הישראלית.
            </p>
          </div>
          <div className="ab-hero-edge" aria-hidden="true" />
        </section>

        {/* Who we are */}
        <section className="ab-section ab-intro">
          <div className="container">
            <div className="ab-intro-grid">
              <div className="ab-intro-text">
                <h2>
                  מערכת השיווק הישראלית,
                  <span className="ab-since">מאז 2009</span>
                </h2>
                <p className="ab-intro-lede">
                  שלח מסר היא מערכת אחת לכל השיווק של העסק: ניוזלטרים, SMS, דפי נחיתה,
                  קורסים דיגיטליים ו-CRM, בממשק אחד בעברית, עם צוות אמיתי שמלווה אתכם אישית.
                </p>
                <p className="ab-intro-note">
                  בין הלקוחות שלנו תמצאו עסקים קטנים וגדולים, ארגונים, עמותות, מרצים ויוצרי תוכן.
                </p>
              </div>

              {/* Decorative: the heading beside it carries the meaning, so the
                  artwork stays out of the reading order. */}
              <div className="ab-intro-art" aria-hidden="true">
                <img
                  src={heroArt}
                  alt=""
                  width={1141}
                  height={766}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Story timeline */}
        <section className="ab-section dot-grid">
          <div className="container">
            <h2 className="ab-section-title">איך הכל התחיל</h2>
            <div className="ab-rule" />
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
            <div className="ab-rule" />
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
          variant="dark"
        />

        {/* Values */}
        <section className="ab-section ab-values">
          <div className="container">
            <h2 className="ab-section-title">מה מנחה אותנו</h2>
            <div className="ab-rule" />
            <p className="ab-section-sub">
              החזון שלנו: להיות הבחירה הראשונה של כל עסק לשיווק דיגיטלי פשוט, נגיש ואוטומטי,
              כדי שתוכלו להתרכז במה שאתם טובים בו.
            </p>
            <div className="ab-sheet">
              <Postmark />
              <div className="ab-sheet-grid">
                {values.map((v) => (
                  <div key={v.title} className="ab-stamp-cell">
                    <ValueMark type={v.icon} />
                    <h3>{v.title}</h3>
                    <p>{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="ab-sheet-note">שישה ערכים, גיליון אחד. כל מסר שיוצא מכאן נושא את כולם.</p>
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
            <div className="ab-rule" />
            <p className="ab-section-sub">
              המידע של הלקוחות שלכם שמור אצלנו לפי תקנים בינלאומיים, וגם האחריות
              החברתית והסביבתית שלנו מתועדת ושקופה.
            </p>
            <div className="ab-certs">
              <div className="ab-cert-picker">
                <p className="ab-cert-hint">בחרו מסמך לצפייה</p>
                {certificates.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    className="ab-cert-card"
                    aria-pressed={activeCert === i}
                    onClick={() => setActiveCert(i)}
                  >
                    <CertMark type={c.mark} />
                    <span>
                      <strong>{c.name}</strong>
                      <span className="ab-cert-desc">{c.desc}</span>
                    </span>
                  </button>
                ))}

                <dl className="ab-cert-facts">
                  {cert.facts.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <figure className="ab-cert-viewer">
                <a
                  className="ab-cert-frame"
                  href={cert.image}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={cert.image} alt={cert.alt} loading="lazy" />
                </a>
                <figcaption>
                  {cert.caption}
                  <a href={cert.image} target="_blank" rel="noopener noreferrer">
                    פתיחה בגודל מלא
                  </a>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="ab-section" style={{ background: "var(--bg-soft)" }}>
          <div className="container">
            <h2 className="ab-section-title">הצוות שמאחורי המסרים</h2>
            <div className="ab-rule" />
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
        <section className="ab-section dot-grid">
          <div className="container">
            <h2 className="ab-section-title">שאלות נפוצות</h2>
            <div className="ab-rule" />
            <div className="ab-faq-list" style={{ marginTop: "36px" }}>
              {aboutFaqs.map((faq, i) => (
                <div key={faq.q} className="ab-faq-item" data-open={openFaq === i}>
                  <button
                    className="ab-faq-q"
                    aria-expanded={openFaq === i}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <span className="ab-faq-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
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
