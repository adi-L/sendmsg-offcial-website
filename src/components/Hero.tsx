import React, { useState, useEffect, useRef } from "react"
import { withPrefix } from "gatsby"
import TextTransition from "react-text-transition"
import { openSignup } from "./SignupDialog"

const PANEL_URL = "https://panel.sendmsg.co.il/"

const rotatingTexts = ["פשוט יותר.", "חכם יותר.", "אישי יותר.", "אוטומטי יותר."]

const featureItems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#16324f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="22,7 12,13 2,7" />
      </svg>
    ),
    label: "קמפיינים וניוזלטרים",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#16324f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#16324f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    label: "יצירת דפי נחיתה",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#16324f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    label: "מועדון לקוחות (CRM)",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#16324f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    label: "מערכת קורסים",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#16324f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    label: "פגישות ושיתופי פעולה",
  },
]

const Hero: React.FC = () => {
  const [textIndex, setTextIndex] = useState(0)
  // Mounted only on desktop so mobile never downloads the mp4
  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 769px)")
    const update = () => setShowVideo(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

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
                <TextTransition
                  direction="up"
                  inline
                  springConfig={{ mass: 1, tension: 170, friction: 24 }}
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

          <div className="hero-features-grid">
            {featureItems.map((item) => (
              <div key={item.label} className="hero-feature-item">
                <span className="hero-feature-icon">{item.icon}</span>
                <span className="hero-feature-label">{item.label}</span>
              </div>
            ))}
          </div>

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

        {/* Video, left side in RTL; desktop only */}
        <div className="hero-video">
          {showVideo && (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="hero-video-player"
            >
              <source src={withPrefix("/hero-ai-e7ecf4.mp4")} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
