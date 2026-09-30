import React, { useState, useEffect, useRef } from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import InlineCTA from "../components/InlineCTA"
import CTA from "../components/CTA"
import ClientMarquee from "../components/ClientMarquee"
import "../styles/about.css"

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

/* Outcomes first, tooling second: that is the order the reader cares about.
   What changes for my business, then how.

   The order is the argument, not a list: you gather an audience before you
   can keep in touch with it, you keep in touch before a lead converts, a
   customer has to exist before they can refer one, and growth is what the
   four before it add up to. That is why these are numbered. */
const outcomes = [
  "לבנות קהילה",
  "לשמור על קשר רציף עם לקוחות",
  "להפוך לידים ללקוחות",
  "להפוך לקוחות לשגרירים",
  "לגדול בצורה מסודרת וחכמה",
]

/* The platform's seven modules. Icons are the site's own set, lifted
   from the home page hero: 24-grid, 1.8 stroke, round caps. Nothing
   here invents a second icon language. */
const icon = (paths: React.ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    width="21"
    height="21"
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

const tools = [
  {
    label: "דיוור אלקטרוני מקצועי",
    icon: icon(
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="22,7 12,13 2,7" />
      </>
    ),
  },
  {
    label: "מערכת SMS חכמה",
    icon: icon(
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    ),
  },
  {
    label: "דפי נחיתה מעוצבים",
    icon: icon(
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </>
    ),
  },
  {
    label: "CRM מתקדם",
    icon: icon(
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    label: "אוטומציות שיווק",
    icon: icon(
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </>
    ),
  },
  {
    label: "מערכת קורסים דיגיטליים",
    icon: icon(
      <>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </>
    ),
  },
  {
    label: "חיבור לדומיין האישי שלכם",
    icon: icon(
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
  },
]

const story = [
  {
    year: "2004",
    text: "בשנת 2004 חברת קומסטאר פיתחה אתרים לעסקים. עם הזמן, החלו להתרבות הבקשות של בעלי העסקים לניהול הלקוחות ושליחת ניוזלטרים.",
  },
  {
    year: "2009",
    text: "אז ב-2009 יצרנו את שלח מסר: פלטפורמה שמרכזת את כל כלי השיווק במקום אחד ומאפשרת לכל עסק לנהל קשר אמיתי ומתמשך עם הלקוחות שלו.",
  },
]

/* The "why" closes the section rather than taking a third year slot: it is
   present tense, and its short declarative lines are the best-written copy on
   the site. They keep their own line breaks, because that cadence is the
   writing. */
const why = {
  lead: "כי עסקים בישראל צריכים מערכת שיווק אחת, פשוטה, חכמה ומקצועית – שתעבוד בשבילם ולא להפך.",
  lines: [
    "מערכת שמדברת בעברית.",
    "שמבינה את השוק הישראלי.",
    "שנותנת מענה אמיתי לעסקים בכל סדר גודל: מעסקים קטנים ובינוניים ועד ארגונים וחברות גדולות.",
  ],
}

/* The first entry leads the section and the other five follow it as a
   ruled list. A six-up grid claimed all six weigh the same, which is
   not what the company says about itself: simplicity is the founding
   principle and the rest are how it is kept. Order is the claim. */
const values = [
  {
    title: "פשטות לפני הכל",
    desc: "אנחנו מאמינים שטכנולוגיה צריכה להיות נגישה. גם אם אתם לא אנשים טכניים, תוכלו להשתמש במערכת בקלות.",
    icon: "simple",
  },
  {
    title: "אנושיות",
    desc: "מאחורי המערכת עומדים אנשים אמיתיים. צוות תמיכה שמקשיב, עוזר ומלווה.",
    icon: "human",
  },
  {
    title: "מקצועיות",
    desc: "אנחנו מפתחים ומשדרגים כל הזמן, כדי שתהיה לכם מערכת יציבה, מאובטחת ומתקדמת.",
    icon: "pro",
  },
  {
    title: "התאמה לשוק הישראלי",
    desc: "אפשרויות התאמה לשומרי שבת וחג, עבודה לפי החוק הישראלי, ממשק בעברית והתאמה לצרכים המקומיים.",
    icon: "israel",
  },
  {
    title: "אחריות",
    desc: "המערכת עומדת בתקנות הגנת הפרטיות ובתקן ISO לאבטחת מידע, והחברה פועלת באחריות סביבתית, חברתית ותאגידית.",
    icon: "responsibility",
  },
  {
    title: "תרומה לקהילה",
    desc: "אנחנו מאמינים שלעסקים יש אחריות חברתית, ומסייעים בקביעות לעמותות ולארגונים באמצעות תרומות, שיתופי פעולה ותמיכה טכנולוגית.",
    icon: "community",
  },
]

/* One illustrated set on one shared blue ground (#10649C), a hair off the
   brand's Primary Blue. Each portrait keeps that blue inside its own tile, so
   the set reads as one family without the colour taking over the section.
   Names and roles match the live site exactly. */
const team = [
  { name: "אסף שטרן", role: "מנכ״ל ובעלים", photo: asafStern },
  { name: "מאיה מושקין", role: "מנהלת משרד וכספים", photo: mayaMushkin },
  { name: "דודי אוחיון", role: "מנהל פיתוח", photo: dudiOchion },
  { name: "מריאן", role: "מפתחת", photo: marian },
  { name: "עדי לוי", role: "מפתח קריאדיטור", photo: adiLevi },
  { name: "שי גולדשטיין", role: "מנהל מוצר וצוות תמיכה", photo: shaiGoldstein },
  { name: "אלמוג קאפח", role: "תומך בכיר", photo: almogKapach },
  { name: "מריה קאל", role: "צוות שירות ותמיכה", photo: mariaKal },
  { name: "יפעת הלוי", role: "צוות שירות ותמיכה", photo: yifatHalevi },
  { name: "אור סקיי", role: "תפעול וכתיבת תוכן", photo: orSkahi },
]

const certificates = [
  {
    id: "iso",
    name: "תקן ISO לאבטחת מידע",
    desc: "ISO/IEC 27001:2022",
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
    desc: "אחריות חברתית, ממשל תאגידי וקיימות",
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

const aboutFaqs: { q: string; a: string; list?: string[] }[] = [
  {
    q: "יש הרבה חברות שמציעות דיוור ושיווק. מה הערך המוסף שלכם?",
    a: "נכון, יש הרבה מערכות בשוק. אצלנו דאגנו לרכז את הכל תחת קורת גג אחת, ברמה הגבוהה ביותר:",
    list: [
      "במערכת הקורסים יש כלים שלא תמצאו במקום אחר: תפריט עליון, קישור לקבוצת פייסבוק, מערך וובינרים ועוד.",
      "מערכת ה-SMS מאפשרת הודעות ארוכות עם תוכן ומתן ערך אישי ללקוחות.",
      "סטטיסטיקות חכמות שיעזרו להבין מה עובד ומה כדאי לשפר, כולל מפות חום.",
      "אינטגרציה ברמה הגבוהה ביותר.",
      "הכל במערכת אחת שחוסכת המון זמן וכסף.",
    ],
  },
  {
    q: "למי מתאימה מערכת שלח מסר?",
    a: "המערכת מתאימה לעסקים קטנים וגדולים, ארגונים, עמותות, מרצים, יוצרי תוכן וכל מי שרוצה לנהל קשר ישיר עם קהל הלקוחות שלו.",
  },
  {
    q: "איך עוברים לשלח מסר ממערכת אחרת?",
    a: "המעבר פשוט וקל, וצוות התמיכה ילווה אתכם לאורך כל הדרך. לקוחות הרוכשים מנוי שנתי זכאים לשירות ניוד תכנים ללא עלות, כולל דפי נחיתה, רשימות תפוצה, קורסים, סדרות ותבניות ניוזלטר, בכמות סבירה במסגרת השירות.",
  },
  {
    q: "איזו תמיכה אתם מספקים?",
    a: "באתר תמצאו מדריכים מפורטים לשימוש במערכת, וניתן לפנות לצוות התמיכה במייל. לקוחות בתשלום נהנים גם מתמיכת VIP מלאה: מענה בצ׳אט, בוואטסאפ ובטלפון בשעות הפעילות.",
  },
  {
    q: "האם ניתן לנסות את המערכת לפני רכישה?",
    a: "בטח. ניתן להשתמש במערכת במסגרת חבילה חינמית הכוללת עד 250 מנויים, ולשדרג לחבילה מתקדמת רק כשתצטרכו.",
  },
  {
    q: "האם השימוש בשלח מסר עומד בדרישות חוק הגנת הפרטיות?",
    a: "כן. המערכת מספקת כלים לניהול רשימות תפוצה ולשליחת מסרים תוך שמירה על עקרונות החוק. יחד עם זאת, האחריות על איסוף המידע, רישום מאגרי המידע במידת הצורך והשימוש בו בהתאם לחוק חלה עליכם, בעלי העסק.",
  },
]

/* Engraved marks, drawn as single-weight line work so the values sheet reads as
   one printing rather than six differently-coloured chips. "התאמה לשוק הישראלי"
   is set as the Hebrew letter א: the market itself, not a globe. */
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
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.4" {...stroke} />
        <path d="M8.3 12.3l2.6 2.6 4.9-5.4" {...stroke} />
      </svg>
    ),
    human: (
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9.4" cy="8.4" r="3.2" {...stroke} />
        <path d="M3.9 19.4c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5" {...stroke} />
        <circle cx="16.9" cy="9" r="2.4" {...stroke} opacity="0.55" />
        <path d="M16.1 15.1c2.6.2 4.7 1.7 4.7 4.1" {...stroke} opacity="0.55" />
      </svg>
    ),
    pro: (
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.2 18.6a4.3 4.3 0 0 0 .4-8.57 5.8 5.8 0 0 0-11.1 1.16 3.8 3.8 0 0 0 .4 7.41h10.3z" {...stroke} />
        <path d="M9.9 14.1l1.8 1.8 3.2-3.6" {...stroke} />
      </svg>
    ),
    israel: (
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.8s6.6-5.1 6.6-10.2a6.6 6.6 0 1 0-13.2 0c0 5.1 6.6 10.2 6.6 10.2z" {...stroke} />
        <circle cx="12" cy="10.3" r="2.5" {...stroke} />
      </svg>
    ),
    responsibility: (
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.8" y="10.4" width="14.4" height="9.4" rx="2.2" {...stroke} />
        <path d="M8.4 10.4V7.9a3.6 3.6 0 0 1 7.2 0v2.5" {...stroke} />
        <circle cx="12" cy="15.1" r="1.25" {...stroke} />
      </svg>
    ),
    community: (
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 19.6C7.4 15.6 4.6 13.2 4.6 10.2A3.9 3.9 0 0 1 12 8.4a3.9 3.9 0 0 1 7.4 1.8c0 3-2.8 5.4-7.4 9.4z"
          {...stroke}
        />
      </svg>
    ),
  }

  return <span className="ab-mark">{marks[type]}</span>
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
    <span className="ab-mark ab-mark-sm">
      {type === "seal" ? (
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="9.3" r="5.5" {...stroke} />
          <path d="M9.7 9.4l1.7 1.7 3-3.2" {...stroke} />
          <path d="M8.7 14.1L7.6 20.6l4.4-2.2 4.4 2.2-1.1-6.5" {...stroke} />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.6 4.4c0 8-4.2 12.8-9.1 12.8a5.4 5.4 0 0 1-5.4-5.4c0-4.7 5.7-7.4 14.5-7.4z" {...stroke} />
          <path d="M8 20.2c1.2-4.2 3.6-7.3 6.9-9.2" {...stroke} />
        </svg>
      )}
    </span>
  )
}

/* Renders the real figure from the very first paint and only animates up to it
   when the element is actually observed entering. Starting at zero meant any
   fast scroll or in-page jump left the page claiming "0+ משתמשים". */
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(target)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const run = () => {
      const start = performance.now()
      const duration = 1200
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration)
        // ease-out: fast off the line, settles onto the figure
        const eased = 1 - Math.pow(1 - p, 4)
        setCount(Math.round(target * eased))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        setCount(0)
        run()
      },
      { threshold: 0.6 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target])

  return (
    <span ref={ref} className="ab-num">
      {count.toLocaleString("he-IL")}
      {suffix}
    </span>
  )
}

/* The page's one authored motion: the portraits settling into place. Tiles
   start fully visible and are only hidden once this has confirmed JS is
   running, so a failed script or a no-JS render never swallows the team. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [state, setState] = useState<"idle" | "armed" | "in">("idle")

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // Already on screen at mount: there is no entrance left to play, and
    // arming it would only blank the grid out and fade it back in.
    if (node.getBoundingClientRect().top < window.innerHeight) return

    setState("armed")
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        setState("in")
      },
      { threshold: 0.15 }
    )
    observer.observe(node)

    // Nothing on this page is worth an empty grid. If the observer never
    // delivers, a plain rect check releases the tiles anyway.
    const failsafe = window.setInterval(() => {
      if (node.getBoundingClientRect().top > window.innerHeight * 0.9) return
      window.clearInterval(failsafe)
      observer.disconnect()
      setState("in")
    }, 600)

    return () => {
      observer.disconnect()
      window.clearInterval(failsafe)
    }
  }, [])

  return { ref, state }
}

const AboutPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [activeCert, setActiveCert] = useState(0)
  const cert = certificates[activeCert]
  const reveal = useReveal<HTMLUListElement>()

  return (
    <Layout>
      <div className="ab">
        {/* The page says its own name, then spends the rest of the band on the
            claim and the three facts behind it. */}
        <section className="ab-hero">
          <div className="container">
            <h1 className="ab-hero-title">אודות</h1>
            <p className="ab-hero-claim">
              מערכת דיוור ושיווק חכמה
              <span className="ab-hero-year">לעסקים בישראל</span>
            </p>
            <p className="ab-hero-lede">
              מאז 2009 אנחנו מרכזים את כל כלי השיווק של העסק במקום אחד, בעברית,
              עם אנשים אמיתיים מאחורי המערכת.
            </p>
            <ul className="ab-facts">
              <li>
                <Counter target={50000} suffix="+" /> משתמשים הצטרפו אלינו
              </li>
              <li>
                <span className="ab-num">2009</span> שנת ההקמה
              </li>
              <li>
                <span className="ab-num">7</span> כלי שיווק בפלטפורמה אחת
              </li>
            </ul>
          </div>
        </section>

        {/* Customers, immediately under the hero rather than crowded into
            it. Their own marks, moving, full bleed: the band has to read as
            a wall that continues past both edges, which a fixed row of
            typed-out names never did. */}
        <section className="ab-clients" aria-label="בין הלקוחות שלנו">
          <ClientMarquee />
        </section>

        {/* What we do: the outcome first, the tooling second */}
        <section className="ab-section ab-soft">
          <div className="container">
            <div className="ab-head">
              <h2>מה אנחנו עושים</h2>
            </div>
            <div className="ab-do">
              <ol className="ab-outcomes">
                {outcomes.map((o, i) => (
                  <li key={o}>
                    <span className="ab-outcome-n">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="ab-outcome-rule" aria-hidden="true" />
                    <span className="ab-outcome-t">{o}</span>
                    <span className="ab-outcome-lead" aria-hidden="true" />
                  </li>
                ))}
              </ol>

              <div className="ab-do-tools">
                <ul className="ab-tools">
                  {tools.map((tool) => (
                    <li key={tool.label}>
                      <span className="ab-tool-icon">{tool.icon}</span>
                      {tool.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="ab-section dot-grid">
          <div className="container">
            <div className="ab-head">
              <h2>איך הכל התחיל?</h2>
            </div>

            <ol className="ab-story">
              {story.map((stop) => (
                <li key={stop.year} className="ab-stop">
                  <span className="ab-stop-year">{stop.year}</span>
                  <p>{stop.text}</p>
                </li>
              ))}
            </ol>

            <div className="ab-why">
              <p className="ab-why-lead">{why.lead}</p>
              <p className="ab-why-lines">
                {why.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </div>
          </div>
        </section>

        {/* The founder, at full width: the page's one pause */}
        <section className="ab-quote">
          <div className="container">
            <figure>
              <blockquote>
                ״אנחנו מאמינים שלכל בעל עסק יש ערך ייחודי לתת לעולם, וששום מכשול
                טכנולוגי או שיווקי לא צריך לעמוד בדרך של החופש שלו לצמוח ולהצליח.״
              </blockquote>
              <figcaption>
                <img src={asafStern} alt="" width={72} height={72} loading="lazy" />
                <span>
                  <strong>אסף שטרן</strong>
                  <span>מנכ״ל ובעלים</span>
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        <InlineCTA
          title="רוצים לראות איך זה מרגיש מבפנים?"
          note="בלי כרטיס אשראי, בלי התחייבות"
          variant="dark"
        />

        {/* Vision: the company's one-sentence claim, standing alone. It is
            not a values section and does not share a frame with one. */}
        <section className="ab-section">
          <div className="container">
            <div className="ab-head ab-vision">
              <h2>חזון החברה</h2>
              <p>
                להיות הבחירה הראשונה של כל עסק לשיווק דיגיטלי פשוט, נגיש ואוטומטי,
                כדי שתוכלו להתרכז במה שאתם טובים בו.
              </p>
            </div>
          </div>
        </section>

        {/* Values: its own section, with its own heading. Six entries at one
            weight in two ruled columns — the order is the only claim about
            rank, and nothing needs a card to say it is first. */}
        <section className="ab-section ab-soft">
          <div className="container">
            <div className="ab-head">
              <h2>הערכים שלנו</h2>
            </div>

            <ul className="ab-value-list">
              {values.map((v) => (
                <li key={v.title}>
                  <ValueMark type={v.icon} />
                  <div>
                    <h3>{v.title}</h3>
                    <p>{v.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Certifications */}
        <section className="ab-section">
          <div className="container">
            <div className="ab-head">
              <h2>שני מסמכים שאנחנו גאים בהם</h2>
              <p>
                המידע של הלקוחות שלכם שמור אצלנו לפי תקנים בינלאומיים, וגם האחריות
                החברתית והסביבתית שלנו מתועדת ושקופה.
              </p>
            </div>

            <div className="ab-certs">
              <figure className="ab-cert-doc">
                <a
                  className="ab-cert-plate"
                  href={cert.image}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={cert.image} alt={cert.alt} loading="lazy" />
                </a>
                <figcaption>
                  <span>{cert.caption}</span>
                  <a href={cert.image} target="_blank" rel="noopener noreferrer">
                    פתיחה בגודל מלא
                  </a>
                </figcaption>
              </figure>

              <div className="ab-cert-side">
                <div className="ab-cert-picker" role="group" aria-label="בחירת מסמך לצפייה">
                  {certificates.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      className="ab-cert-opt"
                      aria-pressed={activeCert === i}
                      onClick={() => setActiveCert(i)}
                    >
                      <CertMark type={c.mark} />
                      <span>
                        <strong>{c.name}</strong>
                        <span>{c.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>

                <dl className="ab-cert-facts">
                  {cert.facts.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="ab-section ab-team">
          <div className="container">
            <div className="ab-head">
              <h2>צוות שלח מסר</h2>
              <p>
                חברת קומסטאר וצוות שלח מסר דואגים שהלקוח לא יישאר לבד, ומלווים
                אותו בבניית תהליכים ובהגדלת העסק.
              </p>
            </div>
            <ul className="ab-team-grid" ref={reveal.ref} data-state={reveal.state}>
              {team.map((member, i) => (
                <li key={member.name} style={{ "--i": i } as React.CSSProperties}>
                  <span className="ab-portrait">
                    <img src={member.photo} alt={member.name} loading="lazy" />
                  </span>
                  <strong>{member.name}</strong>
                  <span className="ab-member-role">{member.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="ab-section dot-grid">
          <div className="container">
            <div className="ab-head">
              <h2>שאלות נפוצות</h2>
            </div>
            <div className="ab-faq">
              {aboutFaqs.map((faq, i) => (
                <div key={faq.q} className="ab-faq-item" data-open={openFaq === i}>
                  <h3>
                    <button
                      type="button"
                      className="ab-faq-q"
                      aria-expanded={openFaq === i}
                      aria-controls={`ab-faq-a-${i}`}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span>{faq.q}</span>
                      <svg
                        className="ab-faq-chevron"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </h3>
                  {/* Collapsed panels stay mounted so the row can animate open,
                      so they are hidden from the a11y tree explicitly: a
                      zero-height answer is still read aloud otherwise. */}
                  <div
                    className="ab-faq-a"
                    id={`ab-faq-a-${i}`}
                    aria-hidden={openFaq !== i}
                  >
                    <div className="ab-faq-body">
                      <p>{faq.a}</p>
                      {faq.list && (
                        <ul>
                          {faq.list.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
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
    description="הכירו את שלח מסר, מערכת דיוור ושיווק חכמה לעסקים ישראליים מאז 2009. למעלה מ-50 אלף משתמשים."
    pathname="/about/"
  />
)
