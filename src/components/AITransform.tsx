import React from "react"
import MediaPlaceholder from "./MediaPlaceholder"
import { useT } from "../locales/LocaleContext"

/* Four identical ticks said the same thing four times. Each point gets the
   mark that describes it instead: the AI sparkle carried over from the hero,
   a branching path, a two-way link, and -- for the Hebrew point -- an alef
   set in the page's own face, which says it better than a flag would. */
/* Icons for the points; their text is `points` in ai-transform.json, in order. */
const points = [
  {
    lead: true,
    mark: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.2l2 5.3 5.3 2-5.3 2-2 5.3-2-5.3-5.3-2 5.3-2z" />
        <path d="M18.6 16.2l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
      </svg>
    ),
  },
  {
    mark: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4v6a4 4 0 0 0 4 4h6" />
        <path d="M5 20v-2a4 4 0 0 1 4-4h2" />
        <circle cx="5" cy="3.4" r="1.6" />
        <circle cx="18.4" cy="14" r="1.6" />
        <circle cx="12.4" cy="14" r="1.6" />
      </svg>
    ),
  },
  {
    mark: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h12l-2.6-2.8" />
        <path d="M20 15H8l2.6 2.8" />
      </svg>
    ),
  },
  {
    // the Hebrew letter, as text: alefMark in ai-transform.json
    mark: null,
  },
]

const AITransform: React.FC = () => {
  const t = useT("ai-transform")
  return (
    <section className="section transform-section">
      <div className="container">
        <h2 className="section-title">{t.title}</h2>
        <p className="section-subtitle">
          {t.subtitle}
        </p>

        <div className="transform-grid">
          <ul className="transform-list">
            {points.map((p, i) => (
              <li
                key={t.points[i].title}
                className={`transform-item${p.lead ? " transform-item--lead" : ""}`}
              >
                <span className="transform-mark">
                  {p.mark ?? <span className="transform-alef">{t.alefMark}</span>}
                </span>
                <div>
                  <h3 className="transform-item-title">{t.points[i].title}</h3>
                  <p className="transform-item-text">{t.points[i].text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="transform-media">
            <MediaPlaceholder
              kind="video"
              ratio="4 / 3"
              label={t.videoLabel}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AITransform
