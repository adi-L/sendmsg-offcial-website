import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/crm.css"
import type { PageContext } from "../locales/config"
import { useT } from "../locales/LocaleContext"
import { getT } from "../locales/messages"
import LocalizedLink from "../locales/LocalizedLink"

/* capabilities: moved to src/locales/he/pages/crm.json as "capabilities". */
/* alsoIncluded: moved to src/locales/he/pages/crm.json as "alsoIncluded". */
const ArrowIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path d="M14 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CrmPage: React.FC = () => {
  const t = useT("pages/crm")
  return (
    <Layout>
      <div className="crm">
        <section className="crm-hero">
          <div className="container">
            <h1>{t.h1}</h1>
            <p className="crm-hero-sub">
              {t.heroSub}
            </p>
            <p className="crm-hero-note">
              {t.heroNote}
            </p>
            <a href={PANEL_URL} className="crm-btn crm-btn-accent" onClick={openSignup}>
              {t.btn}
            </a>
          </div>
        </section>

        {/* The page's own admission, set as type. It is the most useful
            sentence here precisely because it is not a boast, so it gets
            the size and the quiet around it rather than a frame. */}
        <section className="crm-claim">
          <div className="container">
            <div className="crm-claim-in">
              <p className="crm-claim-lead">
                {t.claimLead}{" "}
                <span className="crm-ltr">SalesForce</span>.
              </p>
              <p className="crm-claim-body">
                {t.claimBody}
              </p>
            </div>
          </div>
        </section>

        <section className="crm-caps">
          <div className="container">
            <div className="crm-caps-split">
              <div className="crm-head">
                <h2>{t.h2}</h2>
              </div>
              <ul className="crm-cap-list">
                {t.capabilities.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="crm-also">
          <div className="container">
            <div className="crm-head">
              <h2>{t.h22}</h2>
              <p>
                {t.p}
              </p>
            </div>
            <ul className="crm-also-list">
              {t.alsoIncluded.map((a) => (
                <li key={a.t}>
                  <LocalizedLink to={a.to}>
                    <span className="crm-also-t">{a.t}</span>
                    <span className="crm-also-hook">{a.hook}</span>
                    <span className="crm-also-go" aria-hidden="true">
                      <ArrowIcon />
                    </span>
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="crm-plans">
          <div className="container">
            <div className="crm-plans-row">
              <div>
                <h2>{t.h23}</h2>
                <p>
                  {t.p2}
                  <span className="crm-ltr">₪40</span>{t.p3}{" "}
                  <span className="crm-ltr">₪36</span>{t.p4}
                </p>
              </div>
              <LocalizedLink to="/pricing/" className="crm-btn crm-btn-light">
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

export default CrmPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = getT(pageContext.locale, "pages/crm")
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/crm/"
    />
  )
}
