import React, { useState } from "react"
import { Link } from "gatsby"
import { openSignup, PANEL_URL } from "./SignupDialog"

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
type Tier = { contacts: number; month: number; year: number }

const TIERS: Tier[] = [
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

const plan = {
  free: {
    name: "חבילה למתחילים",
    tagline: "להכיר את המערכת בקצב שלכם",
    price: "חינם",
    period: "לתמיד, בלי כרטיס אשראי",
    lead: "מה מקבלים",
    features: [
      "250 מנויים",
      "2,000 דיוורים בחודש",
      "5 דפי נחיתה",
      "בונה קורסים דיגיטליים",
      "תמיכה במייל",
    ],
    cta: "פתיחת חשבון בחינם",
  },
  pro: {
    name: "חבילה משודרגת",
    tagline: "לעסק שרוצה לצמוח עם כל הכלים",
    lead: "כל מה שבחבילה למתחילים, ובנוסף",
    features: [
      "שליחות יומיות ללא הגבלה",
      "דפי נחיתה ללא הגבלה",
      "קורסים דיגיטליים ו-CRM",
      "API מלא וייצוא לאקסל",
      "תמיכה במייל, בצ׳אט ובטלפון",
    ],
    cta: "שדרגו עכשיו",
  },
  custom: {
    name: "חבילה מותאמת",
    tagline: "לארגונים ולעסקים גדולים, מעל 100,000 אנשי קשר",
    features: [
      "ליווי הקמה אישי",
      "מנהל חשבון ייעודי",
      "SLA מובטח",
      "אינטגרציות מותאמות",
    ],
    cta: "דברו איתנו",
  },
}

const trust = [
  "בלי כרטיס אשראי",
  "מעל 50,000 משתמשים מאז 2009",
  "תקן אבטחת מידע ISO 27001",
]

const included = [
  {
    title: "מצב שומר שבת",
    text: "חסימת דפים ועיכוב דיוורים מכניסת שבת וחג ועד צאתם.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    ),
  },
  {
    title: "אבטחת מידע ISO 27001",
    text: "עומדת בתקן אבטחת המידע הבינלאומי ובתקנות הפרטיות.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "מותאם לכל מסך",
    text: "ניוזלטרים, דפי נחיתה וקורסים שנראים מצוין בכל מכשיר.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </svg>
    ),
  },
  {
    title: "מערכת ישראלית ותיקה",
    text: "מאז 2009, עם ממשק ותמיכה בעברית מצוות שמכיר את השוק.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

const faqs = [
  {
    q: "האם החבילה החינמית מוגבלת בזמן?",
    a: "לא. חבילת המתחילים היא בחינם לתמיד, עד 250 מנויים ו-2,000 דיוורים בחודש. בלי כרטיס אשראי ובלי התחייבות.",
  },
  {
    q: "איך משדרגים חבילה?",
    a: "משדרגים מתוך המערכת בכל שלב שמתאים לכם. כל אנשי הקשר, דפי הנחיתה והקמפיינים שלכם נשארים בדיוק כמו שהם.",
  },
  {
    q: "איזו תמיכה מקבלים בכל חבילה?",
    a: "בחבילה למתחילים תקבלו תמיכה במייל. בחבילה המשודרגת גם בצ׳אט ובטלפון, ובחבילה המותאמת מלווה אתכם מנהל חשבון ייעודי.",
  },
  {
    q: "מה זה מצב שומר שבת?",
    a: "תכונה ייחודית שחוסמת דפי נחיתה ומעכבת דיוורים מתוזמנים מכניסת שבת וחג ועד צאתם, לפי זמנים מדויקים. זמינה בכל החבילות.",
  },
  {
    q: "למי מתאימה החבילה המותאמת?",
    a: "לארגונים ולעסקים עם מעל 100,000 אנשי קשר, או עם צרכים מיוחדים כמו אינטגרציות מותאמות, SLA מובטח ומנהל חשבון ייעודי. צרו קשר ונבנה חבילה יחד.",
  },
  {
    q: "איך מתחילים?",
    a: "נרשמים בחינם, בלי כרטיס אשראי. תוך כמה דקות אפשר לשלוח את הדיוור הראשון שלכם.",
  },
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
   all sit on the same baseline whichever plan you look at. "חינם" is a word
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
  return (
    <div className="pp-price">
      <p className="pp-price-fig">
        {word ? (
          <span className="pp-price-word">{word}</span>
        ) : (
          <>
            <span className="pp-price-cur" aria-hidden="true">₪</span>
            <span className="pp-price-num">{amount}</span>
            <span className="pp-sr">שקלים</span>
          </>
        )}
      </p>
      <p className="pp-price-period">{period}</p>
      {note && <p className="pp-price-note">{note}</p>}
    </div>
  )
}

const PricingFAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="pp-faq">
      <div className="container">
        <div className="pp-head">
          <h2>שאלות על המחירון</h2>
          <p>ולא מצאתם תשובה? נשמח לעזור בצ׳אט או בטלפון</p>
        </div>
        <div className="pp-faq-list">
          {faqs.map((faq, i) => (
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
  const [cycle, setCycle] = useState<Cycle>("year")
  const [step, setStep] = useState(0)

  const isCustom = step === CUSTOM_STEP
  const tier = isCustom ? null : TIERS[step]
  const proPrice = tier ? he(cycle === "month" ? tier.month : tier.year) : undefined
  // every figure on the live calculator is quoted before VAT, so these are too
  const proPeriod = isCustom
    ? "מחיר שנקבע יחד איתכם"
    : cycle === "month"
      ? "לחודש בחיוב חודשי, לא כולל מע״מ"
      : "לחודש בחיוב שנתי, לא כולל מע״מ"
  const proNote = tier
    ? `כולל עד ${he(tier.contacts * SENDS_PER_CONTACT)} שליחות בחודש`
    : undefined
  const contactsLabel = isCustom
    ? "מעל 100,000"
    : he(TIERS[step].contacts)

  return (
    <div className="pp" id="pricing">
      <section className="pp-hero">
        <div className="container">
          <h1>מחירון פשוט ושקוף</h1>
          <p className="pp-hero-sub">
            מתחילים בחינם, בלי כרטיס אשראי ובלי התחייבות. משדרגים רק כשזה מתאים
            לעסק שלכם.
          </p>
          <ul className="pp-trust">
            {trust.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pp-plans">
        <div className="container">
          <div className="pp-controls">
            <div className="pp-billing" role="group" aria-label="מחזור חיוב">
              <button
                type="button"
                aria-pressed={cycle === "year"}
                onClick={() => setCycle("year")}
              >
                שנתי
                <span className="pp-billing-save">10% הנחה</span>
              </button>
              <button
                type="button"
                aria-pressed={cycle === "month"}
                onClick={() => setCycle("month")}
              >
                חודשי
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
                  <span className="pp-tag">הכי פופולרי</span>
                </h2>
                <p className="pp-tagline">{plan.pro.tagline}</p>
              </header>

              {/* A native range input on purpose: keyboard, screen readers and
                  touch all work without rebuilding any of it. */}
              <div className="pp-sizer">
                <label htmlFor="pp-contacts">כמה אנשי קשר יש לכם?</label>
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
                  aria-valuetext={`${contactsLabel} אנשי קשר`}
                  style={
                    { "--fill": `${(step / CUSTOM_STEP) * 100}%` } as React.CSSProperties
                  }
                />
              </div>

              <Price
                amount={proPrice}
                word={isCustom ? "מותאם אישית" : undefined}
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
                <Link to="/contact/" className="pp-btn pp-btn-accent">
                  דברו איתנו
                </Link>
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
            <Link to="/contact/" className="pp-btn pp-btn-outline">
              {plan.custom.cta}
            </Link>
          </div>

          <p className="pp-plans-note">
            אפשר לשדרג או לעבור חבילה בכל שלב, בלי להקים שום דבר מחדש.
          </p>
        </div>
      </section>

      <section className="pp-band">
        <div className="container">
          <div className="pp-head">
            <h2>בכל חבילה, בלי קשר למחיר</h2>
            <p>הדברים שחשובים לנו לתת לכל עסק, מהיום הראשון</p>
          </div>
          <ul className="pp-band-row">
            {included.map((item) => (
              <li key={item.title}>
                <span className="pp-band-mark">{item.icon}</span>
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
