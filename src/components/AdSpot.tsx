import React, { useEffect, useRef, useState } from "react"

const VIDEO_ID = "taY1pzs8hWY"

const EMBED_BASE = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}`

// idle: poster before the section is seen
// muted: autoplays silently once the frame enters the viewport
// sound: user clicked, video restarts from the top with audio
type Mode = "idle" | "muted" | "sound"

const AdSpot: React.FC = () => {
  const [mode, setMode] = useState<Mode>("idle")
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mode !== "idle") return
    const el = frameRef.current
    if (!el || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMode((m) => (m === "idle" ? "muted" : m))
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [mode])

  return (
    <section className="section adspot-section">
      <div className="container">
        <h2 className="section-title">הצעה שאי אפשר לסרב לה</h2>
        <p className="section-subtitle">
          דקה אחת של צחוק, שמסבירה בדיוק מה שלח מסר עושה בשבילכם.
        </p>

        <div className="adspot-frame" ref={frameRef}>
          {mode === "sound" ? (
            <iframe
              key="sound"
              src={`${EMBED_BASE}?autoplay=1&mute=0&rel=0&playsinline=1`}
              title="הפרסומת של שלח מסר"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {mode === "muted" ? (
                <iframe
                  key="muted"
                  src={`${EMBED_BASE}?autoplay=1&mute=1&controls=0&rel=0&loop=1&playlist=${VIDEO_ID}&playsinline=1`}
                  title="הפרסומת של שלח מסר"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope"
                  tabIndex={-1}
                />
              ) : (
                <img
                  className="adspot-poster-img"
                  src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                  alt="הפרסומת של שלח מסר"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`
                  }}
                />
              )}
              <button
                type="button"
                className="adspot-poster"
                onClick={() => setMode("sound")}
                aria-label="הפעלת הפרסומת של שלח מסר עם סאונד"
              >
                <span className="adspot-play">
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
                    <polygon points="8,5 19,12 8,19" />
                  </svg>
                </span>
                {mode === "muted" && (
                  <span className="adspot-sound-label">לצפייה עם סאונד</span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default AdSpot
