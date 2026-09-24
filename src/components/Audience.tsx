import React, { useCallback, useEffect, useRef, useState } from "react"

import smallBusiness from "../images/audience/small-business.webp"
import courseOwners from "../images/audience/course-owners.webp"
import organizations from "../images/audience/organizations.webp"
import startups from "../images/audience/startups.webp"
import institutions from "../images/audience/institutions.webp"

const audiences = [
  { title: "עסקים קטנים", img: smallBusiness },
  { title: "בעלי קורסים", img: courseOwners },
  { title: "ארגונים", img: organizations },
  { title: "סטארטאפים", img: startups },
  { title: "מוסדות ועמותות", img: institutions },
]

const centeredIndex = (t: HTMLElement): number => {
  const items = Array.from(t.querySelectorAll<HTMLElement>(".audience-item"))
  const tRect = t.getBoundingClientRect()
  const tCenter = tRect.left + tRect.width / 2
  let closest = 0
  let best = Infinity
  items.forEach((el, i) => {
    const r = el.getBoundingClientRect()
    const d = Math.abs(r.left + r.width / 2 - tCenter)
    if (d < best) {
      best = d
      closest = i
    }
  })
  return closest
}

const Audience: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null)
  const snapTimer = useRef<number>()
  const [scrollable, setScrollable] = useState(false)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const update = useCallback(() => {
    const t = trackRef.current
    if (!t) return
    setScrollable(t.scrollWidth - t.clientWidth > 4)
    const i = centeredIndex(t)
    const count = t.querySelectorAll(".audience-item").length
    setAtStart(i === 0)
    setAtEnd(i === count - 1)
  }, [])

  useEffect(() => {
    update()
    // re-measure after the browser applies the initial snap position
    const settle = window.setTimeout(update, 300)
    window.addEventListener("resize", update)
    return () => {
      window.clearTimeout(settle)
      window.removeEventListener("resize", update)
    }
  }, [update])

  // dir 1 = next item in list order. Chrome clamps smooth native scrolls in
  // RTL containers, so animate scrollLeft by hand (works in both directions).
  const scrollStep = (dir: 1 | -1) => {
    const t = trackRef.current
    if (!t) return
    const items = Array.from(t.querySelectorAll<HTMLElement>(".audience-item"))
    const tRect = t.getBoundingClientRect()
    const tCenter = tRect.left + tRect.width / 2
    const closest = centeredIndex(t)
    const target = Math.min(items.length - 1, Math.max(0, closest + dir))
    const r = items[target].getBoundingClientRect()
    const dist = r.left + r.width / 2 - tCenter
    if (Math.abs(dist) < 1) return

    // pause snapping while animating so it can't cancel the animation
    t.classList.add("no-snap")
    window.clearTimeout(snapTimer.current)
    snapTimer.current = window.setTimeout(() => t.classList.remove("no-snap"), 450)

    const start = t.scrollLeft
    const t0 = performance.now()
    const dur = 350
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / dur)
      const ease = 1 - Math.pow(1 - p, 3)
      t.scrollLeft = start + dist * ease
      if (p < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  return (
    <section className="section" style={styles.section}>
      <div className="container" style={styles.container}>
        <h2 style={styles.heading}>למי המערכת שלנו מתאימה?</h2>
        <div style={styles.divider} />

        <p style={styles.subtitle}>
          שיווק באמצעות שלח מסר מתאים לכל מי שמכיר בחשיבות של שיווק
          נכון ומדויק ללקוחות שלו, אבל בעיקר ל:
        </p>

        <div className="audience-carousel">
          {scrollable && (
            <button
              type="button"
              className="audience-arrow"
              onClick={() => scrollStep(-1)}
              disabled={atStart}
              aria-label="הקודם"
            >
              ‹
            </button>
          )}

          <div
            ref={trackRef}
            className={`audience-track${scrollable ? "" : " is-static"}`}
            onScroll={update}
          >
            {audiences.map((a) => (
              <div key={a.title} className="audience-item">
                <img src={a.img} alt="" style={styles.image} />
                <h3 style={styles.title}>{a.title}</h3>
              </div>
            ))}
          </div>

          {scrollable && (
            <button
              type="button"
              className="audience-arrow"
              onClick={() => scrollStep(1)}
              disabled={atEnd}
              aria-label="הבא"
            >
              ›
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "var(--bg-soft)",
  },
  container: {
    textAlign: "center",
  },
  heading: {
    fontSize: "2.4rem",
    fontWeight: 800,
    marginBottom: "16px",
  },
  divider: {
    width: "60px",
    height: "3px",
    background: "var(--primary-pink)",
    margin: "0 auto 32px",
    borderRadius: "2px",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "var(--text-gray)",
    lineHeight: 1.8,
    marginBottom: "48px",
    maxWidth: "640px",
    marginInline: "auto",
    textWrap: "balance",
  } as React.CSSProperties,
  image: {
    width: "160px",
    height: "auto",
    filter: "drop-shadow(0 14px 10px rgba(22, 50, 79, 0.18))",
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--ink)",
  },
}

export default Audience
