import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { TERMS } from "../data/terms"
import { SUPPORT_PHONE } from "../data/support-hours"
import "../styles/legal.css"
import type { PageContext } from "../locales/config"
import { useT } from "../locales/LocaleContext"
import { getT } from "../locales/messages"

/* ── /terms/ ────────────────────────────────────────────────────
   The agreement, rendered from src/data/terms.ts, which holds the
   live page's own wording. This file owns only the reading
   experience: one measured column and a sticky index, because a
   sixteen-section agreement is navigated to a clause far more often
   than it is read front to back.

   Nothing here paraphrases, shortens or reorders the text. */

const AFFILIATE_EMAIL = "sales@comstar.co.il"

const TermsPage: React.FC = () => {
  const t = useT("pages/terms")
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
              {t.heroMeta}{" "}
              <span className="lg-ltr">514979525</span>{t.heroMeta2}
            </p>
          </div>
        </section>

        <section className="lg-doc">
          <div className="container">
            <div className="lg-grid">
              <nav
                className="lg-toc"
                aria-label={t.ariaLabel}
                data-scroll={TERMS.length > 8}
                data-count="true"
              >
                <h2>{t.h2}</h2>
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
              <h2>{t.h22}</h2>
              <p>
                {t.p}
              </p>
              <ul className="lg-contact-rows">
                <li>
                  <a href={`tel:${SUPPORT_PHONE.replace(/-/g, "")}`}>
                    <span className="lg-contact-t">{t.contactT}</span>
                    <span className="lg-contact-v lg-ltr">{SUPPORT_PHONE}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${AFFILIATE_EMAIL}`}>
                    <span className="lg-contact-t">{t.contactT2}</span>
                    <span className="lg-contact-v lg-ltr">{AFFILIATE_EMAIL}</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://api.whatsapp.com/send?phone=972559377588"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="lg-contact-t">{t.contactT3}</span>
                    <span className="lg-contact-v lg-ltr">055-9377588</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://sendmsg.co.il/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="lg-contact-t">{t.contactT4}</span>
                    <span className="lg-contact-v">{t.contactV}</span>
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

export default TermsPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = getT(pageContext.locale, "pages/terms")
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/terms/"
    />
  )
}
