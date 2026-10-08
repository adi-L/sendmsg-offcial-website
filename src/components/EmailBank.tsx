import React, { useState } from "react"
import { Link } from "gatsby"
import { openSignup, PANEL_URL } from "./SignupDialog"

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

/* What the free starter plan actually includes, per the live page */
const freePlan = [
  "עד 250 מנויים",
  "2,000 דיוורים בחודש",
  "החבילה ללא הגבלת זמן",
  "עד 5 דפי נחיתה",
  "הקמת קורס ראשון מלא",
  "תמיכה במיילים",
]

/* The thirteen extras the live page lists under
   "מתנות לחבילה משודרגת" */
const gifts = [
  "אנשי קשר ללא הגבלה",
  "עורך ניוזלטרים מתקדם",
  "דומיין חינמי + תיבות וירטואליות",
  "דפי נחיתה ללא הגבלה",
  "מערכת ניהול לקוחות CRM",
  "מודול פגישות ושיתופי פעולה",
  "תמיכה מלאה VIP",
  "התממשקות ב-API",
  "חיבור ישיר למערכות סליקה",
  "חיבור ישיר ל-BizLive",
  "אוטומציות מתקדמות",
  "כלי תיקון כתובות שגויות",
  "קורס שיווקי – מאסטר קלאס",
]

const EmailBank: React.FC = () => {
  const [step, setStep] = useState(0)

  const isCustom = step === CUSTOM_STEP
  const qty = isCustom ? null : QTY[step]
  const [list, net] = isCustom ? [0, 0] : PRICES[step]

  return (
    <div className="eb">
      <section className="eb-hero">
        <div className="container">
          <h1>בנק שליחות מיילים</h1>
          <p className="eb-hero-sub">
            בחרו את החבילה המתאימה לכם ביותר בעזרת הסליידר
          </p>
          <ul className="eb-terms">
            <li>בתשלום חד פעמי</li>
            <li>בלי מנוי חודשי</li>
            <li>המחירים אינם כוללים מע״מ</li>
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
                <label htmlFor="eb-qty">כמה דיוורים אתם צריכים?</label>
                <output htmlFor="eb-qty" className="eb-sizer-value">
                  {isCustom ? "300,001 +" : he(QTY[step])}
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
                    isCustom ? "מעל 300,001 דיוורים" : `${he(QTY[step])} דיוורים`
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
                  <span>10,000</span>
                  <span>300,001 +</span>
                </div>
              </div>

              {/* keyed so the figure re-enters when the bank changes: the
                  one authored moment on the page, and the only thing
                  that moves */}
              <div className="eb-quote" key={step}>
                {isCustom ? (
                  <>
                    <h2 className="eb-quote-head">300,001 + דיוורים</h2>
                    <p className="eb-quote-lead">
                      נשלח לכם הצעה לחבילה מותאמת עבורכם
                    </p>
                    <Link to="/contact/" className="eb-btn eb-btn-accent">
                      ליצירת קשר להצעה
                    </Link>
                  </>
                ) : (
                  <>
                    <h2 className="eb-quote-head">
                      בנק של {he(qty as number)} דיוורים
                    </h2>
                    <p className="eb-price">
                      <s className="eb-price-was">
                        <span className="eb-sr">מחיר מלא </span>
                        {he(list)} ₪
                      </s>
                      <span className="eb-price-now">
                        <span className="eb-price-cur" aria-hidden="true">₪</span>
                        <span className="eb-price-num">{he(net)}</span>
                        <span className="eb-sr">שקלים</span>
                      </span>
                    </p>
                    <p className="eb-price-terms">
                      + מע״מ, בתשלום חד פעמי<span aria-hidden="true">*</span>
                    </p>
                    <a
                      href={PANEL_URL}
                      className="eb-btn eb-btn-accent"
                      onClick={openSignup}
                    >
                      לפתיחת חשבון
                    </a>
                    <Link to="/contact/" className="eb-quote-alt">
                      או בקשו חבילה מותאמת
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* The free plan is a fact, not a third price column: one
                number, what it covers, and a way in. */}
            <div className="eb-free">
              <p className="eb-free-eyebrow">חבילה למתחילים</p>
              <h2 className="eb-free-head">
                חינם
                <span className="eb-free-num" aria-hidden="true">₪0</span>
              </h2>
              <p className="eb-free-note">ללא צורך בכרטיס אשראי</p>
              <ul className="eb-free-list">
                {freePlan.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a
                href={PANEL_URL}
                className="eb-btn eb-btn-outline"
                onClick={openSignup}
              >
                פתיחת חשבון בחינם
              </a>
            </div>
          </div>

          <p className="eb-foot">
            * עד לסיום יתרת השליחות או לאחר 12 חודשים מהרכישה האחרונה בחשבון
          </p>
        </div>
      </section>

      {/* A ledger, not a tick list: thirteen identical checkmarks would
          say nothing the heading has not already said. The index numbers
          carry the eye down the column instead. */}
      <section className="eb-gifts">
        <div className="container">
          <div className="eb-head">
            <h2>מתנות לחבילה משודרגת</h2>
            <p>כלולות בכל בנק שליחות, בלי תוספת תשלום ובלי מנוי חודשי</p>
          </div>
          <ol className="eb-gift-list">
            {gifts.map((g, i) => (
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
              <h2>צריכים בנק מיילים גדול יותר?</h2>
              <p>נשלח לכם הצעה לחבילה מותאמת עבורכם</p>
            </div>
            <Link to="/contact/" className="eb-btn eb-btn-light">
              ליצירת קשר להצעה
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EmailBank
