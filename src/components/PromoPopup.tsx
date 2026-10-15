import React, { useEffect, useRef, useState } from "react"
import LocalizedLink from "../locales/LocalizedLink"
import { useLocalePath, useText } from "../locales/LocaleContext"
import heText from "../locales/he/promo-popup.json"

/* This component's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

const COUPON_CODE = "GE5H43D"
const SHOW_DELAY_MS = 12_000
const STORAGE_KEY = "sendmsg-promo-seen"
const SNOOZE_DAYS = 7

const PromoPopup: React.FC = () => {
  const t = useText(TEXT)
  const lp = useLocalePath()
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
        aria-label={t.dialogLabel}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="promo-close" onClick={close} aria-label={t.close}>
          ×
        </button>

        {step === "form" ? (
          <>
            <span className="promo-badge">{t.badge}</span>
            <h3 className="promo-title">
              <span className="promo-percent">{t.percent}</span>
              <br />
              {t.titleRest}
            </h3>
            <p className="promo-subtitle">
              {t.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="promo-form">
              <input
                ref={emailRef}
                type="email"
                required
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="promo-input"
              />
              <button type="submit" className="promo-cta">
                {t.submit}
              </button>
              <label className="promo-consent">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  {t.consentBefore}{" "}
                  <a href={lp("/privacy/")} target="_blank" rel="noreferrer">
                    {t.consentLink}
                  </a>
                  {t.consentAfter}
                </span>
              </label>
            </form>
          </>
        ) : (
          <>
            <span className="promo-badge">{t.codeBadge}</span>
            <h3 className="promo-title">{t.codeTitle}</h3>

            <button
              className="promo-code"
              onClick={copyCode}
              title={t.copyHint}
            >
              <span className="promo-code-text">{COUPON_CODE}</span>
              <span className="promo-code-copy">
                {copied ? t.copied : t.copy}
              </span>
            </button>

            <p className="promo-subtitle">
              {t.codeSubtitle}
            </p>

            <LocalizedLink to="/pricing" className="promo-cta" onClick={close}>
              {t.choosePlan}
            </LocalizedLink>
          </>
        )}
      </div>
    </div>
  )
}

export default PromoPopup
