import React, { useEffect, useState } from "react"
import { openSignup } from "./SignupDialog"
import alexAvatar from "../images/alex-avatar.png"

const PANEL_URL = "https://panel.sendmsg.co.il/"
const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=972559377588&text=היי, אולי תוכלו לסייע לי?"
const BUBBLE_KEY = "sendmsg-assistant-bubble-dismissed"

// The suggestion bubble shows only inside this scroll window,
// so it appears once mid-page and slips away on further scrolling.
const BUBBLE_FROM = 800
const BUBBLE_TO = 2100

const AIAssistant: React.FC = () => {
  const [inRange, setInRange] = useState(false)
  const [bubbleDismissed, setBubbleDismissed] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem(BUBBLE_KEY)) setBubbleDismissed(false)
    const onScroll = () =>
      setInRange(window.scrollY > BUBBLE_FROM && window.scrollY < BUBBLE_TO)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const dismissBubble = () => {
    setBubbleDismissed(true)
    sessionStorage.setItem(BUBBLE_KEY, "1")
  }

  const showBubble = inRange && !bubbleDismissed && !open

  return (
    <div className="ai-assistant">
      {showBubble && (
        <div className="ai-bubble" role="status">
          <button
            type="button"
            className="ai-bubble-close"
            onClick={dismissBubble}
            aria-label="סגירת ההצעה"
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <p className="ai-bubble-text">
            <strong>שירות חדש!</strong> יש לך חשבון במערכת אחרת? הצוות שלנו
            יסייע בכל המעבר ללא תוספת עלות של החבילה השנתית*
          </p>
          <a href="/contact" className="ai-bubble-link" onClick={dismissBubble}>
            לפרטים
          </a>
        </div>
      )}

      {open && (
        <div className="ai-panel">
          <div className="ai-panel-header">
            <span className="ai-panel-avatar">
              <img src={alexAvatar} alt="" />
            </span>
            <span className="ai-panel-title">אלכס, העוזר של שלח מסר</span>
            <button
              type="button"
              className="ai-panel-close"
              onClick={() => setOpen(false)}
              aria-label="סגירת החלון"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {/* TODO: replace the static starter with the real AI chat when ready */}
          <p className="ai-panel-message">
            היי! אני אלכס, העוזר החכם של שלח מסר. במה אפשר לעזור לך היום?
          </p>
          <div className="ai-panel-actions">
            <a href="/contact" className="ai-panel-action">
              מעבר ממערכת אחרת, בחינם
            </a>
            <a href={PANEL_URL} className="ai-panel-action" onClick={openSignup}>
              פתיחת חשבון חינם
            </a>
            <a href="/contact" className="ai-panel-action">
              יש לי שאלה אחרת
            </a>
            <a
              href={WHATSAPP_URL}
              className="ai-panel-action ai-panel-action-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              לשיחה ב-WhatsApp
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        className="ai-avatar"
        onClick={() => setOpen((v) => !v)}
        aria-label="פתיחת צ'אט עם אלכס, העוזר החכם של שלח מסר"
        aria-expanded={open}
      >
        <img src={alexAvatar} alt="" />
      </button>
    </div>
  )
}

export default AIAssistant
