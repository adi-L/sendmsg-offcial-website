import React, { useState } from "react"
import { openSignup, PANEL_URL } from "./SignupDialog"
import { formatText } from "../locales/config"
import LocalizedLink from "../locales/LocalizedLink"
import { useText } from "../locales/LocaleContext"
import heText from "../locales/he/sms-bank.json"

/* This component's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

/* ── SMS bank prices ────────────────────────────────────────────
   Read straight off the live calculator at
   sendmsg.co.il/pricelist/smsbank/, which renders every figure in JS
   behind a noUiSlider plus a 70 / 140 / 210 character toggle. All 30
   quoted steps were captured by driving both controls.

   Two numbers per step: the struck-through list price and the price
   actually charged. Both are stored as captured rather than derived
   from the 5% rule that happens to connect them — a rule is a guess,
   a captured figure is a fact.

   Every figure is quoted before VAT, exactly as that page quotes it.
   Re-check these against the live calculator when prices change. */
type Len = 70 | 140 | 210

const LENGTHS: Len[] = [70, 140, 210]

const QTY = [
  5000, 10000, 20000, 30000, 50000, 100000, 150000, 200000, 250000, 300000,
]

/* [list, charged] per quantity, in the order of QTY */
const PRICES: Record<Len, [number, number][]> = {
  70: [
    [155, 147], [260, 247], [460, 437], [660, 627], [1050, 998],
    [2000, 1900], [2850, 2708], [3700, 3515], [4500, 4275], [5250, 4988],
  ],
  140: [
    [300, 285], [500, 475], [800, 760], [1050, 998], [1500, 1425],
    [2500, 2375], [3375, 3206], [4200, 3990], [5000, 4750], [5850, 5558],
  ],
  210: [
    [400, 380], [700, 665], [1000, 950], [1200, 1140], [1875, 1781],
    [3500, 3325], [4875, 4631], [6000, 5700], [6875, 6531], [7500, 7125],
  ],
}

/* One step past the top of the table: above 300,000 messages the live
   calculator stops quoting and asks you to talk to someone. */
const CUSTOM_STEP = QTY.length

const he = (n: number) => n.toLocaleString("he-IL")


const SmsBank: React.FC = () => {
  const t = useText(TEXT)
  const [len, setLen] = useState<Len>(70)
  const [step, setStep] = useState(0)

  const isCustom = step === CUSTOM_STEP
  const qty = isCustom ? null : QTY[step]
  const [list, net] = isCustom ? [0, 0] : PRICES[len][step]

  return (
    <div className="sb">
      <section className="sb-hero">
        <div className="container">
          <h1>{t.heroTitle}</h1>
          <p className="sb-hero-sub">
            {t.heroSub}
          </p>
          <ul className="sb-terms">
            {t.terms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* A console, not a card grid: the two halves are one instrument.
          You set the message on the right, the price answers on the left,
          and the hairline between them is the only thing separating a
          question from its answer. */}
      <section className="sb-calc">
        <div className="container">
          <div className="sb-console">
            <div className="sb-controls">
              <fieldset className="sb-field">
                <legend>{t.lengthQuestion}</legend>
                <div className="sb-lens">
                  {LENGTHS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      aria-pressed={len === l}
                      onClick={() => setLen(l)}
                    >
                      {formatText(t.chars, { len: l })}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* A native range input on purpose: keyboard, screen readers
                  and touch all work without rebuilding any of it. */}
              <div className="sb-sizer">
                <label htmlFor="sb-qty">{t.qtyQuestion}</label>
                <output htmlFor="sb-qty" className="sb-sizer-value">
                  {isCustom ? "300,001 +" : he(QTY[step])}
                </output>
                <input
                  id="sb-qty"
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
                {/* The stops are not evenly spaced in messages, so the scale
                    shows where they actually are instead of implying a
                    straight line from 5,000 to 300,000. */}
                <div className="sb-ticks" aria-hidden="true">
                  {Array.from({ length: CUSTOM_STEP + 1 }, (_, i) => (
                    <span key={i} />
                  ))}
                </div>
                <div className="sb-scale" aria-hidden="true">
                  <span>5,000</span>
                  <span>300,001 +</span>
                </div>
              </div>
            </div>

            {/* keyed so the figure re-enters when the bank changes: the one
                authored moment on the page, and the only thing that moves */}
            <div className="sb-quote" key={`${len}-${step}`}>
              {isCustom ? (
                <>
                  <h2 className="sb-quote-head">{t.customHead}</h2>
                  <p className="sb-quote-lead">
                    {t.customLead}
                  </p>
                  <LocalizedLink to="/contact/" className="sb-btn sb-btn-accent">
                    {t.contactForQuote}
                  </LocalizedLink>
                </>
              ) : (
                <>
                  <h2 className="sb-quote-head">
                    {formatText(t.bankOf, { qty: he(qty as number) })}
                  </h2>
                  <p className="sb-price">
                    <s className="sb-price-was">
                      <span className="sb-sr">{t.fullPrice}</span>
                      {he(list)} ₪
                    </s>
                    <span className="sb-price-now">
                      <span className="sb-price-cur" aria-hidden="true">₪</span>
                      <span className="sb-price-num">{he(net)}</span>
                      <span className="sb-sr">{t.shekels}</span>
                    </span>
                  </p>
                  <p className="sb-price-terms">
                    {t.priceTerms}<span aria-hidden="true">*</span>
                  </p>
                  <a href={PANEL_URL} className="sb-btn sb-btn-accent" onClick={openSignup}>
                    {t.openAccount}
                  </a>
                  <LocalizedLink to="/contact/" className="sb-quote-alt">
                    {t.askCustom}
                  </LocalizedLink>
                </>
              )}
            </div>
          </div>

          <p className="sb-foot">
            {t.foot}
          </p>
        </div>
      </section>

      {/* Ruled rows, no tick per line: eleven identical checkmarks would
          say nothing that the heading has not already said. */}
      <section className="sb-gifts">
        <div className="container">
          <div className="sb-head">
            <h2>{t.giftsTitle}</h2>
            <p>{t.giftsSubtitle}</p>
          </div>
          <ul className="sb-gift-list">
            {t.gifts.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* The whole price list in one place, and it drives the console above:
          pick a cell and the calculator moves to it. */}
      <section className="sb-table-band">
        <div className="container">
          <div className="sb-head">
            <h2>{t.tableTitle}</h2>
            <p>
              {t.tableSub}
            </p>
          </div>

          <table className="sb-table">
            <caption className="sb-sr">
              {t.tableCaption}
            </caption>
            <thead>
              <tr>
                <th scope="col">{t.tableQtyHead}</th>
                {LENGTHS.map((l) => (
                  <th key={l} scope="col" data-len={l} data-active={len === l}>
                    {formatText(t.chars, { len: l })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {QTY.map((q, i) => (
                <tr key={q} data-current={!isCustom && step === i}>
                  <th scope="row">{he(q)}</th>
                  {LENGTHS.map((l) => (
                    <td key={l} data-len={l} data-active={len === l}>
                      <button
                        type="button"
                        aria-pressed={len === l && step === i}
                        onClick={() => {
                          setLen(l)
                          setStep(i)
                        }}
                      >
                        <span className="sb-sr">
                          {formatText(t.cellLabel, { qty: he(q), len: l })}
                        </span>
                        {he(PRICES[l][i][1])} ₪
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="sb-custom">
            <div>
              <h2>{t.biggerTitle}</h2>
              <p>{t.biggerSub}</p>
            </div>
            <LocalizedLink to="/contact/" className="sb-btn sb-btn-outline">
              {t.contactForQuote}
            </LocalizedLink>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SmsBank
