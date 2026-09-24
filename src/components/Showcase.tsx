import React from "react"
import MediaPlaceholder from "./MediaPlaceholder"

/* One slot, not three. A dashed placeholder reads as "asset coming here";
   three in a grid read as a gallery that failed to load. When the real
   screenshots exist they can come back -- until then the section promises
   one look inside and shows one. */
const Showcase: React.FC = () => (
  <section className="section showcase-section">
    <div className="container">
      <h2 className="section-title">ככה זה נראה מבפנים</h2>
      <p className="section-subtitle">
        הצצה למערכת ולמה שה-AI מכין בשבילכם.
      </p>

      <div className="showcase-media">
        <MediaPlaceholder
          kind="video"
          ratio="16 / 9"
          label="סרטון דמו: סיור במערכת"
        />
      </div>
    </div>
  </section>
)

export default Showcase
