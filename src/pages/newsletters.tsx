import React, { useState } from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/newsletters.css"
import type { PageContext } from "../locales/config"
import { useT } from "../locales/LocaleContext"
import { getT } from "../locales/messages"
import LocalizedLink from "../locales/LocalizedLink"

/* offers: moved to src/locales/he/pages/newsletters.json as "offers". */
/* bonuses: moved to src/locales/he/pages/newsletters.json as "bonuses". */
/* faqs: moved to src/locales/he/pages/newsletters.json as "faqs". */
const PlusIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path className="nl-plus-v" d="M12 4v16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const NewslettersPage: React.FC = () => {
  const t = useT("pages/newsletters")
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Layout>
      <div className="nl">
        <section className="nl-hero">
          <div className="container">
            <h1>{t.h1}</h1>
            <p className="nl-hero-sub">
              {t.heroSub}
            </p>
            <p className="nl-hero-note">
              {t.heroNote}
            </p>
            <a href={PANEL_URL} className="nl-btn nl-btn-accent" onClick={openSignup}>
              {t.btn}
            </a>
          </div>
        </section>

        {/* The claim gets the width, the AI line gets a surface: it is the
            one sentence on the page that is a promise about time. */}
        <section className="nl-editor">
          <div className="container">
            <div className="nl-editor-split">
              <div className="nl-editor-text">
                <h2>{t.h2}</h2>
                <p>
                  {t.p}{" "}
                  <span className="nl-ltr">Creaditor 3.0</span>{t.p2}
                </p>
              </div>
              <p className="nl-pull">{t.pull}</p>
            </div>
          </div>
        </section>

        {/* Two paragraphs that argue one point, so they sit as one column
            of running text under a rule rather than in boxes. */}
        <section className="nl-keep">
          <div className="container">
            <div className="nl-keep-split">
              <h2>{t.h22}</h2>
              <div className="nl-keep-body">
                <p>
                  {t.p3}
                </p>
                <p>
                  {t.p4}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="nl-offers">
          <div className="container">
            <div className="nl-head">
              <h2>{t.h23}</h2>
            </div>
            <ul className="nl-offer-list">
              {t.offers.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Each bonus leads with what it costs you, because that is the
            part the paragraph buries at its end. */}
        <section className="nl-bonus">
          <div className="container">
            <div className="nl-head">
              <h2>{t.h24}</h2>
              <p>
                {t.p5}{" "}
                <a href={PANEL_URL} className="nl-inline-link">
                  {t.inlineLink}
                </a>
                .
              </p>
            </div>

            <dl className="nl-bonus-list">
              {t.bonuses.map((b) => (
                <div key={b.t} className="nl-bonus-row">
                  <dt>
                    <span className="nl-bonus-t">{b.t}</span>
                    <span className="nl-bonus-hook">{b.hook}</span>
                  </dt>
                  <dd>{b.d}</dd>
                </div>
              ))}
            </dl>

            <p className="nl-bonus-foot">
              {t.bonusFoot}
            </p>
          </div>
        </section>

        {/* Collapsed panels are 0fr and invisible, so they leave the tab
            order instead of merely going out of sight. */}
        <section className="nl-faq">
          <div className="container">
            <div className="nl-head">
              <h2>{t.h25}</h2>
            </div>

            <div className="nl-qs">
              {t.faqs.map((f) => {
                const isOpen = openId === f.id
                return (
                  <div className="nl-q" key={f.id} data-open={isOpen}>
                    <h3 className="nl-q-h">
                      <button
                        type="button"
                        className="nl-q-btn"
                        id={`nl-q-${f.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`nl-a-${f.id}`}
                        onClick={() => setOpenId(isOpen ? null : f.id)}
                      >
                        <span>{f.q}</span>
                        <span className="nl-q-sign" aria-hidden="true">
                          <PlusIcon />
                        </span>
                      </button>
                    </h3>
                    <div
                      className="nl-a"
                      id={`nl-a-${f.id}`}
                      role="region"
                      aria-labelledby={`nl-q-${f.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="nl-a-in">
                        <p>{f.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="nl-plans">
          <div className="container">
            <div className="nl-plans-row">
              <div>
                <h2>{t.h26}</h2>
                <p>
                  {t.p6}<span className="nl-ltr">₪40</span>{t.p7}{" "}
                  <span className="nl-ltr">₪36</span>{t.p8}
                </p>
              </div>
              <LocalizedLink to="/pricing/" className="nl-btn nl-btn-light">
                {t.btn2}
              </LocalizedLink>
            </div>
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default NewslettersPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = getT(pageContext.locale, "pages/newsletters")
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/newsletters/"
    />
  )
}
