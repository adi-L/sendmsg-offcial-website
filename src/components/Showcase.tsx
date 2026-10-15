import React from "react"
import MediaPlaceholder from "./MediaPlaceholder"
import { useT } from "../locales/LocaleContext"

/* One slot, not three. A dashed placeholder reads as "asset coming here";
   three in a grid read as a gallery that failed to load. When the real
   screenshots exist they can come back -- until then the section promises
   one look inside and shows one. */
const Showcase: React.FC = () => {
  const t = useT("showcase")
  return (
    <section className="section showcase-section">
      <div className="container">
        <h2 className="section-title">{t.title}</h2>
        <p className="section-subtitle">
          {t.subtitle}
        </p>

        <div className="showcase-media">
          <MediaPlaceholder
            kind="video"
            ratio="16 / 9"
            label={t.videoLabel}
          />
        </div>
      </div>
    </section>
  )
}

export default Showcase
