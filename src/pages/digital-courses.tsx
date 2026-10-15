import React, { useState } from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/digital-courses.css"
import type { PageContext } from "../locales/config"
import { useT } from "../locales/LocaleContext"
import { getT } from "../locales/messages"
import LocalizedLink from "../locales/LocalizedLink"

/* capabilities: moved to src/locales/he/pages/digital-courses.json as "capabilities". */
/* steps: moved to src/locales/he/pages/digital-courses.json as "steps". */
/* noLimits: moved to src/locales/he/pages/digital-courses.json as "noLimits". */
/* faqs: moved to src/locales/he/pages/digital-courses.json as "faqs". */
const PlusIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path className="dc-plus-v" d="M12 4v16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const ArrowIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path d="M14 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const DigitalCoursesPage: React.FC = () => {
  const t = useT("pages/digital-courses")
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Layout>
      <div className="dc">
        <section className="dc-hero">
          <div className="container">
            <h1>{t.h1}</h1>
            <p className="dc-hero-sub">{t.heroSub}</p>
            <p className="dc-hero-note">
              {t.heroNote}
            </p>
            <a href={PANEL_URL} className="dc-btn dc-btn-accent" onClick={openSignup}>
              {t.btn}
            </a>
          </div>
        </section>

        {/* Six capabilities, term then sentence. Two columns because
            they are six of the same kind of thing, not two opposed ones. */}
        <section className="dc-caps">
          <div className="container">
            <div className="dc-head">
              <h2>{t.h2}</h2>
            </div>
            <dl className="dc-cap-list">
              {t.capabilities.map((c) => (
                <div key={c.t} className="dc-cap">
                  <dt>{c.t}</dt>
                  <dd>{c.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Numbered because this really is an order of operations: you
            cannot build the course before the account exists. */}
        <section className="dc-flow">
          <div className="container">
            <div className="dc-head">
              <h2>{t.h22}</h2>
            </div>
            <ol className="dc-flow-list">
              {t.steps.map((s, i) => (
                <li key={s.t}>
                  <span className="dc-flow-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="dc-flow-body">
                    <span className="dc-flow-t">{s.t}</span>
                    <span className="dc-flow-d">{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Two genuinely parallel lists, so they face each other: what
            the free course already is, and what paying adds to it. */}
        <section className="dc-plans">
          <div className="container">
            <div className="dc-head">
              <h2>{t.h23}</h2>
              <p>{t.p}</p>
            </div>

            <ul className="dc-nolimits">
              {t.noLimits.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>

            <div className="dc-compare">
              <div className="dc-col">
                <h3>{t.h3}</h3>
                <ul>
                  {t.freeIncludes.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="dc-col dc-col-pro">
                <h3>{t.h32}</h3>
                <ul>
                  {t.premiumAdds.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="dc-col-note">
                  {t.colNote}<span className="dc-ltr">₪40</span>{t.colNote2}{" "}
                  <span className="dc-ltr">251–500</span>{t.colNote3}
                  <span className="dc-ltr">₪79</span>{t.colNote4}{" "}
                  <span className="dc-ltr">₪71</span>{t.colNote5}
                </p>
                <LocalizedLink to="/pricing/" className="dc-col-link">
                  {t.colLink}
                </LocalizedLink>
              </div>
            </div>
          </div>
        </section>

        <section className="dc-who">
          <div className="container">
            <div className="dc-head">
              <h2>{t.h24}</h2>
              <p>
                {t.p2}
              </p>
            </div>
            <dl className="dc-who-list">
              {t.audiences.map((a) => (
                <div key={a.t} className="dc-who-row">
                  <dt>{a.t}</dt>
                  <dd>{a.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="dc-also">
          <div className="container">
            <div className="dc-head">
              <h2>{t.h25}</h2>
              <p>
                {t.p3}
              </p>
            </div>
            <ul className="dc-also-list">
              {t.alsoIncluded.map((a) => (
                <li key={a.t}>
                  {a.to ? (
                    <LocalizedLink to={a.to}>
                      <span className="dc-also-t">{a.t}</span>
                      <span className="dc-also-hook">{a.hook}</span>
                      <span className="dc-also-go" aria-hidden="true">
                        <ArrowIcon />
                      </span>
                    </LocalizedLink>
                  ) : (
                    <div>
                      <span className="dc-also-t">{a.t}</span>
                      <span className="dc-also-hook">{a.hook}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Collapsed panels are 0fr and invisible, so they leave the tab
            order instead of merely going out of sight. */}
        <section className="dc-faq">
          <div className="container">
            <div className="dc-head">
              <h2>{t.h26}</h2>
            </div>

            <div className="dc-qs">
              {t.faqs.map((f) => {
                const isOpen = openId === f.id
                return (
                  <div className="dc-q" key={f.id} data-open={isOpen}>
                    <h3 className="dc-q-h">
                      <button
                        type="button"
                        className="dc-q-btn"
                        id={`dc-q-${f.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`dc-a-${f.id}`}
                        onClick={() => setOpenId(isOpen ? null : f.id)}
                      >
                        <span>{f.q}</span>
                        <span className="dc-q-sign" aria-hidden="true">
                          <PlusIcon />
                        </span>
                      </button>
                    </h3>
                    <div
                      className="dc-a"
                      id={`dc-a-${f.id}`}
                      role="region"
                      aria-labelledby={`dc-q-${f.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="dc-a-in">
                        {f.a.map((para) => (
                          <p key={para}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="dc-faq-foot">
              {t.faqFoot}{" "}
              <LocalizedLink to="/contact/" className="dc-inline-link">
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

export default DigitalCoursesPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = getT(pageContext.locale, "pages/digital-courses")
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/digital-courses/"
    />
  )
}
