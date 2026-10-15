import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { PRIVACY, PrivacyBlock } from "../data/privacy"
import "../styles/legal.css"
import type { PageContext } from "../locales/config"
import { useText } from "../locales/LocaleContext"
import Rich from "../locales/Rich"
import LocalizedLink from "../locales/LocalizedLink"
import heText from "../locales/he/pages/privacy.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

/* ── /privacy/ ──────────────────────────────────────────────────
   The policy, rendered from src/data/privacy.ts, which holds the
   live page's own wording. Same reading surface as /terms/ and
   /accessibility/.

   Three of the live page's nine sections are missing, deliberately:
   on sendmsg.co.il they carry text copied out of the תקנון and do
   not match their own headings, so they are not the privacy policy.
   See the note at the top of src/data/privacy.ts. The published
   numbering is kept so the "9.1."-style references inside the text
   stay correct. */

const PRIVACY_EMAIL = "privacy@comstar.co.il"
const DPO_EMAIL = "adv.shalom@gmail.com"

/* Consecutive clause items are one list, not one list each. */
function group(blocks: PrivacyBlock[]) {
  const out: (PrivacyBlock | { kind: "list"; items: string[] })[] = []
  for (const b of blocks) {
    if (b.kind === "li") {
      const last = out[out.length - 1]
      if (last && last.kind === "list") last.items.push(b.text)
      else out.push({ kind: "list", items: [b.text] })
    } else {
      out.push(b)
    }
  }
  return out
}

const PrivacyPage: React.FC = () => {
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
              <Rich text={t.heroMeta} />
            </p>
          </div>
        </section>

        <section className="lg-doc">
          <div className="container">
            <div className="lg-grid">
              <nav
                className="lg-toc"
                aria-label={t.ariaLabel}
                data-scroll={PRIVACY.length > 8}
              >
                <h2>{t.h2}</h2>
                <ol>
                  {PRIVACY.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`}>{s.heading}</a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div>
                {PRIVACY.map((s) => (
                  <section className="lg-sec" id={s.id} key={s.id}>
                    <h2>{s.heading}</h2>
                    {group(s.blocks).map((b, i) => {
                      if (b.kind === "dl") {
                        return (
                          <dl className="lg-dl" key={i}>
                            {b.items.map((it) => (
                              <div key={it.t}>
                                <dt>{it.t}</dt>
                                <dd>{it.d}</dd>
                              </div>
                            ))}
                          </dl>
                        )
                      }
                      if (b.kind === "list") {
                        return (
                          <ul className="lg-list" key={i}>
                            {b.items.map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                        )
                      }
                      return <p key={i}>{b.text}</p>
                    })}
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
                  <a href={`mailto:${PRIVACY_EMAIL}`}>
                    <span className="lg-contact-t">{t.contactT}</span>
                    <span className="lg-contact-v lg-ltr">{PRIVACY_EMAIL}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${DPO_EMAIL}`}>
                    <span className="lg-contact-t">{t.contactT2}</span>
                    <span className="lg-contact-v lg-ltr">{DPO_EMAIL}</span>
                  </a>
                </li>
              </ul>
              <p><Rich text={t.p2} /></p>
            </div>
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default PrivacyPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = TEXT[pageContext.locale]
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/privacy/"
    />
  )
}
