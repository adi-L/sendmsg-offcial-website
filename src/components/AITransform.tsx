import React from "react"
import MediaPlaceholder from "./MediaPlaceholder"

const points = [
  {
    title: "AI שלומד את העסק",
    text: "המערכת מכירה את התחום, הקהל והטון שלכם, ויוצרת תוכן שמתאים בדיוק לעסק.",
  },
  {
    title: "מסעות לקוח אוטומטיים",
    text: "קשר רציף עם לידים ולקוחות לאורך כל מחזור החיים, בלי עבודה ידנית.",
  },
  {
    title: "מתחבר למערכות שלכם",
    text: "חיבורים, Webhooks ו-API מרכזים את התקשורת השיווקית סביב הכלים שכבר יש לכם בעסק.",
  },
  {
    title: "בעברית, לשוק הישראלי",
    text: "מותאם לשפה, לחוק ולהתנהגות של לקוחות בישראל, כולל פתרון מלא לשומרי שבת וחג.",
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
            <li key={p.title} className="transform-item">
              <span className="transform-check">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
              </span>
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
