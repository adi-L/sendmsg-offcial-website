import React, { useState } from "react"
import { openSignup, PANEL_URL } from "./SignupDialog"
import { formatText } from "../locales/config"
import LocalizedLink from "../locales/LocalizedLink"
import { useT } from "../locales/LocaleContext"

/* ── price tiers ─────────────────────────────────────────────────
   Read straight off the live calculator at
   sendmsg.co.il/pricelist/packages, which renders its prices in JS
   behind a 17-step noUiSlider. Every figure below is quoted BEFORE
   VAT, exactly as that page quotes them.

   Annual is a flat 10% off monthly at every tier, but both numbers
   are stored rather than computed: a rounding rule is a guess, a
   captured figure is a fact.

   The monthly send allowance is contacts x 8 at every tier, which
   holds across all 16 priced steps, so it is derived.

   Re-check these against the live calculator when prices change. */
export type Tier = { contacts: number; month: number; year: number }

/* Exported so other pages can quote a real tier rather than restate a
   price: /affiliate/ computes its commission example from this list. */
export const TIERS: Tier[] = [
  { contacts: 250, month: 40, year: 36 },
  { contacts: 500, month: 79, year: 71 },
  { contacts: 1000, month: 89, year: 80 },
  { contacts: 2000, month: 129, year: 116 },
  { contacts: 3500, month: 169, year: 152 },
  { contacts: 5000, month: 199, year: 179 },
  { contacts: 7500, month: 229, year: 206 },
  { contacts: 10000, month: 289, year: 260 },
  { contacts: 15000, month: 379, year: 341 },
  { contacts: 20000, month: 459, year: 413 },
  { contacts: 25000, month: 539, year: 485 },
  { contacts: 30000, month: 619, year: 557 },
  { contacts: 40000, month: 769, year: 692 },
  { contacts: 50000, month: 889, year: 800 },
  { contacts: 75000, month: 1239, year: 1115 },
  { contacts: 100000, month: 1569, year: 1412 },
]

/* One step past the top of the table: above 100,000 contacts the live
   calculator stops quoting and asks you to talk to someone. */
const CUSTOM_STEP = TIERS.length
const SENDS_PER_CONTACT = 8

const he = (n: number) => n.toLocaleString("he-IL")

type Cycle = "year" | "month"

/* The icons for the "included" band, in the same order as `included` in
   pricing.json. */
const INCLUDED_ICONS = [
  (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
  (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  ),
  (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
]

const Chevron = () => (
  <svg
    className="pp-faq-chevron"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
)

/* One price block for both cards, so the figure, the currency and the period
   all sit on the same baseline whichever plan you look at. "Free" is a word
   in a number's slot, so it takes the number's optical size rather than the
   number's weight. */
function Price({
  amount,
  period,
  word,
  note,
}: {
  amount?: string
  period: string
  word?: string
  note?: string
}) {
  const t = useT("pricing")
  return (
    <div className="pp-price">
      <p className="pp-price-fig">
        {word ? (
          <span className="pp-price-word">{word}</span>
        ) : (
          <>
            <span className="pp-price-cur" aria-hidden="true">₪</span>
            <span className="pp-price-num">{amount}</span>
            <span className="pp-sr">{t.shekels}</span>
          </>
        )}
      </p>
      <p className="pp-price-period">{period}</p>
      {note && <p className="pp-price-note">{note}</p>}
    </div>
  )
}

const PricingFAQ: React.FC = () => {
  const t = useT("pricing")
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="pp-faq">
      <div className="container">
        <div className="pp-head">
          <h2>{t.faqTitle}</h2>
          <p>{t.faqSubtitle}</p>
        </div>
        <div className="pp-faq-list">
          {t.faqs.map((faq, i) => (
            <div key={faq.q} className="pp-faq-item" data-open={open === i}>
              <h3>
                <button
                  type="button"
                  className="pp-faq-q"
                  aria-expanded={open === i}
                  aria-controls={`pp-faq-a-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <Chevron />
                </button>
              </h3>
              {/* kept mounted so the row can animate open, and hidden from the
                  a11y tree so a zero-height answer is not read aloud */}
              <div className="pp-faq-a" id={`pp-faq-a-${i}`} aria-hidden={open !== i}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Pricing: React.FC = () => {
  const t = useT("pricing")
  const plan = t.plan
  const [cycle, setCycle] = useState<Cycle>("year")
  const [step, setStep] = useState(0)

  const isCustom = step === CUSTOM_STEP
  const tier = isCustom ? null : TIERS[step]
  const proPrice = tier ? he(cycle === "month" ? tier.month : tier.year) : undefined
  // every figure on the live calculator is quoted before VAT, so these are too
  const proPeriod = isCustom
    ? t.periodCustom
    : cycle === "month"
      ? t.periodMonthly
      : t.periodYearly
  const proNote = tier
    ? formatText(t.sendsNote, { sends: he(tier.contacts * SENDS_PER_CONTACT) })
    : undefined
  const contactsLabel = isCustom
    ? t.contactsOverMax
    : he(TIERS[step].contacts)

  return (
    <div className="pp" id="pricing">
      <section className="pp-hero">
        <div className="container">
          <h1>{t.heroTitle}</h1>
          <p className="pp-hero-sub">
            {t.heroSub}
          </p>
          <ul className="pp-trust">
            {t.trust.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pp-plans">
        <div className="container">
          <div className="pp-controls">
            <div className="pp-billing" role="group" aria-label={t.billingLabel}>
              <button
                type="button"
                aria-pressed={cycle === "year"}
                onClick={() => setCycle("year")}
              >
                {t.yearly}
                <span className="pp-billing-save">{t.yearlySave}</span>
              </button>
              <button
                type="button"
                aria-pressed={cycle === "month"}
                onClick={() => setCycle("month")}
              >
                {t.monthly}
              </button>
            </div>
          </div>

          {/* Asymmetric on purpose: the plans are not equal, so they do not get
              equal boxes. The recommended one carries the ink and the width;
              the free one sits beside it as the way in. */}
          <div className="pp-grid">
            <div className="pp-card pp-card-pro">
              <header>
                <h2>
                  {plan.pro.name}
                  <span className="pp-tag">{t.popular}</span>
                </h2>
                <p className="pp-tagline">{plan.pro.tagline}</p>
              </header>

              {/* A native range input on purpose: keyboard, screen readers and
                  touch all work without rebuilding any of it. */}
              <div className="pp-sizer">
                <label htmlFor="pp-contacts">{t.contactsQuestion}</label>
                <output htmlFor="pp-contacts" className="pp-sizer-value">
                  {contactsLabel}
                </output>
                <input
                  id="pp-contacts"
                  type="range"
                  min={0}
                  max={CUSTOM_STEP}
                  step={1}
                  value={step}
                  onChange={(e) => setStep(Number(e.target.value))}
                  aria-valuetext={formatText(t.contactsValueText, { contacts: contactsLabel })}
                  style={
                    { "--fill": `${(step / CUSTOM_STEP) * 100}%` } as React.CSSProperties
                  }
                />
              </div>

              <Price
                amount={proPrice}
                word={isCustom ? t.customWord : undefined}
                period={proPeriod}
                note={proNote}
              />

              <p className="pp-lead">{plan.pro.lead}</p>
              <ul className="pp-features">
                {plan.pro.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              {isCustom ? (
                <LocalizedLink to="/contact/" className="pp-btn pp-btn-accent">
                  {t.talkToUs}
                </LocalizedLink>
              ) : (
                <a href={PANEL_URL} className="pp-btn pp-btn-accent">
                  {plan.pro.cta}
                </a>
              )}
            </div>

            <div className="pp-card pp-card-free">
              <header>
                <h2>{plan.free.name}</h2>
                <p className="pp-tagline">{plan.free.tagline}</p>
              </header>

              <Price word={plan.free.price} period={plan.free.period} />

              <p className="pp-lead">{plan.free.lead}</p>
              <ul className="pp-features">
                {plan.free.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <a href={PANEL_URL} className="pp-btn pp-btn-outline" onClick={openSignup}>
                {plan.free.cta}
              </a>
            </div>
          </div>

          {/* No price, so no price column: the custom plan is a conversation,
              and it reads as one. */}
          <div className="pp-custom">
            <div>
              <h2>{plan.custom.name}</h2>
              <p>{plan.custom.tagline}</p>
              <ul>
                {plan.custom.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <LocalizedLink to="/contact/" className="pp-btn pp-btn-outline">
              {plan.custom.cta}
            </LocalizedLink>
          </div>

          <p className="pp-plans-note">
            {t.plansNote}
          </p>
        </div>
      </section>

      <section className="pp-band">
        <div className="container">
          <div className="pp-head">
            <h2>{t.bandTitle}</h2>
            <p>{t.bandSubtitle}</p>
          </div>
          <ul className="pp-band-row">
            {t.included.map((item, i) => (
              <li key={item.title}>
                <span className="pp-band-mark">{INCLUDED_ICONS[i]}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export { PricingFAQ }
export default Pricing
