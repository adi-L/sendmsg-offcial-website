import React from "react"
import { Link } from "gatsby"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/services.css"

/* ── The services hub ───────────────────────────────────────────
   This page routes. Every module below now has its own page, so
   the hub's only job is to show the whole shape of the system and
   hand off — it must not restate the capability lists those pages
   already carry, or it becomes the worst copy of each of them.

   Headline is the live /services/ page's own line. Every price and
   every hook below is lifted from the child page it links to, so
   there is exactly one place each figure is maintained. */

type Row = {
  t: string
  hook: string
  /* The real figure, or null when the module is simply in the account */
  price: React.ReactNode
  to?: string
  href?: string
}

type Family = {
  id: string
  label: string
  /* Why these belong together, in the system's own terms */
  note: string
  rows: Row[]
}

const Ltr: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sv-ltr">{children}</span>
)

const FAMILIES: Family[] = [
  {
    id: "mailing",
    label: "דיוור ואוטומציה",
    note: "הכל יוצא מאותה רשימת תפוצה ונרשם על אותו לקוח.",
    rows: [
      {
        t: "קמפיינים וניוזלטרים",
        hook: "ממשק בנייה ועריכה, תבניות ממירות ואוטומציות מרגע ההרשמה",
        price: (
          <>
            מ-<Ltr>₪40</Ltr> לחודש
          </>
        ),
        to: "/newsletters/",
      },
      {
        t: "יצירת דפי נחיתה",
        hook: "דפים רספונסיביים תחת דומיין פרטי, עם טפסים וסליקה",
        price: "עד 5 דפים בחינם",
        to: "/landing-pages/",
      },
      {
        t: "קורסים דיגיטליים",
        hook: "שיעורים, מבחנים אמריקאיים וגישה רק למשלמים",
        price: "קורס ראשון בחינם",
        to: "/digital-courses/",
      },
      {
        t: "AI דיוור",
        hook: "בינה מלאכותית שבונה דיוור מוכן לשליחה תוך דקות",
        price: "ממשק נפרד",
        href: "https://ai.sendmsg.co.il/",
      },
    ],
  },
  {
    id: "sms",
    label: "מסרונים",
    note: "המערכת בחשבון, ההודעות נקנות בחבילה חד פעמית.",
    rows: [
      {
        t: "מערכת לשליחת סמסים",
        hook: "קיצור קישורים, שליחה בפולסים, צ׳אט וואטסאפ ואוטומציות לפי הקלקות",
        price: "כלולה בחשבון",
        to: "/sms/",
      },
      {
        t: "חבילות בנק SMS",
        hook: "70, 140 או 210 תווים להודעה, בתשלום חד פעמי",
        price: (
          <>
            מ-<Ltr>₪147</Ltr> ל-<Ltr>5,000</Ltr> הודעות
          </>
        ),
        to: "/sms-bank/",
      },
      {
        t: "מספר וירטואלי",
        hook: "ההודעות יוצאות ממספר ייעודי וכל התשובות מתרכזות ברשימה אחת",
        price: (
          <>
            <Ltr>₪118</Ltr> לשנה
          </>
        ),
        to: "/virtual-number/",
      },
    ],
  },
  {
    id: "clients",
    label: "לקוחות וצמיחה",
    note: "אותה כרטסת לקוחות שכל שאר המערכת כותבת אליה.",
    rows: [
      {
        t: "מועדון לקוחות (CRM)",
        hook: "כרטסת שדות גמישה, פילוח מדויק, תיעוד שיחות ותזכורות",
        price: "כלול בחשבון",
        to: "/crm/",
      },
      {
        t: "מודול פגישות ושיתופי פעולה",
        hook: "האלגוריתם מזהה עסקים לשת״פ, אתם בוחרים תאריך ונפגשים בזום",
        price: "כלול בחשבון",
        to: "/meetings/",
      },
      {
        t: "תכנית שותפים",
        hook: "על כל לקוח שמצטרף דרככם, לכל אורך המנוי שלו",
        price: "20% עמלה",
        to: "/affiliate/",
      },
    ],
  },
  {
    id: "infra",
    label: "תשתית וחיבורים",
    note: "מה שנמצא מתחת לכל השאר: נפח, כתובת והתממשקות.",
    rows: [
      {
        t: "בנק שליחות מיילים",
        hook: "הגדלת נפח השליחה מעל מה שכלול במנוי, בתשלום חד פעמי",
        price: (
          <>
            מ-<Ltr>₪640</Ltr> ל-<Ltr>10,000</Ltr> שליחות
          </>
        ),
        to: "/email-bank/",
      },
      {
        t: "רכישת דומיין פרטי",
        hook: "כולל תיבה וירטואלית, תעודת SSL והגדרת רשומות אוטומטית",
        price: (
          <>
            <Ltr>.co.il</Ltr> ב-<Ltr>₪120</Ltr>
          </>
        ),
        to: "/domain/",
      },
      {
        t: "התממשקות API",
        hook: "לחבר את המערכת למה שכבר רץ אצלכם, ולשלוח מתוכו",
        price: "כלולה בחשבון",
        to: "/api/",
      },
    ],
  },
]

const MODULE_COUNT = FAMILIES.reduce((n, f) => n + f.rows.length, 0)

/* What a free account actually opens, each line taken from the page
   that owns the claim rather than restated from the marketing copy. */
const FREE = [
  { t: "רשימת תפוצה", d: "עד 250 מנויים, חינם ולתמיד, בלי כרטיס אשראי" },
  { t: "דפי נחיתה", d: "עד 5 דפים ללא עלות וללא התחייבות" },
  {
    t: "קורס דיגיטלי",
    d: "קורס אחד עד 250 תלמידים, ללא הגבלת שיעורים ומבחנים",
  },
  { t: "מסרונים", d: "100 ההודעות הראשונות, אחר כך בחבילה" },
  { t: "מועדון לקוחות", d: "הכרטסת, הפילוח והתיעוד כבר בחבילה הבסיסית" },
]

const ArrowIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      d="M14 5l-7 7 7 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ExternalIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      d="M14 4h6v6M20 4l-8.5 8.5M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const RowBody: React.FC<{ r: Row }> = ({ r }) => (
  <>
    <span className="sv-row-t">{r.t}</span>
    <span className="sv-row-hook">{r.hook}</span>
    <span className="sv-row-price">{r.price}</span>
    <span className="sv-row-go" aria-hidden="true">
      {r.href ? <ExternalIcon /> : <ArrowIcon />}
    </span>
  </>
)

const ServicesPage: React.FC = () => (
  <Layout>
    <div className="sv">
      <section className="sv-hero">
        <div className="container">
          <div className="sv-hero-grid">
            <div className="sv-hero-main">
              <h1>שירותים</h1>
              <p className="sv-hero-sub">
                עיצוב חדשני וכלים מתקדמים במערכת הדיוור החדשנית והמובילה בארץ
              </p>
              <p className="sv-hero-note">
                {MODULE_COUNT} מודולים, חשבון אחד, אותה רשימת לקוחות. כל מה
                שלמטה נפתח מאותה הרשמה חינמית.
              </p>
              <a
                href={PANEL_URL}
                className="sv-btn sv-btn-accent"
                onClick={openSignup}
              >
                פתיחת חשבון בחינם
              </a>
            </div>

            {/* The panel holds an object, not a sentence: it is the
                index of the page, with the real count per family. */}
            <nav className="sv-jump" aria-label="משפחות השירותים">
              <ul>
                {FAMILIES.map((f) => (
                  <li key={f.id}>
                    <a href={`#${f.id}`}>
                      <span className="sv-jump-t">{f.label}</span>
                      <span className="sv-jump-n">{f.rows.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      {/* The page itself. The family label parks beside its own rows
          and hands off to the next as you scroll, so a long index
          never loses which group you are reading. */}
      <section className="sv-index">
        <div className="container">
          {FAMILIES.map((f) => (
            <div className="sv-fam" id={f.id} key={f.id}>
              <div className="sv-fam-head">
                <h2>{f.label}</h2>
                <p>{f.note}</p>
              </div>
              <ul className="sv-rows">
                {f.rows.map((r) => (
                  <li key={r.t}>
                    {r.to ? (
                      <Link to={r.to}>
                        <RowBody r={r} />
                      </Link>
                    ) : (
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <RowBody r={r} />
                        <span className="sv-sr">נפתח בחלון חדש</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="sv-free">
        <div className="container">
          <div className="sv-free-grid">
            <div className="sv-head">
              <h2>מה נפתח בחשבון החינמי</h2>
              <p>
                החשבון החינמי הוא לא תקופת ניסיון. הוא נשאר פתוח, והמנוי בתשלום
                מתחיל כשרשימת הלקוחות גדלה.
              </p>
              <Link to="/pricing/" className="sv-free-link">
                למחירון המלא
                <span aria-hidden="true">
                  <ArrowIcon />
                </span>
              </Link>
            </div>
            <dl className="sv-free-list">
              {FREE.map((f) => (
                <div className="sv-free-item" key={f.t}>
                  <dt>{f.t}</dt>
                  <dd>{f.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
    <CTA />
  </Layout>
)

export default ServicesPage

export const Head: HeadFC = () => (
  <SEO
    title="שירותים"
    description="כל המודולים של שלח מסר במקום אחד: ניוזלטרים, דפי נחיתה, קורסים דיגיטליים, מערכת סמסים, בנק SMS, מספר וירטואלי, CRM, פגישות, בנק שליחות, דומיין פרטי ו-API."
    pathname="/services/"
  />
)
