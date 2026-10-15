import React, { useState } from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/sms.css"
import type { PageContext } from "../locales/config"
import { useText } from "../locales/LocaleContext"
import Rich from "../locales/Rich"
import LocalizedLink from "../locales/LocalizedLink"
import heText from "../locales/he/pages/sms.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

/* Copy is the live SMS page's own. Where it names the virtual number
   or the message banks, this page links to ours instead of to the
   live site. */

const BUY_NUMBER_URL =
  "https://panel.sendmsg.co.il/PurchaseSms.aspx?cat=113#selectedPackege"

/* capabilities: moved to src/locales/he/pages/sms.json as "capabilities". */
/* faqs: moved to src/locales/he/pages/sms.json as "faqs". */
const PlusIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path className="sm-plus-v" d="M12 4v16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const SmsPage: React.FC = () => {
  const t = useText(TEXT)
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Layout>
      <div className="sm">
        <section className="sm-hero">
          <div className="container">
            <h1>{t.h1}</h1>
            <p className="sm-hero-sub">
              {t.heroSub}
            </p>
            <p className="sm-hero-note">
              {t.heroNote}
            </p>
            <a href={PANEL_URL} className="sm-btn sm-btn-accent" onClick={openSignup}>
              {t.btn}
            </a>
          </div>
        </section>

        {/* Two paragraphs that argue one point, so they run as text
            rather than sitting in boxes pretending to be separate. */}
        <section className="sm-why">
          <div className="container">
            <div className="sm-why-split">
              <h2>{t.h2}</h2>
              <div className="sm-why-body">
                <p>
                  {t.p}
                </p>
                <p>
                  {t.p2}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="sm-caps">
          <div className="container">
            <div className="sm-head">
              <h2>
                {t.h22}
              </h2>
            </div>
            <ul className="sm-cap-list">
              {t.capabilities.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* The virtual number is a product of its own, so the block
            states its price and hands off to its page rather than
            repeating that page here. */}
        <section className="sm-vn">
          <div className="container">
            <div className="sm-vn-split">
              <div className="sm-vn-text">
                <h2>{t.h23}</h2>
                <p>
                  <Rich text={t.p3} ltrClass="sm-ltr" />
                </p>
                <p>
                  {t.p5}
                </p>
                <p>
                  {t.p6}
                </p>
              </div>

              <div className="sm-vn-offer">
                <p className="sm-vn-label">{t.vnLabel}</p>
                <p className="sm-vn-price">
                  <span className="sm-vn-cur" aria-hidden="true">₪</span>
                  <span className="sm-vn-num">118</span>
                  <span className="sm-sr">{t.sr}</span>
                </p>
                <p className="sm-vn-terms">{t.vnTerms}</p>
                <a href={BUY_NUMBER_URL} className="sm-btn sm-btn-accent">
                  {t.btn2}
                </a>
                <LocalizedLink to="/virtual-number/" className="sm-vn-alt">
                  {t.vnAlt}
                </LocalizedLink>
              </div>
            </div>
          </div>
        </section>

        {/* Messages are bought as banks, so the price link goes to the
            bank calculator rather than to the subscription price list. */}
        <section className="sm-prices">
          <div className="container">
            <div className="sm-prices-row">
              <div>
                <h2>{t.h24}</h2>
                <p>
                  {t.p7}
                </p>
              </div>
              <LocalizedLink to="/sms-bank/" className="sm-btn sm-btn-light">
                {t.btn3}
              </LocalizedLink>
            </div>
          </div>
        </section>

        {/* Collapsed panels are 0fr and invisible, so they leave the tab
            order instead of merely going out of sight. */}
        <section className="sm-faq">
          <div className="container">
            <div className="sm-head">
              <h2>{t.h25}</h2>
            </div>

            <div className="sm-qs">
              {t.faqs.map((f) => {
                const isOpen = openId === f.id
                return (
                  <div className="sm-q" key={f.id} data-open={isOpen}>
                    <h3 className="sm-q-h">
                      <button
                        type="button"
                        className="sm-q-btn"
                        id={`sm-q-${f.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`sm-a-${f.id}`}
                        onClick={() => setOpenId(isOpen ? null : f.id)}
                      >
                        <span>{f.q}</span>
                        <span className="sm-q-sign" aria-hidden="true">
                          <PlusIcon />
                        </span>
                      </button>
                    </h3>
                    <div
                      className="sm-a"
                      id={`sm-a-${f.id}`}
                      role="region"
                      aria-labelledby={`sm-q-${f.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="sm-a-in">
                        {f.a.map((para) => (
                          <p key={para}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default SmsPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = TEXT[pageContext.locale]
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/sms/"
    />
  )
}
