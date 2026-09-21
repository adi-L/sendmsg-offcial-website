import React from "react"
import MediaPlaceholder from "./MediaPlaceholder"

const Showcase: React.FC = () => (
  <section className="section showcase-section">
    <div className="container">
      <h2 className="section-title">ככה זה נראה מבפנים</h2>
      <p className="section-subtitle">
        הצצה למערכת ולמה שה-AI מכין בשבילכם.
      </p>

      <div className="showcase-grid">
        <div className="showcase-main">
          <MediaPlaceholder kind="video" ratio="16 / 9" label="סרטון דמו ראשי" />
        </div>
        <MediaPlaceholder kind="image" ratio="4 / 3" label="צילום מסך: עורך הניוזלטרים" />
        <MediaPlaceholder kind="image" ratio="4 / 3" label="צילום מסך: מסע לקוח אוטומטי" />
      </div>
    </div>
  </section>
)

export default Showcase
