import React, { useState } from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/domain.css"
import type { PageContext } from "../locales/config"
import { useText } from "../locales/LocaleContext"
import LocalizedLink from "../locales/LocalizedLink"
import heText from "../locales/he/pages/domain.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

/* Copy is the live domain page's own. Its answers arrive as one run-on
   string because the source joins paragraphs without spaces; they are
   split back into sentences here, not rewritten. */

/* Prices as the live page states them, before VAT */
const prices = [
  { ext: ".co.il / .org.il", buy: 120, renew: 160 },
  { ext: ".com", buy: 125, renew: 167 },
]

const he = (n: number) => n.toLocaleString("he-IL")

const PlusIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path className="dm-plus-v" d="M12 4v16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const DomainPage: React.FC = () => {
  const t = useText(TEXT)
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Layout>
      <div className="dm">
        <section className="dm-hero">
          <div className="container">
            <h1>{t.h1}</h1>
            <p className="dm-hero-sub">
              {t.heroSub}
            </p>
            <p className="dm-hero-note">
              {t.heroNote}
            </p>
            <a href={PANEL_URL} className="dm-btn dm-btn-accent" onClick={openSignup}>
              {t.btn}
            </a>
          </div>
        </section>

        {/* Four numbers, two of them the ones people actually ask about.
            A table because these really are parallel values. */}
        <section className="dm-prices">
          <div className="container">
            <div className="dm-head">
              <h2>{t.h2}</h2>
              <p>
                {t.p}
              </p>
            </div>

            <table className="dm-table">
              <caption className="dm-sr">
                {t.sr}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{t.th}</th>
                  <th scope="col">{t.th2}</th>
                  <th scope="col">{t.th3}</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((p) => (
                  <tr key={p.ext}>
                    <th scope="row">
                      <span className="dm-ltr">{p.ext}</span>
                    </th>
                    <td>
                      <span className="dm-ltr">₪{he(p.buy)}</span>
                    </td>
                    <td>
                      <span className="dm-ltr">₪{he(p.renew)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="dm-foot">
              {t.foot}
            </p>
          </div>
        </section>

        <section className="dm-why">
          <div className="container">
            <div className="dm-why-split">
              <div className="dm-head">
                <h2>{t.h22}</h2>
              </div>
              <ul className="dm-why-list">
                {t.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Collapsed panels are 0fr and invisible, so they leave the tab
            order instead of merely going out of sight. */}
        <section className="dm-faq">
          <div className="container">
            <div className="dm-head">
              <h2>{t.h23}</h2>
            </div>

            <div className="dm-qs">
              {t.faqs.map((f) => {
                const isOpen = openId === f.id
                return (
                  <div className="dm-q" key={f.id} data-open={isOpen}>
                    <h3 className="dm-q-h">
                      <button
                        type="button"
                        className="dm-q-btn"
                        id={`dm-q-${f.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`dm-a-${f.id}`}
                        onClick={() => setOpenId(isOpen ? null : f.id)}
                      >
                        <span>{f.q}</span>
                        <span className="dm-q-sign" aria-hidden="true">
                          <PlusIcon />
                        </span>
                      </button>
                    </h3>
                    <div
                      className="dm-a"
                      id={`dm-a-${f.id}`}
                      role="region"
                      aria-labelledby={`dm-q-${f.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="dm-a-in">
                        {f.a.map((para) => (
                          <p key={para}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="dm-faq-foot">
              {t.faqFoot}{" "}
              <LocalizedLink to="/contact/" className="dm-inline-link">
                {t.inlineLink}
              </LocalizedLink>
              .
            </p>
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default DomainPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = TEXT[pageContext.locale]
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/domain/"
    />
  )
}
