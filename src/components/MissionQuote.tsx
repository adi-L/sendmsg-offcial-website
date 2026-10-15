import React from "react"

import assafPhoto from "../images/assaf-stern.png"
import { useT } from "../locales/LocaleContext"

const MissionQuote: React.FC = () => {
  const t = useT("mission-quote")
  return (
    <section className="section mission-section">
      <div className="container">
        <figure className="mission-quote">
          <svg className="mission-quote-mark" viewBox="0 0 24 24" width="40" height="40" fill="currentColor" aria-hidden="true">
            <path d="M14 21v-7.4C14 8.5 17 5 21.5 4l.5 2c-2.5 1-4 2.5-4 5h4v10h-8zM3 21v-7.4C3 8.5 6 5 10.5 4l.5 2c-2.5 1-4 2.5-4 5h4v10H3z" />
          </svg>
          <blockquote>
            {t.quote}
          </blockquote>
          <img
            className="mission-photo"
            src={assafPhoto}
            alt={t.photoAlt}
            width="96"
            height="96"
            loading="lazy"
          />
          <figcaption>{t.caption}</figcaption>
        </figure>
      </div>
    </section>
  )
}

export default MissionQuote
