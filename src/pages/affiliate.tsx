import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import { TIERS } from "../components/Pricing"
import "../styles/affiliate.css"
import type { PageContext } from "../locales/config"
import { useT } from "../locales/LocaleContext"
import { getT } from "../locales/messages"
import LocalizedLink from "../locales/LocalizedLink"
import Fmt from "../locales/Fmt"

/* Copy is the live /affiliate/ page's own.

   The one exception is the worked example. The live page quotes a
   commission of 695.4 ש״ח for its scenario, which does not follow
   from the price list this site publishes. The scenario is kept and
   the arithmetic is recomputed from TIERS, so the example and
   /pricing/ can never disagree. */
const RATE = 0.2
const PAYOUT_MIN = 400

const tierFor = (contacts: number) =>
  TIERS.find((t) => t.contacts >= contacts) ?? TIERS[TIERS.length - 1]

/* The live page's own scenario: two referrals who signed for a year */
const example = [4800, 700].map((contacts) => {
  const tier = tierFor(contacts)
  return { contacts, tier, annual: tier.year * 12 }
})

const exampleTotal = example.reduce((sum, r) => sum + r.annual, 0)
const exampleCommission = exampleTotal * RATE

const he = (n: number) => n.toLocaleString("he-IL")
const shekels = (n: number) =>
  n.toLocaleString("he-IL", {
    minimumFractionDigits: n % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })

/* earns: moved to src/locales/he/pages/affiliate.json as "earns". */
const AffiliatePage: React.FC = () => {
  const t = useT("pages/affiliate")
  return (
    <Layout>
      <div className="af">
        <section className="af-hero">
          <div className="container">
            <h1>{t.h1}</h1>
            <p className="af-hero-sub">
              {t.heroSub}
            </p>
            <p className="af-hero-note">
              {t.heroNote}
            </p>
            <a href={PANEL_URL} className="af-btn af-btn-accent" onClick={openSignup}>
              {t.btn}
            </a>
          </div>
        </section>

        <section className="af-earns">
          <div className="container">
            <div className="af-earns-split">
              <div className="af-head">
                <h2>{t.h2}</h2>
                <p>
                  <Fmt text={t.p} vars={{ min: <span className="af-ltr">₪{he(PAYOUT_MIN)}</span> }} />
                </p>
              </div>
              <ul className="af-earn-list">
                {t.earns.map((e) => (
                  <li key={e}>
                    <span className="af-earn-t">{e}</span>
                    <span className="af-earn-rate" aria-hidden="true">
                      20%
                    </span>
                    <span className="af-sr">{t.sr}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* The sum, shown rather than asserted. Every figure in it comes
            from the same price list /pricing/ renders, so the two cannot
            drift apart. */}
        <section className="af-example">
          <div className="container">
            <div className="af-head">
              <h2>{t.h22}</h2>
              <p>
                {t.p3}
              </p>
            </div>

            <table className="af-table">
              <caption className="af-sr">
                {t.sr2}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{t.th}</th>
                  <th scope="col">{t.th2}</th>
                  <th scope="col">{t.th3}</th>
                </tr>
              </thead>
              <tbody>
                {example.map((r) => (
                  <tr key={r.contacts}>
                    <th scope="row">{he(r.contacts)}</th>
                    <td>
                      <Fmt
                        text={t.tierCell}
                        vars={{
                          contacts: he(r.tier.contacts),
                          price: <span className="af-ltr">₪{he(r.tier.year)}</span>,
                        }}
                      />
                    </td>
                    <td>
                      <span className="af-ltr">₪{he(r.annual)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={2}>
                    {t.th4}
                  </th>
                  <td>
                    <span className="af-ltr">₪{he(exampleTotal)}</span>
                  </td>
                </tr>
                <tr className="af-table-total">
                  <th scope="row" colSpan={2}>
                    {t.th5}
                  </th>
                  <td>
                    <span className="af-ltr">₪{shekels(exampleCommission)}</span>
                  </td>
                </tr>
              </tfoot>
            </table>

            <p className="af-foot">
              {t.foot}{" "}
              <LocalizedLink to="/pricing/" className="af-inline-link">
                {t.inlineLink}
              </LocalizedLink>
              {t.foot2}
            </p>
          </div>
        </section>

        <section className="af-start">
          <div className="container">
            <div className="af-head">
              <h2>{t.h23}</h2>
              <p>
                {t.p4}
              </p>
            </div>
            <ol className="af-steps">
              {t.steps.map((s, i) => (
                <li key={s}>
                  <span className="af-step-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="af-step-t">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="af-suits">
          <div className="container">
            <div className="af-suits-split">
              <div className="af-head">
                <h2>{t.h24}</h2>
              </div>
              <ul className="af-suit-list">
                {t.suits.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* The two rules that decide whether a commission is paid at all,
            so they are stated plainly rather than left in small print. */}
        <section className="af-notes">
          <div className="container">
            <div className="af-notes-in">
              <h2>{t.h25}</h2>
              <p>
                {t.p5}
              </p>
              <p>
                {t.p6}
              </p>
              <p className="af-notes-terms">{t.notesTerms}</p>
            </div>
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default AffiliatePage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = getT(pageContext.locale, "pages/affiliate")
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/affiliate/"
    />
  )
}
