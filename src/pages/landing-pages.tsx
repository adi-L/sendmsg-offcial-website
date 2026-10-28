import React, { useState } from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import tplWorkshop from "../images/templates/template-workshop.webp"
import tplProgram from "../images/templates/template-program.webp"
import tplTherapy from "../images/templates/template-therapy.webp"
import tplTech from "../images/templates/template-tech.webp"
import "../styles/landing-pages.css"
import type { PageContext } from "../locales/config"
import { useText } from "../locales/LocaleContext"
import Rich from "../locales/Rich"
import LocalizedLink from "../locales/LocalizedLink"
import { faqPage } from "../utils/structured-data"
import heText from "../locales/he/pages/landing-pages.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }
type PageText = typeof heText

/* canDo: moved to src/locales/he/pages/landing-pages.json as "canDo". */
/* Four of the live gallery's templates, pulled from the live page.
   Each image is the whole page, 2560px tall, so the preview shows the
   top and travels down on hover: the length is the point. */
const templates = (t: PageText) => [
  { src: tplWorkshop, alt: t.templates[0].alt, t: t.templates[0].t },
  { src: tplProgram, alt: t.templates[1].alt, t: t.templates[1].t },
  { src: tplTherapy, alt: t.templates[2].alt, t: t.templates[2].t },
  { src: tplTech, alt: t.templates[3].alt, t: t.templates[3].t },
]

/* alsoIncluded: moved to src/locales/he/pages/landing-pages.json as "alsoIncluded". */
/* faqs: moved to src/locales/he/pages/landing-pages.json as "faqs". */
const PlusIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path className="lp-plus-v" d="M12 4v16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const ArrowIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path d="M14 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const LandingPagesPage: React.FC = () => {
  const t = useText(TEXT)
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Layout>
      <div className="lp">
        <section className="lp-hero">
          <div className="container">
            <h1>{t.h1}</h1>
            <p className="lp-hero-sub">
              {t.heroSub}
            </p>
            <p className="lp-hero-note">{t.heroNote}</p>
            <a href={PANEL_URL} className="lp-btn lp-btn-accent" onClick={openSignup}>
              {t.btn}
            </a>
          </div>
        </section>

        {/* What the page is for and how it is done, in prose: the old
            page carried this text and ranked with it for "בניית דף נחיתה"
            and "דף נחיתה בחינם". The steps are numbered because they are
            a sequence, which nothing else on the page is. */}
        <section className="lp-intro">
          <div className="container">
            <div className="lp-head">
              <h2>{t.introH}</h2>
              {t.introP.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <h3 className="lp-steps-h">{t.stepsH}</h3>
            <ol className="lp-steps">
              {t.steps.map((s, i) => (
                <li key={s.t}>
                  <span className="lp-step-n" aria-hidden="true">{i + 1}</span>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* A heading that stays beside the list it names, and nine plain
            rows. No ticks: nine identical checkmarks would say nothing
            the heading has not already said. */}
        <section className="lp-can">
          <div className="container">
            <div className="lp-can-split">
              <div className="lp-head">
                <h2>{t.h2}</h2>
              </div>
              <ul className="lp-can-list">
                {t.canDo.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* The templates are whole pages, so the preview behaves like
            one: it opens at the top and travels down when you point at
            it. The length is the argument. */}
        <section className="lp-templates">
          <div className="container">
            <div className="lp-head">
              <h2>{t.h22}</h2>
              <p>
                {t.p}
              </p>
            </div>

            <ul className="lp-tpl-grid">
              {templates(t).map((t) => (
                <li key={t.t} className="lp-tpl">
                  <div className="lp-tpl-frame">
                    <img src={t.src} alt={t.alt} loading="lazy" />
                  </div>
                  <p className="lp-tpl-name">{t.t}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="lp-also">
          <div className="container">
            <div className="lp-head">
              <h2>{t.h23}</h2>
              <p>
                {t.p2}
              </p>
            </div>

            <ul className="lp-also-list">
              {t.alsoIncluded.map((a) => (
                <li key={a.t}>
                  {a.to ? (
                    <LocalizedLink to={a.to}>
                      <span className="lp-also-t">{a.t}</span>
                      <span className="lp-also-hook">{a.hook}</span>
                      <span className="lp-also-go" aria-hidden="true">
                        <ArrowIcon />
                      </span>
                    </LocalizedLink>
                  ) : (
                    <div>
                      <span className="lp-also-t">{a.t}</span>
                      <span className="lp-also-hook">{a.hook}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Collapsed panels are 0fr and invisible, so they leave the tab
            order instead of merely going out of sight. */}
        <section className="lp-faq">
          <div className="container">
            <div className="lp-head">
              <h2>{t.h24}</h2>
            </div>

            <div className="lp-qs">
              {t.faqs.map((f) => {
                const isOpen = openId === f.id
                return (
                  <div className="lp-q" key={f.id} data-open={isOpen}>
                    <h3 className="lp-q-h">
                      <button
                        type="button"
                        className="lp-q-btn"
                        id={`lp-q-${f.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`lp-a-${f.id}`}
                        onClick={() => setOpenId(isOpen ? null : f.id)}
                      >
                        <span>{f.q}</span>
                        <span className="lp-q-sign" aria-hidden="true">
                          <PlusIcon />
                        </span>
                      </button>
                    </h3>
                    <div
                      className="lp-a"
                      id={`lp-a-${f.id}`}
                      role="region"
                      aria-labelledby={`lp-q-${f.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="lp-a-in">
                        <p>{f.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="lp-plans">
          <div className="container">
            <div className="lp-plans-row">
              <div>
                <h2>{t.h25}</h2>
                <p>
                  <Rich text={t.p3} ltrClass="lp-ltr" />
                </p>
              </div>
              <LocalizedLink to="/pricing/" className="lp-btn lp-btn-light">
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

export default LandingPagesPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = TEXT[pageContext.locale]
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/landing-pages/"
      schema={[faqPage(t.faqs)]}
    />
  )
}
