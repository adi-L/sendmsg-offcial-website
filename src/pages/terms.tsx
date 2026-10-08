import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { TERMS } from "../data/terms"
import { SUPPORT_PHONE } from "../data/support-hours"
import "../styles/legal.css"

/* ── /terms/ ────────────────────────────────────────────────────
   The agreement, rendered from src/data/terms.ts, which holds the
   live page's own wording. This file owns only the reading
   experience: one measured column and a sticky index, because a
   sixteen-section agreement is navigated to a clause far more often
   than it is read front to back.

   Nothing here paraphrases, shortens or reorders the text. */

const AFFILIATE_EMAIL = "sales@comstar.co.il"

const TermsPage: React.FC = () => (
  <Layout>
    <div className="lg">
      <section className="lg-hero">
        <div className="container">
          <h1>תקנון מערכת שלח מסר</h1>
          <p className="lg-hero-sub">
            תנאי השימוש במערכת ובשירותים הנלווים לה, החלים על כל לקוח ומשתמש.
          </p>
          <p className="lg-hero-meta">
            הספק הוא קומסטאר מערכות בע״מ, ח.פ.{" "}
            <span className="lg-ltr">514979525</span>. ההתקשרות בין הלקוחות
            לספק היא על בסיס עסקי, ולכן חוק הגנת הצרכן התשמ״א-1981 אינו חל
            עליה.
          </p>
        </div>
      </section>

      <section className="lg-doc">
        <div className="container">
          <div className="lg-grid">
            <nav
              className="lg-toc"
              aria-label="תוכן עניינים"
              data-scroll={TERMS.length > 8}
              data-count="true"
            >
              <h2>תוכן עניינים</h2>
              <ol>
                {TERMS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.heading}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <div>
              {TERMS.map((s) => (
                <section className="lg-sec" id={s.id} key={s.id}>
                  <h2>{s.heading}</h2>
                  {s.blocks.map((b, i) =>
                    b.kind === "dl" ? (
                      <dl className="lg-dl" key={i}>
                        {b.items.map((it) => (
                          <div key={it.t}>
                            <dt>{it.t}</dt>
                            <dd>{it.d}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p key={i}>{b.text}</p>
                    )
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="lg-contact">
        <div className="container">
          <div className="lg-contact-in">
            <h2>שאלות על התקנון</h2>
            <p>
              לשאלות על תנאי השימוש, לבקשות תגמול בתכנית השותפים ולפניות בנושא
              גישה לחשבון, אפשר לפנות אלינו באחת מהדרכים האלה.
            </p>
            <ul className="lg-contact-rows">
              <li>
                <a href={`tel:${SUPPORT_PHONE.replace(/-/g, "")}`}>
                  <span className="lg-contact-t">טלפון</span>
                  <span className="lg-contact-v lg-ltr">{SUPPORT_PHONE}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${AFFILIATE_EMAIL}`}>
                  <span className="lg-contact-t">מייל</span>
                  <span className="lg-contact-v lg-ltr">{AFFILIATE_EMAIL}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://api.whatsapp.com/send?phone=972559377588"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="lg-contact-t">וואטסאפ</span>
                  <span className="lg-contact-v lg-ltr">055-9377588</span>
                </a>
              </li>
              <li>
                <a
                  href="https://sendmsg.co.il/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="lg-contact-t">פרטיות</span>
                  <span className="lg-contact-v">מסמך מדיניות הפרטיות המלא</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
    <CTA />
  </Layout>
)

export default TermsPage

export const Head: HeadFC = () => (
  <SEO
    title="תקנון"
    description="תקנון מערכת שלח מסר: תנאי השימוש, זכויות יוצרים, מדיניות תשלום וביטולים, דואר זבל, תכנית שותפים, מספרים וירטואליים ודומיינים."
    pathname="/terms/"
  />
)
