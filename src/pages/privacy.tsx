import React from "react"
import { Link } from "gatsby"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { PRIVACY, PrivacyBlock } from "../data/privacy"
import "../styles/legal.css"

/* ── /privacy/ ──────────────────────────────────────────────────
   The policy, rendered from src/data/privacy.ts, which holds the
   live page's own wording. Same reading surface as /terms/ and
   /accessibility/.

   Three of the live page's nine sections are missing, deliberately:
   on sendmsg.co.il they carry text copied out of the תקנון and do
   not match their own headings, so they are not the privacy policy.
   See the note at the top of src/data/privacy.ts. The published
   numbering is kept so the "9.1."-style references inside the text
   stay correct. */

const PRIVACY_EMAIL = "privacy@comstar.co.il"
const DPO_EMAIL = "adv.shalom@gmail.com"
const POST_ADDRESS = "קומסטאר מערכות בע״מ, הסיבים 18, פתח תקווה, מיקוד 4925052, ת.ד. 7996"

/* Consecutive clause items are one list, not one list each. */
function group(blocks: PrivacyBlock[]) {
  const out: (PrivacyBlock | { kind: "list"; items: string[] })[] = []
  for (const b of blocks) {
    if (b.kind === "li") {
      const last = out[out.length - 1]
      if (last && last.kind === "list") last.items.push(b.text)
      else out.push({ kind: "list", items: [b.text] })
    } else {
      out.push(b)
    }
  }
  return out
}

const PrivacyPage: React.FC = () => (
  <Layout>
    <div className="lg">
      <section className="lg-hero">
        <div className="container">
          <h1>מדיניות פרטיות</h1>
          <p className="lg-hero-sub">
            אילו פרטים נאספים בעת השימוש במערכת שלח מסר, מה נעשה בהם, למי הם
            מועברים, ואיך מממשים את הזכות לעיין בהם ולתקן אותם.
          </p>
          <p className="lg-hero-meta">
            המדיניות כפופה להוראות <Link to="/terms/">התקנון</Link> של המערכת.
            לשאלות בנושא פרטיות אפשר לפנות אלינו, והפרטים נמצאים בתחתית העמוד.
          </p>
        </div>
      </section>

      <section className="lg-doc">
        <div className="container">
          <div className="lg-grid">
            <nav
              className="lg-toc"
              aria-label="תוכן עניינים"
              data-scroll={PRIVACY.length > 8}
            >
              <h2>תוכן עניינים</h2>
              <ol>
                {PRIVACY.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.heading}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <div>
              {PRIVACY.map((s) => (
                <section className="lg-sec" id={s.id} key={s.id}>
                  <h2>{s.heading}</h2>
                  {group(s.blocks).map((b, i) => {
                    if (b.kind === "dl") {
                      return (
                        <dl className="lg-dl" key={i}>
                          {b.items.map((it) => (
                            <div key={it.t}>
                              <dt>{it.t}</dt>
                              <dd>{it.d}</dd>
                            </div>
                          ))}
                        </dl>
                      )
                    }
                    if (b.kind === "list") {
                      return (
                        <ul className="lg-list" key={i}>
                          {b.items.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      )
                    }
                    return <p key={i}>{b.text}</p>
                  })}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="lg-contact">
        <div className="container">
          <div className="lg-contact-in">
            <h2>פניות בנושא פרטיות</h2>
            <p>
              לכל שאלה, הבהרה, בקשה לעיון במידע או בקשה לתיקון או מחיקה של מידע
              אישי, אפשר לפנות אלינו. כדי שנוכל לטפל בפנייה ביעילות, אנא כללו
              בה שם מלא, כתובת, טלפון ודואר אלקטרוני ליצירת קשר.
            </p>
            <ul className="lg-contact-rows">
              <li>
                <a href={`mailto:${PRIVACY_EMAIL}`}>
                  <span className="lg-contact-t">מייל</span>
                  <span className="lg-contact-v lg-ltr">{PRIVACY_EMAIL}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${DPO_EMAIL}`}>
                  <span className="lg-contact-t">ממונה הגנת פרטיות</span>
                  <span className="lg-contact-v lg-ltr">{DPO_EMAIL}</span>
                </a>
              </li>
            </ul>
            <p>דואר רגיל: {POST_ADDRESS}.</p>
          </div>
        </div>
      </section>
    </div>
    <CTA />
  </Layout>
)

export default PrivacyPage

export const Head: HeadFC = () => (
  <SEO
    title="מדיניות פרטיות"
    description="מדיניות הפרטיות של שלח מסר: איסוף מידע, השימוש בו, העברת מידע לצדדים שלישיים, אבטחת מידע לפי תקן ISO 27001, וזכות העיון והתיקון לפי חוק הגנת הפרטיות."
    pathname="/privacy/"
  />
)
