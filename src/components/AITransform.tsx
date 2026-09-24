import React from "react"
import MediaPlaceholder from "./MediaPlaceholder"

/* Four identical ticks said the same thing four times. Each point gets the
   mark that describes it instead: the AI sparkle carried over from the hero,
   a branching path, a two-way link, and -- for the Hebrew point -- an alef
   set in the page's own face, which says it better than a flag would. */
const points = [
  {
    title: "AI שלומד את העסק",
    text: "המערכת מכירה את התחום, הקהל והטון שלכם, ויוצרת תוכן שמתאים בדיוק לעסק.",
    lead: true,
    mark: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.2l2 5.3 5.3 2-5.3 2-2 5.3-2-5.3-5.3-2 5.3-2z" />
        <path d="M18.6 16.2l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
      </svg>
    ),
  },
  {
    title: "מסעות לקוח אוטומטיים",
    text: "קשר רציף עם לידים ולקוחות לאורך כל מחזור החיים, בלי עבודה ידנית.",
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
    title: "מתחבר למערכות שלכם",
    text: "חיבורים, Webhooks ו-API מרכזים את התקשורת השיווקית סביב הכלים שכבר יש לכם בעסק.",
    mark: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h12l-2.6-2.8" />
        <path d="M20 15H8l2.6 2.8" />
      </svg>
    ),
  },
  {
    title: "בעברית, לשוק הישראלי",
    text: "מותאם לשפה, לחוק ולהתנהגות של לקוחות בישראל, כולל פתרון מלא לשומרי שבת וחג.",
    mark: <span className="transform-alef">א</span>,
  },
]

const AITransform: React.FC = () => (
  <section className="section transform-section">
    <div className="container">
      <h2 className="section-title">תנו ל-AI לעשות את העבודה  </h2>
      <p className="section-subtitle">
        המערכת לומדת את העסק שלכם, כותבת, מעצבת ומנהלת קמפיינים ומסעות
        לקוח מקצה לקצה. אתם פנויים להתרכז במה שאתם באמת טובים.
      </p>

      <div className="transform-grid">
        <ul className="transform-list">
          {points.map((p) => (
            <li
              key={p.title}
              className={`transform-item${p.lead ? " transform-item--lead" : ""}`}
            >
              <span className="transform-mark">{p.mark}</span>
              <div>
                <h3 className="transform-item-title">{p.title}</h3>
                <p className="transform-item-text">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="transform-media">
          <MediaPlaceholder
            kind="video"
            ratio="4 / 3"
            label="כאן ייכנס סרטון: ה-AI בונה קמפיין"
          />
        </div>
      </div>
    </div>
  </section>
)

export default AITransform
