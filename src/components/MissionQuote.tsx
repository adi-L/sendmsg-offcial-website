import React from "react"

import assafPhoto from "../images/assaf-stern.png"

const MissionQuote: React.FC = () => (
  <section className="section mission-section">
    <div className="container">
      <figure className="mission-quote">
        <svg className="mission-quote-mark" viewBox="0 0 24 24" width="40" height="40" fill="currentColor" aria-hidden="true">
          <path d="M14 21v-7.4C14 8.5 17 5 21.5 4l.5 2c-2.5 1-4 2.5-4 5h4v10h-8zM3 21v-7.4C3 8.5 6 5 10.5 4l.5 2c-2.5 1-4 2.5-4 5h4v10H3z" />
        </svg>
        <blockquote>
          אנחנו מאמינים שלכל בעל עסק יש ערך ייחודי לתת לעולם, ושום מכשול
          טכנולוגי או שיווקי לא צריך לעמוד בדרך של החופש שלו לצמוח
          ולהצליח.
        </blockquote>
        <img
          className="mission-photo"
          src={assafPhoto}
          alt="אסף שטרן"
          width="96"
          height="96"
          loading="lazy"
        />
        <figcaption>אסף שטרן, מייסד שלח מסר</figcaption>
      </figure>
    </div>
  </section>
)

export default MissionQuote
