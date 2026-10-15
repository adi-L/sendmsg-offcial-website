import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/meetings.css"
import type { PageContext } from "../locales/config"
import { useT } from "../locales/LocaleContext"
import { getT } from "../locales/messages"
import LocalizedLink from "../locales/LocalizedLink"

/* steps: moved to src/locales/he/pages/meetings.json as "steps". */
/* uses: moved to src/locales/he/pages/meetings.json as "uses". */
const MeetingsPage: React.FC = () => {
  const t = useT("pages/meetings")
  return (
    <Layout>
      <div className="mt">
        <section className="mt-hero">
          <div className="container">
            <h1>{t.h1}</h1>
            <p className="mt-hero-sub">
              {t.heroSub}
            </p>
            <p className="mt-hero-note">
              {t.heroNote}
            </p>
            <a href={PANEL_URL} className="mt-btn mt-btn-accent" onClick={openSignup}>
              {t.btn}
            </a>
          </div>
        </section>

        {/* Numbered because it is an order of operations, and closed by
            the line that is the actual offer: the work you do not do. */}
        <section className="mt-flow">
          <div className="container">
            <div className="mt-head">
              <h2>{t.h2}</h2>
            </div>

            <ol className="mt-flow-list">
              {t.steps.map((s, i) => (
                <li key={s.t}>
                  <span className="mt-flow-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="mt-flow-body">
                    <span className="mt-flow-t">{s.t}</span>
                    <span className="mt-flow-d">{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-claim">
              {t.claim}
            </p>
          </div>
        </section>

        <section className="mt-uses">
          <div className="container">
            <div className="mt-uses-split">
              <div className="mt-head">
                <h2>{t.h22}</h2>
              </div>
              <ul className="mt-use-list">
                {t.uses.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Whose technology this is, and what you have to agree to before
            it can match you. Both belong on the page, quietly. */}
        <section className="mt-partner">
          <div className="container">
            <div className="mt-partner-in">
              <h2>{t.h23}</h2>
              <p>
                {t.p}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-plans">
          <div className="container">
            <div className="mt-plans-row">
              <div>
                <h2>{t.h24}</h2>
                <p>
                  {t.p2}
                  <span className="mt-ltr">₪40</span>{t.p3}{" "}
                  <span className="mt-ltr">₪36</span>{t.p4}
                </p>
              </div>
              <LocalizedLink to="/pricing/" className="mt-btn mt-btn-light">
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

export default MeetingsPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = getT(pageContext.locale, "pages/meetings")
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/meetings/"
    />
  )
}
