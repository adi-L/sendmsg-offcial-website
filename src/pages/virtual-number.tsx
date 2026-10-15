import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/virtual-number.css"
import type { PageContext } from "../locales/config"
import { useT } from "../locales/LocaleContext"
import { getT } from "../locales/messages"

/* Where the live page's "לרכישת מס' וירטואלי חדש" button goes */
const BUY_URL =
  "https://panel.sendmsg.co.il/PurchaseSms.aspx?cat=113#selectedPackege"

/* The demo the live page invites you to run, and the number it names */
const DEMO_NUMBER = "055-9377588"
/* The word to text it is demoWord in virtual-number.json. */

/* capabilities: moved to src/locales/he/pages/virtual-number.json as "capabilities". */
const VirtualNumberPage: React.FC = () => {
  const t = useT("pages/virtual-number")
  return (
    <Layout>
      <div className="vn">
        <section className="vn-hero">
          <div className="container">
            <div className="vn-hero-split">
              <div className="vn-hero-text">
                <h1>{t.h1}</h1>
                <p className="vn-lead">
                  {t.lead}
                </p>
              </div>

              {/* One number, one button. The price is the whole offer, so it
                  gets a surface of its own rather than a line in a list. */}
              <div className="vn-offer">
                <p className="vn-offer-label">{t.offerLabel}</p>
                <p className="vn-offer-price">
                  <span className="vn-offer-cur" aria-hidden="true">₪</span>
                  <span className="vn-offer-num">118</span>
                  <span className="vn-sr">{t.sr}</span>
                </p>
                <p className="vn-offer-terms">{t.offerTerms}</p>
                <a href={BUY_URL} className="vn-btn vn-btn-accent">
                  {t.btn}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Ruled rows, term then sentence: five claims that each need a line
            of explanation, which is a list a card grid would only pad out. */}
        <section className="vn-what">
          <div className="container">
            <div className="vn-what-split">
              <div className="vn-head">
                <h2>{t.h2}</h2>
                <p>
                  {t.p}
                </p>
              </div>

              <dl className="vn-list">
                {t.capabilities.map((c) => (
                  <div key={c.t} className="vn-list-row">
                    <dt>{c.t}</dt>
                    <dd>{c.d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* The one authored moment: the page shows you the message instead
            of describing it, and the message is real — it is the demo the
            live page asks you to run. */}
        <section className="vn-demo">
          <div className="container">
            <div className="vn-demo-split">
              <div className="vn-head">
                <h2>{t.h22}</h2>
                <p>
                  {t.p2}{t.demoWord}{t.p3}{" "}
                  <span className="vn-num">{DEMO_NUMBER}</span>.
                </p>
              </div>

              <div className="vn-phone" aria-hidden="true">
                <div className="vn-phone-to">
                  <span className="vn-phone-to-label">{t.phoneToLabel}</span>
                  <span className="vn-num">{DEMO_NUMBER}</span>
                </div>
                <div className="vn-bubble">
                  <span>{t.demoWord}</span>{" "}
                  <span className="vn-bubble-mail">name@mail.com</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="vn-buy">
          <div className="container">
            <div className="vn-buy-row">
              <div>
                <h2>{t.h23}</h2>
                <p>
                  <span className="vn-num">₪118</span>{t.p4}
                </p>
              </div>
              <div className="vn-buy-actions">
                <a href={BUY_URL} className="vn-btn vn-btn-light">
                  {t.btn2}
                </a>
                <a href={PANEL_URL} className="vn-buy-alt" onClick={openSignup}>
                  {t.buyAlt}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default VirtualNumberPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = getT(pageContext.locale, "pages/virtual-number")
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/virtual-number/"
    />
  )
}
