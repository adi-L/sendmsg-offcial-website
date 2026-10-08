import React from "react"
import { Link } from "gatsby"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import { TIERS } from "../components/Pricing"
import "../styles/affiliate.css"

/* Copy is the live /affiliate/ page's own.

   The one exception is the worked example. The live page quotes a
   commission of 695.4 ש״ח for its scenario, which does not follow
   from the price list this site publishes. The scenario is kept and
   the arithmetic is recomputed from TIERS, so the example and
   /pricing/ can never disagree. */
const RATE = 0.2
const PAYOUT_MIN = 400

const tierFor = (contacts: number) =>
  TIERS.find((t) => t.contacts >= contacts) ?? TIERS[TIERS.length - 1]

/* The live page's own scenario: two referrals who signed for a year */
const example = [4800, 700].map((contacts) => {
  const tier = tierFor(contacts)
  return { contacts, tier, annual: tier.year * 12 }
})

const exampleTotal = example.reduce((sum, r) => sum + r.annual, 0)
const exampleCommission = exampleTotal * RATE

const he = (n: number) => n.toLocaleString("he-IL")
const shekels = (n: number) =>
  n.toLocaleString("he-IL", {
    minimumFractionDigits: n % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })

/* What the 20% applies to */
const earns = [
  "דמי מנוי של חבילות הדיוור, בתשלום חודשי או שנתי",
  "חבילות בנק מיילים",
  "חבילות קורסים דיגיטליים",
]

const steps = [
  "נרשמים למערכת שלח מסר.",
  "לוחצים על אייקון הדולר בחלק העליון של ממשק שלח מסר.",
  "פועלים לפי ההוראות ומעתיקים את קישור השותפים שלכם.",
  "שולחים את הקישור ועוקבים אחרי ההרשמות והרווחים.",
]

const suits = [
  "יועצים עסקיים",
  "יועצי שיווק, בוני אתרים ומשווקים",
  "מומחי דיגיטל ואוטומציות",
  "משרדי פרסום ודיגיטל",
  "בעלי עסקים שרוצים להמליץ ולהיות מתוגמלים",
]

const AffiliatePage: React.FC = () => (
  <Layout>
    <div className="af">
      <section className="af-hero">
        <div className="container">
          <h1>תכנית שותפים</h1>
          <p className="af-hero-sub">
            אהבתם את המערכת ורוצים להמליץ עליה ללקוחות ולחברים? על כל לקוח
            שיצטרף דרככם תקבלו 20% עמלה.
          </p>
          <p className="af-hero-note">
            העמלות הן לכל החיים, כל עוד המופנה משלם על החבילות שצוינו.
          </p>
          <a href={PANEL_URL} className="af-btn af-btn-accent" onClick={openSignup}>
            פתיחת חשבון והצטרפות לתכנית
          </a>
        </div>
      </section>

      <section className="af-earns">
        <div className="container">
          <div className="af-earns-split">
            <div className="af-head">
              <h2>על מה מקבלים עמלה</h2>
              <p>
                התשלום מועבר בהעברה בנקאית, מרגע שהרווחים המצטברים מגיעים ל-
                <span className="af-ltr">₪{he(PAYOUT_MIN)}</span> לפחות.
              </p>
            </div>
            <ul className="af-earn-list">
              {earns.map((e) => (
                <li key={e}>
                  <span className="af-earn-t">{e}</span>
                  <span className="af-earn-rate" aria-hidden="true">
                    20%
                  </span>
                  <span className="af-sr">עמלה של 20 אחוז</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The sum, shown rather than asserted. Every figure in it comes
          from the same price list /pricing/ renders, so the two cannot
          drift apart. */}
      <section className="af-example">
        <div className="container">
          <div className="af-head">
            <h2>איך זה נראה במספרים</h2>
            <p>
              שני מופנים שנרשמו דרככם וסגרו חבילה שנתית, לפי החבילה שמתאימה
              לכמות אנשי הקשר שלהם.
            </p>
          </div>

          <table className="af-table">
            <caption className="af-sr">
              חישוב עמלת שותפים לדוגמה, בשקלים, לפני מע״מ
            </caption>
            <thead>
              <tr>
                <th scope="col">אנשי קשר אצל המופנה</th>
                <th scope="col">החבילה המתאימה</th>
                <th scope="col">תשלום לשנה</th>
              </tr>
            </thead>
            <tbody>
              {example.map((r) => (
                <tr key={r.contacts}>
                  <th scope="row">{he(r.contacts)}</th>
                  <td>
                    {he(r.tier.contacts)} אנשי קשר,{" "}
                    <span className="af-ltr">₪{he(r.tier.year)}</span> לחודש
                  </td>
                  <td>
                    <span className="af-ltr">₪{he(r.annual)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={2}>
                  סך התשלומים
                </th>
                <td>
                  <span className="af-ltr">₪{he(exampleTotal)}</span>
                </td>
              </tr>
              <tr className="af-table-total">
                <th scope="row" colSpan={2}>
                  העמלה שלכם, 20%
                </th>
                <td>
                  <span className="af-ltr">₪{shekels(exampleCommission)}</span>
                </td>
              </tr>
            </tfoot>
          </table>

          <p className="af-foot">
            המחירים לפני מע״מ, לפי{" "}
            <Link to="/pricing/" className="af-inline-link">
              המחירון
            </Link>
            . בחיוב חודשי הסכומים שונים, והעמלה מחושבת מהתשלום בפועל.
          </p>
        </div>
      </section>

      <section className="af-start">
        <div className="container">
          <div className="af-head">
            <h2>איך מתחילים</h2>
            <p>
              כשאתם מזהים לקוח או חבר שהמערכת תעזור לו, שולחים לו קישור הרשמה
              דרככם ומקבלים את העמלה.
            </p>
          </div>
          <ol className="af-steps">
            {steps.map((s, i) => (
              <li key={s}>
                <span className="af-step-n" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="af-step-t">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="af-suits">
        <div className="container">
          <div className="af-suits-split">
            <div className="af-head">
              <h2>למי התכנית מתאימה</h2>
            </div>
            <ul className="af-suit-list">
              {suits.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The two rules that decide whether a commission is paid at all,
          so they are stated plainly rather than left in small print. */}
      <section className="af-notes">
        <div className="container">
          <div className="af-notes-in">
            <h2>יש לשים לב</h2>
            <p>
              מופנה שלא נרשם דרך קישור השותפים שלכם לא נכנס למעקב, ולא ניתן
              להחשיב אותו כמופנה שלכם בדיעבד.
            </p>
            <p>
              לא תתאפשר קבלת עמלה עבור מופנה שנפתח על ידי אותו עסק מפנה.
            </p>
            <p className="af-notes-terms">תכנית השותפים בכפוף לתקנון.</p>
          </div>
        </div>
      </section>
    </div>
    <CTA />
  </Layout>
)

export default AffiliatePage

export const Head: HeadFC = () => (
  <SEO
    title="תכנית שותפים"
    description="תכנית השותפים של שלח מסר: 20% עמלה לכל החיים על חבילות דיוור, בנק מיילים וקורסים דיגיטליים, עם משיכה מ-₪400 רווחים מצטברים."
    pathname="/affiliate/"
  />
)
