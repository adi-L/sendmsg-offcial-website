import React, { useState } from "react"
import { openSignup, PANEL_URL } from "./SignupDialog"
import { formatText } from "../locales/config"
import LocalizedLink from "../locales/LocalizedLink"
import { useText } from "../locales/LocaleContext"
import heText from "../locales/he/email-bank.json"

/* This component's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

/* ── Email bank prices ──────────────────────────────────────────
   Read straight off the live calculator at
   sendmsg.co.il/pricelist/emailbank/, which renders every figure in
   JS behind a noUiSlider. All nine quoted steps were captured by
   driving the slider through its whole range.

   Two numbers per step: the struck-through list price and the price
   actually charged. Both are stored as captured rather than derived
   from the 20% rule that happens to connect them — a rule is a
   guess, a captured figure is a fact.

   Every figure is quoted before VAT and as a one-time payment,
   exactly as that page quotes it. Re-check these against the live
   calculator when prices change. */
const QTY = [10000, 20000, 25000, 30000, 40000, 50000, 100000, 200000, 300000]

/* [list, charged] per quantity, in the order of QTY */
const PRICES: [number, number][] = [
  [800, 640],
  [1100, 880],
  [1175, 940],
  [1230, 984],
  [1360, 1088],
  [1600, 1280],
  [2700, 2160],
  [3500, 2800],
  [4950, 3960],
]

/* One step past the top of the list: above 300,000 the live
   calculator stops quoting and asks you to talk to someone. */
const CUSTOM_STEP = QTY.length

const he = (n: number) => n.toLocaleString("he-IL")


const EmailBank: React.FC = () => {
  const t = useText(TEXT)
  const [step, setStep] = useState(0)

  const isCustom = step === CUSTOM_STEP
  const qty = isCustom ? null : QTY[step]
  const [list, net] = isCustom ? [0, 0] : PRICES[step]

  return (
    <div className="eb">
      <section className="eb-hero">
        <div className="container">
          <h1>{t.heroTitle}</h1>
          <p className="eb-hero-sub">
            {t.heroSub}
          </p>
          <ul className="eb-terms">
            {t.terms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* An instrument beside a fact: the slider on the wide side asks
          how many emails, the narrow panel holds the one price that
          never moves. Putting ₪0 next to the quote is the comparison
          the page is really about. */}
      <section className="eb-pick">
        <div className="container">
          <div className="eb-split">
            <div className="eb-console">
              {/* A native range input on purpose: keyboard, screen
                  readers and touch all work without rebuilding any of it. */}
              <div className="eb-sizer">
                <label htmlFor="eb-qty">{t.qtyQuestion}</label>
                <output htmlFor="eb-qty" className="eb-sizer-value">
                  {isCustom ? t.customQty : he(QTY[step])}
                </output>
                <input
                  id="eb-qty"
                  type="range"
                  min={0}
                  max={CUSTOM_STEP}
                  step={1}
                  value={step}
                  onChange={(e) => setStep(Number(e.target.value))}
                  aria-valuetext={
                    isCustom ? t.customValueText : formatText(t.qtyValueText, { qty: he(QTY[step]) })
                  }
                  style={
                    { "--fill": `${(step / CUSTOM_STEP) * 100}%` } as React.CSSProperties
                  }
                />
                {/* The stops are not evenly spaced in emails, so the scale
                    shows where they actually are instead of implying a
                    straight line from 10,000 to 300,000. */}
                <div className="eb-ticks" aria-hidden="true">
                  {Array.from({ length: CUSTOM_STEP + 1 }, (_, i) => (
                    <span key={i} />
                  ))}
                </div>
                <div className="eb-scale" aria-hidden="true">
                  <span>{t.scaleMin}</span>
                  <span>{t.customQty}</span>
                </div>
              </div>

              {/* keyed so the figure re-enters when the bank changes: the
                  one authored moment on the page, and the only thing
                  that moves */}
              <div className="eb-quote" key={step}>
                {isCustom ? (
                  <>
                    <h2 className="eb-quote-head">{t.customHead}</h2>
                    <p className="eb-quote-lead">
                      {t.customLead}
                    </p>
                    <LocalizedLink to="/contact/" className="eb-btn eb-btn-accent">
                      {t.contactForQuote}
                    </LocalizedLink>
                  </>
                ) : (
                  <>
                    <h2 className="eb-quote-head">
                      {formatText(t.bankOf, { qty: he(qty as number) })}
                    </h2>
                    <p className="eb-price">
                      <s className="eb-price-was">
                        <span className="eb-sr">{t.fullPrice}</span>
                        {he(list)} ₪
                      </s>
                      <span className="eb-price-now">
                        <span className="eb-price-cur" aria-hidden="true">₪</span>
                        <span className="eb-price-num">{he(net)}</span>
                        <span className="eb-sr">{t.shekels}</span>
                      </span>
                    </p>
                    <p className="eb-price-terms">
                      {t.priceTerms}<span aria-hidden="true">*</span>
                    </p>
                    <a
                      href={PANEL_URL}
                      className="eb-btn eb-btn-accent"
                      onClick={openSignup}
                    >
                      {t.openAccount}
                    </a>
                    <LocalizedLink to="/contact/" className="eb-quote-alt">
                      {t.askCustom}
                    </LocalizedLink>
                  </>
                )}
              </div>
            </div>

            {/* The free plan is a fact, not a third price column: one
                number, what it covers, and a way in. */}
            <div className="eb-free">
              <p className="eb-free-eyebrow">{t.freeEyebrow}</p>
              <h2 className="eb-free-head">
                {t.free}
                <span className="eb-free-num" aria-hidden="true">₪0</span>
              </h2>
              <p className="eb-free-note">{t.freeNote}</p>
              <ul className="eb-free-list">
                {t.freePlan.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a
                href={PANEL_URL}
                className="eb-btn eb-btn-outline"
                onClick={openSignup}
              >
                {t.openFree}
              </a>
            </div>
          </div>

          <p className="eb-foot">
            {t.foot}
          </p>
        </div>
      </section>

      {/* A ledger, not a tick list: thirteen identical checkmarks would
          say nothing the heading has not already said. The index numbers
          carry the eye down the column instead. */}
      <section className="eb-gifts">
        <div className="container">
          <div className="eb-head">
            <h2>{t.giftsTitle}</h2>
            <p>{t.giftsSubtitle}</p>
          </div>
          <ol className="eb-gift-list">
            {t.gifts.map((g, i) => (
              <li key={g}>
                <span className="eb-gift-i" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="eb-gift-t">{g}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* A bigger bank is a conversation, not another price column */}
      <section className="eb-custom">
        <div className="container">
          <div className="eb-custom-row">
            <div>
              <h2>{t.biggerTitle}</h2>
              <p>{t.customLead}</p>
            </div>
            <LocalizedLink to="/contact/" className="eb-btn eb-btn-light">
              {t.contactForQuote}
            </LocalizedLink>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EmailBank
