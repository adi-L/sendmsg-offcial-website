import React, { useEffect, useRef, useState } from "react"
import { Link, withPrefix } from "gatsby"

const COUPON_CODE = "GE5H43D"
const SHOW_DELAY_MS = 12_000
const STORAGE_KEY = "sendmsg-promo-seen"
const SNOOZE_DAYS = 7

const PromoPopup: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState<"form" | "code">("form")
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [copied, setCopied] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY)
      if (seen && Date.now() - Number(seen) < SNOOZE_DAYS * 24 * 60 * 60 * 1000) {
        return
      }
    } catch {
      // private browsing: show as usual, just without persistence
    }
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!visible) return
    emailRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [visible])

  const close = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()))
    } catch {
      // ignore
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("code")
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable: the code is still visible to copy manually
    }
  }

  if (!visible) return null

  return (
    <div className="promo-backdrop" onClick={close}>
      <div
        className="promo-modal"
        role="dialog"
        aria-modal="true"
        aria-label="הצטרפות למועדון הלקוחות"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="promo-close" onClick={close} aria-label="סגירה">
          ×
        </button>

        {step === "form" ? (
          <>
            <span className="promo-badge">מועדון הלקוחות של שלח מסר</span>
            <h3 className="promo-title">
              <span className="promo-percent">14% הנחה</span>
              <br />
              על כל המנויים השנתיים
            </h3>
            <p className="promo-subtitle">
              מצטרפים למועדון ומקבלים קוד קופון חד פעמי למייל.
            </p>

            <form onSubmit={handleSubmit} className="promo-form">
              <input
                ref={emailRef}
                type="email"
                required
                placeholder="המייל שלך"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="promo-input"
              />
              <button type="submit" className="promo-cta">
                שלחו לי את הקוד
              </button>
              <label className="promo-consent">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  אני מאשר/ת קבלת עדכונים לפי{" "}
                  <a href={withPrefix("/privacy/")} target="_blank" rel="noreferrer">
                    מדיניות הפרטיות
                  </a>
                  . אפשר להסיר בכל עת.
                </span>
              </label>
            </form>
          </>
        ) : (
          <>
            <span className="promo-badge">הקוד שלך מוכן 🎉</span>
            <h3 className="promo-title">קוד הקופון שלך</h3>

            <button
              className="promo-code"
              onClick={copyCode}
              title="לחיצה מעתיקה את הקוד"
            >
              <span className="promo-code-text">{COUPON_CODE}</span>
              <span className="promo-code-copy">
                {copied ? "הועתק ✓" : "העתקה"}
              </span>
            </button>

            <p className="promo-subtitle">
              14% הנחה על כל המנויים השנתיים. מזינים את הקוד בעמוד התשלום.
            </p>

            <Link to="/pricing" className="promo-cta" onClick={close}>
              לבחירת חבילה
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default PromoPopup
