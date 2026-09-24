import React, { useState, useEffect } from "react"
import TextTransition from "react-text-transition"
import { openSignup } from "./SignupDialog"
import heroPerson from "../images/hero-person.webp"

const PANEL_URL = "https://panel.sendmsg.co.il/"

const rotatingTexts = ["פשוט יותר.", "חכם יותר.", "אישי יותר.", "אוטומטי יותר."]

const featureItems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="22,7 12,13 2,7" />
      </svg>
    ),
    label: "קמפיינים וניוזלטרים",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: "מערכת SMS",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    label: "יצירת דפי נחיתה",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    label: "מועדון לקוחות (CRM)",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    label: "מערכת קורסים",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    label: "פגישות ושיתופי פעולה",
  },
]

/* The work the system does while he stands there: each card is one thing
   that already happened, not a feature name. Four, clustered tight around
   the laptop -- spread across the whole figure they read as clutter. */
const orbitCards = [
  {
    id: "ai",
    tone: "violet",
    title: "ה-AI כתב את הקמפיין",
    meta: "3 גרסאות, 40 שניות",
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.2l2 5.3 5.3 2-5.3 2-2 5.3-2-5.3-5.3-2 5.3-2z" />
        <path d="M18.6 16.2l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
      </svg>
    ),
  },
  {
    id: "mail",
    tone: "green",
    title: "הדיוור נשלח",
    meta: "2,480 נמענים",
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
  {
    id: "deal",
    tone: "pink",
    title: "עסקה נסגרה",
    meta: "דנה כהן · ₪1,240",
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-7-7A2 2 0 0 1 3 12.2V5a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6l7 7a2 2 0 0 1 0 2.8z" />
        <circle cx="7.8" cy="7.8" r="1.3" />
      </svg>
    ),
  },
  {
    id: "sms",
    tone: "blue",
    title: "SMS נמסר",
    meta: "98.4% מסירה",
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 14a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

const Hero: React.FC = () => {
  const [textIndex, setTextIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingTexts.length)
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="hero-section">
      <div className="container hero-row">
        {/* Text content, right side in RTL */}
        <div className="hero-text">
          <h1 className="hero-headline">
            שיווק העסק שלך,
            <span className="hero-rotate">
              <span className="hero-rotate-word">
                {/* Slightly overdamped: at display size a slow spring keeps
                    three words inked at once and they smear over each other. */}
                <TextTransition
                  direction="up"
                  inline
                  springConfig={{ mass: 1, tension: 300, friction: 38 }}
                >
                  {rotatingTexts[textIndex]}
                </TextTransition>
              </span>
            </span>
          </h1>

          <p className="hero-subtitle">
            מערכת הדיוור והשיווק הישראלית, עכשיו עם AI שכותב, מעצב
            ובונה בשבילך קמפיינים, ניוזלטרים ודפי נחיתה בתוך דקות.
          </p>
          <p className="hero-tagline">כל הפתרונות במקום אחד.</p>

          <a href={PANEL_URL} className="hero-cta" onClick={openSignup}>
            <span className="hero-cta-arrow">←</span>
            פתיחת חשבון חינם
          </a>

          <p className="hero-cta-note">
            הצטרפו ל-<strong>1,165</strong> עסקים שנרשמו השבוע
          </p>

          <div className="hero-trust">
            <span>✓ ללא כרטיס אשראי</span>
            <span>✓ ללא התחייבות</span>
            <span>✓ ללא הגבלת זמן</span>
          </div>
        </div>

        {/* Portrait, left side in RTL. Decorative: the headline beside it
            carries the meaning, so the whole composition -- portrait and the
            status cards orbiting it -- stays out of the reading order. */}
        <div className="hero-portrait" aria-hidden="true">
          <img
            className="hero-portrait-img"
            src={heroPerson}
            alt=""
            width={1100}
            height={1152}
            loading="eager"
            decoding="async"
          />

          {orbitCards.map((card) => (
            <span key={card.id} className={`hero-orb hero-orb--${card.id}`}>
              <span className={`hero-orb-icon hero-orb-icon--${card.tone}`}>
                {card.icon}
              </span>
              <span className="hero-orb-text">
                <b>{card.title}</b>
                <i>{card.meta}</i>
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="hero-rail">
          {featureItems.map((item) => (
            <div key={item.label} className="hero-feature-item">
              <span className="hero-feature-icon">{item.icon}</span>
              <span className="hero-feature-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
