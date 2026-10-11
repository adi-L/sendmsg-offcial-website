import React, { useEffect, useRef, useState } from "react"
import { withPrefix } from "gatsby"
import { openSignup } from "./SignupDialog"
import alexAvatar from "../images/alex-avatar.png"
import { useChat } from "./ai/useChat"
import { renderRtlText } from "./ai/renderRtl"

const PANEL_URL = "https://panel.sendmsg.co.il/"
const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=972559377588&text=היי, אולי תוכלו לסייע לי?"
const BUBBLE_KEY = "sendmsg-assistant-bubble-dismissed"

// The agent appends this on its own line when the visitor has shown real
// interest, and the widget turns it into a button. Deciding it agent-side
// rather than by sniffing the reply text keeps the judgement where the
// context is, and keeps it to once per conversation. Kept in sync with the
// rule in the gateway's knowledge/00-identity.md.
const CTA_MARKER = "[[CTA]]"

// The suggestion bubble shows only inside this scroll window,
// so it appears once mid-page and slips away on further scrolling.
const BUBBLE_FROM = 800
const BUBBLE_TO = 2100

// The four links the panel has always shown. They are also the failure
// state: whenever the gateway is unreachable, degraded, or times out, the
// panel must look exactly like today's site, not like something broken.
const FallbackActions: React.FC<{ onPanelLinkClick: (e: React.MouseEvent) => void }> = ({
  onPanelLinkClick,
}) => (
  <div className="ai-panel-actions">
    <a href={withPrefix("/contact")} className="ai-panel-action">
      מעבר ממערכת אחרת, בחינם
    </a>
    <a href={PANEL_URL} className="ai-panel-action" onClick={onPanelLinkClick}>
      פתיחת חשבון חינם
    </a>
    <a href={withPrefix("/contact")} className="ai-panel-action">
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
)

const AIAssistant: React.FC = () => {
  const [inRange, setInRange] = useState(false)
  const [bubbleDismissed, setBubbleDismissed] = useState(true)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState("")

  const avatarRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const challengeHostRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)

  const { phase, messages, notice, retry, send, trackConversion } = useChat()

  // Keep the newest message in view. The log is a fixed 320px box
  // (global.css .ai-chat-log), so without this a reply taller than the box
  // renders below the fold and the visitor sees a mid-sentence fragment with
  // nothing indicating there is more. Depends on `phase` as well as
  // `messages` so the thinking indicator scrolls into view too, rather than
  // animating just off the bottom edge.
  const logRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = logRef.current
    if (!el) return
    // Honour reduced-motion: an animated scroll on every single turn is
    // exactly the movement that setting exists to suppress.
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" })
  }, [messages, phase])

  useEffect(() => {
    if (!sessionStorage.getItem(BUBBLE_KEY)) setBubbleDismissed(false)
    const onScroll = () =>
      setInRange(window.scrollY > BUBBLE_FROM && window.scrollY < BUBBLE_TO)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // First open: connect to the gateway. The hidden challenge host below
  // is where the lazily-loaded Turnstile widget renders its (invisible)
  // flexible challenge.
  useEffect(() => {
    if (open && !startedRef.current && challengeHostRef.current) {
      startedRef.current = true
      void retry(challengeHostRef.current)
    }
  }, [open, retry])

  // The panel keeps focus while it is open.
  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  const dismissBubble = () => {
    setBubbleDismissed(true)
    sessionStorage.setItem(BUBBLE_KEY, "1")
  }

  const closePanel = () => {
    setOpen(false)
    avatarRef.current?.focus()
  }

  // Opening the widget is not a conversion — only an actual departure to
  // the signup flow or to the product (panel.sendmsg.co.il) is.
  const handleAvatarClick = () => {
    setOpen((v) => !v)
  }

  const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") closePanel()
  }

  // This anchor points at panel.sendmsg.co.il and calls openSignup, which
  // intercepts the click (preventDefault) to open the in-page signup modal
  // when the signup widget script has loaded, and otherwise leaves the
  // click to navigate there directly. Track which one actually happened:
  // the modal opening is "signup_click"; the visitor actually leaving the
  // marketing site for the product is "panel_click".
  const handlePanelLinkClick = (e: React.MouseEvent) => {
    openSignup(e)
    trackConversion(e.defaultPrevented ? "signup_click" : "panel_click")
  }

  const handleSend = () => {
    const text = draft.trim()
    if (!text || phase !== "ready") return
    setDraft("")
    void send(text)
  }

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const showBubble = inRange && !bubbleDismissed && !open
  const showFallback = phase === "idle" || phase === "degraded"
  const showChat = phase === "ready" || phase === "thinking"

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
          <a href={withPrefix("/contact")} className="ai-bubble-link" onClick={dismissBubble}>
            לפרטים
          </a>
        </div>
      )}

      {open && (
        <div
          className="ai-panel"
          ref={panelRef}
          tabIndex={-1}
          onKeyDown={handlePanelKeyDown}
        >
          <div className="ai-panel-header">
            <span className="ai-panel-avatar">
              <img src={alexAvatar} alt="" />
            </span>
            <span className="ai-panel-title">שי, העוזר של שלח מסר</span>
            <button
              type="button"
              className="ai-panel-close"
              onClick={closePanel}
              aria-label="סגירת החלון"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Host for the lazily-loaded Turnstile challenge. Positioned
              off-screen with real dimensions (see global.css) rather than
              0x0, so a flexible/managed widget has room to render. */}
          <div ref={challengeHostRef} className="ai-challenge-host" aria-hidden="true" />

          {showFallback && (
            <>
              <p className="ai-panel-message">
                היי! אני שי, העוזר החכם של שלח מסר. במה אפשר לעזור לך היום?
              </p>
              <FallbackActions onPanelLinkClick={handlePanelLinkClick} />
            </>
          )}

          {phase === "starting" && (
            <p className="ai-panel-message" role="status">
              מתחבר/ת לשי…
            </p>
          )}

          {showChat && (
            <div className="ai-chat">
              <p className="ai-chat-notice">
                שי הוא עוזר מבוסס AI, והתשובות שלו הן הכוונה בלבד ואינן התחייבות מחייבת.
              </p>
              <div
                className="ai-chat-log"
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                ref={logRef}
              >
                {messages.map((m, i) => {
                  const isAssistant = m.role === "assistant"
                  const hasCta = isAssistant && m.text.includes(CTA_MARKER)
                  // Strip the marker whether or not we render the button, so a
                  // stray one never reaches the visitor as literal text.
                  const text = isAssistant ? m.text.split(CTA_MARKER).join("").trim() : m.text
                  return (
                    <div
                      key={i}
                      className={
                        m.role === "user" ? "ai-msg ai-msg-user" : "ai-msg ai-msg-assistant"
                      }
                    >
                      {isAssistant ? renderRtlText(text) : text}
                      {hasCta && (
                        <a
                          href={PANEL_URL}
                          className="ai-chat-cta"
                          onClick={handlePanelLinkClick}
                        >
                          פתיחת חשבון חינם
                        </a>
                      )}
                    </div>
                  )
                })}
                {phase === "thinking" && (
                  <div className="ai-typing" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                )}
              </div>
              {notice && (
                <p
                  className="ai-chat-notice"
                  role="status"
                  style={{ margin: "2px 0 6px", textAlign: "center" }}
                >
                  {notice}
                </p>
              )}
              <div className="ai-chat-input">
                <textarea
                  className="ai-chat-textarea"
                  aria-label="כתוב/כתבי הודעה לשי"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  disabled={phase === "thinking"}
                  rows={1}
                />
                <button
                  type="button"
                  className="ai-chat-send"
                  onClick={handleSend}
                  disabled={phase === "thinking" || !draft.trim()}
                  aria-label="שליחת הודעה"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        ref={avatarRef}
        type="button"
        className="ai-avatar"
        onClick={handleAvatarClick}
        aria-label="פתיחת צ'אט עם שי, העוזר החכם של שלח מסר"
        aria-expanded={open}
      >
        <img src={alexAvatar} alt="" />
      </button>
    </div>
  )
}

export default AIAssistant
