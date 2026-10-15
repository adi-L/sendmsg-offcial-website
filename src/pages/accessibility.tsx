import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import "../styles/legal.css"
import type { PageContext } from "../locales/config"
import { useText } from "../locales/LocaleContext"
import Rich from "../locales/Rich"
import { formatText } from "../locales/config"
import heText from "../locales/he/pages/accessibility.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

/* ── /accessibility/ ────────────────────────────────────────────
   הצהרת נגישות, following the live sendmsg.co.il/accessibility/
   statement.

   ONE DELIBERATE DEPARTURE FROM THE LIVE TEXT, which needs a human
   decision before this ships:

   The live statement says the site is made accessible "על ידי
   פלטפורמת ווררפרס" and that WordPress may inject inaccessible
   third-party iframes. This site is not WordPress — it is a static
   Gatsby build — so repeating that sentence would make the legal
   declaration factually false about the site carrying it. The
   platform sentences below describe this site instead. Everything
   else (the standard, the conformance level, the tested assistive
   technologies, the limitation of liability, the contact details)
   is the company's own declaration and is left as published.

   The declared conformance level is the company's to make, not the
   site's to assume. What has been done about it, 2026-10-08: the
   machine-checkable parts of WCAG 2 AA now pass across all 157 pages
   (scripts/check-a11y.py, run against a clean --prefix-paths build).
   Getting there fixed real level-A failures that this build had while
   the page already declared AA: no skip link on any page, a heading
   level skipped on 149 pages, four links whose only content was an
   unlabelled image, and four text colours under 4.5:1.

   That is not the whole standard. Keyboard order and focus traps,
   focus visibility in practice, whether alt text is meaningful, and
   reflow at 320px still need a person. The sentence below about
   testing with NVDA, JAWS and VoiceOver is the company's published
   claim and was carried over as-is; it has not been re-verified
   against this build. */

/* Set from the last run of scripts/check-a11y.py against a release build,
   together with lastCheckDate in src/locales/he/pages/accessibility.json. */
const PAGE_COUNT = 157

const ACCESS_EMAIL = "negishut@comstar.co.il"
const ACCESS_PHONE = "077-4600600"

/* TESTED: moved to src/locales/he/pages/accessibility.json as "tested". */
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
    <path
      d="M4 12.5 9.5 18 20 6.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const AccessibilityPage: React.FC = () => {
  const t = useText(TEXT)
  return (
    <Layout>
      <div className="lg">
        <section className="lg-hero">
          <div className="container">
            <h1>{t.h1}</h1>
            <p className="lg-hero-sub">
              {t.heroSub}
            </p>
            <p className="lg-hero-meta">
              {t.heroMeta}
            </p>
          </div>
        </section>

        <section className="lg-doc">
          <div className="container">
            <div className="lg-grid">
              <nav className="lg-toc" aria-label={t.ariaLabel} data-count="true">
                <h2>{t.h2}</h2>
                <ol>
                  {t.sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`}>{s.heading}</a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div>
                <section className="lg-sec" id="a1">
                  <h2>{t.h22}</h2>
                  <p>
                    <Rich text={t.p} ltrClass="lg-ltr" />
                  </p>
                  <p>
                    <Rich text={t.p5} ltrClass="lg-ltr" />
                  </p>
                </section>

                <section className="lg-sec" id="a2">
                  <h2>{t.h23}</h2>
                  <ul className="lg-checks">
                    {t.tested.map((t) => (
                      <li key={t}>
                        <span className="lg-check" aria-hidden="true">
                          <CheckIcon />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* 5568 statements are expected to say when the site was last
                    reviewed. This section records the automated pass that runs
                    from scripts/check-a11y.py, and is explicit that it does not
                    cover the parts only a person can judge -- so the date here
                    is never mistaken for a full manual audit. Update lastCheckDate
                    whenever that script is run against a release. */}
                <section className="lg-sec" id="a3">
                  <h2>{t.h24}</h2>
                  <p>
                    {formatText(t.lastCheck, { date: t.lastCheckDate, pages: PAGE_COUNT })}
                  </p>
                  <p>
                    {t.p10}
                  </p>
                </section>

                <section className="lg-sec" id="a4">
                  <h2>{t.h25}</h2>
                  <p>
                    <Rich text={t.p11} ltrClass="lg-ltr" />
                  </p>
                </section>

                <section className="lg-sec" id="a5">
                  <h2>{t.h26}</h2>
                  <p>
                    {t.p14}
                  </p>
                  <p>
                    {t.p15}
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>

        <section className="lg-contact">
          <div className="container">
            <div className="lg-contact-in">
              <h2>{t.h27}</h2>
              <p>
                {t.p16}
              </p>
              <ul className="lg-contact-rows">
                <li>
                  <a href={`tel:${ACCESS_PHONE.replace(/-/g, "")}`}>
                    <span className="lg-contact-t">{t.contactT}</span>
                    <span className="lg-contact-v lg-ltr">{ACCESS_PHONE}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${ACCESS_EMAIL}`}>
                    <span className="lg-contact-t">{t.contactT2}</span>
                    <span className="lg-contact-v lg-ltr">{ACCESS_EMAIL}</span>
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
}

export default AccessibilityPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = TEXT[pageContext.locale]
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/accessibility/"
    />
  )
}
