import React, { useEffect, useRef, useState } from "react"
import worldMap from "../images/illustrations/world-map.png"

// Israel, read off the map's own geometry: the dot lattice puts 34.9°E at
// x=584, and Africa's Mediterranean coastline begins at y≈296.
const ORIGIN = { x: 584, y: 288 }

// Every route lands on a logo badge already printed on the artwork, so the
// motion explains the map that is there rather than decorating it.
const ROUTES = [
  { id: "na-north", d: "M584 288Q408.1 161.8 199.7 220.1", x: 199.7, y: 220.1 },
  { id: "na-south", d: "M584 288Q387.1 187.3 185.4 277.9", x: 185.4, y: 277.9 },
  { id: "sa", d: "M584 288Q407.9 256.7 273.3 374.6", x: 273.3, y: 374.6 },
  { id: "africa", d: "M584 288Q526.1 340 530.4 417.7", x: 530.4, y: 417.7 },
  { id: "levant", d: "M584 288Q621.3 250.4 617.3 203.8", x: 617.3, y: 203.8 },
]

const STAGGER = 0.6

const GlobalReach: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  // the loop only runs while the map is on screen
  useEffect(() => {
    const el = mapRef.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      setLive(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { rootMargin: "80px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="section" style={styles.section}>
      <div className="container" style={styles.container}>
        <h2 className="section-title" style={{ color: "#fff" }}>
          התחלנו בישראל ב-2009,
          <br />
          והיום צומחים איתנו עסקים <span style={styles.highlight}>גם בעולם</span>
        </h2>
        <p style={styles.subtitle}>
          למעלה מ-50 אלף משתמשים כבר עושים שיווק נכון עם שלח מסר
        </p>

        <div
          ref={mapRef}
          className={`reach-map${live ? " is-live" : ""}`}
          style={styles.mapWrapper}
        >
          <img
            src={worldMap}
            alt="מפת הפעילות העולמית של שלח מסר"
            style={styles.mapImg}
          />
          <svg
            className="reach-routes"
            viewBox="0 0 1024 566"
            aria-hidden="true"
            focusable="false"
          >
            {/* the broadcast: one slow ring crossing the whole field */}
            <circle className="reach-sonar" cx={ORIGIN.x} cy={ORIGIN.y} r="10" />
            <circle
              className="reach-sonar"
              cx={ORIGIN.x}
              cy={ORIGIN.y}
              r="10"
              style={{ animationDelay: "3.5s" }}
            />

            {ROUTES.map((r, i) => (
              <g key={r.id}>
                <path
                  className="reach-trail"
                  d={r.d}
                  pathLength={100}
                  style={{ animationDelay: `${i * STAGGER}s` }}
                />
                <path
                  className="reach-comet-glow"
                  d={r.d}
                  pathLength={100}
                  style={{ animationDelay: `${i * STAGGER}s` }}
                />
                <path
                  className="reach-comet"
                  d={r.d}
                  pathLength={100}
                  style={{ animationDelay: `${i * STAGGER}s` }}
                />
                <circle
                  className="reach-arrival"
                  cx={r.x}
                  cy={r.y}
                  r="7"
                  style={{ animationDelay: `${i * STAGGER}s` }}
                />
                <circle className="reach-pin" cx={r.x} cy={r.y} r="5" />
              </g>
            ))}

            <circle className="reach-origin-halo" cx={ORIGIN.x} cy={ORIGIN.y} r="14" />
            <circle className="reach-origin" cx={ORIGIN.x} cy={ORIGIN.y} r="6" />
          </svg>
        </div>
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "var(--bg-dark)",
    overflow: "hidden",
  },
  container: {
    textAlign: "center",
  },
  highlight: {
    color: "#c77dff",
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "1.2rem",
    marginTop: "12px",
  },
  mapWrapper: {
    maxWidth: "800px",
    margin: "40px auto 0",
  },
  mapImg: {
    width: "100%",
    height: "auto",
  },
}

export default GlobalReach
