import React from "react"

const features = [
  {
    title: "אחוזי פתיחה, הקלקות ומטרות",
    desc: "כמה לקוחות פתחו את האימייל שלך, האם הם הקליקו על הקישור שהטמעת בו והאם זה הוביל למכירה.",
  },
  {
    title: "שעות שיא למשלוח אימייל",
    desc: "המערכת שלנו תעזור לך להבין באיזה יום ושעה נשיג את אחוזי הפתיחה והלידים הגבוהים ביותר.",
  },
  {
    title: "התראות על הצטרפות",
    desc: "נקבל התראות על הצטרפות של לקוחות כך שנוכל לעקוב או ליצור קשר עם ליד חם שהתעניין בשירות שלך.",
  },
  {
    title: "מפות חום",
    desc: 'ניתן "לעקוב" אחר הלקוחות, לראות איזה קישורים הכי נצפים ואיפה הם התעכבו כדי לשפר ולהשתפר.',
  },
  {
    title: "קישורים מועדפים",
    desc: "נעקוב אחר הקלקות על קישורים שכל נמען לחץ במייל או במסרון וליצור קשר להצעה חמה.",
  },
  {
    title: "שתף את זה הלאה",
    desc: "נוכל לדעת איזה ניוזלטרים הועברו הלאה וללמוד על הוויראליות של הדיוורים שלכם.",
  },
]

const Features: React.FC = () => (
  <section className="section" style={styles.section}>
    <div className="container">
      <h2 style={styles.heading}>
        המיילים שלך מנותחים באמצעות
        <br />
        מערכת סטטיסטיקה מתקדמת!
      </h2>
      <div style={styles.divider} />

      <div className="features-grid">
        {features.map((f) => (
          <div key={f.title} style={styles.card}>
            <h3 style={styles.cardTitle}>{f.title}</h3>
            <p style={styles.cardDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "#fff",
  },
  heading: {
    fontSize: "2.4rem",
    fontWeight: 800,
    textAlign: "center",
    marginBottom: "16px",
    lineHeight: 1.4,
  },
  divider: {
    width: "40px",
    height: "3px",
    background: "var(--primary-pink)",
    margin: "16px auto 48px",
    borderRadius: "2px",
  },
  card: {
    textAlign: "right",
    padding: "0 8px",
  },
  cardTitle: {
    fontSize: "1.15rem",
    fontWeight: 800,
    marginBottom: "12px",
    color: "var(--text-dark)",
  },
  cardDesc: {
    fontSize: "0.92rem",
    color: "var(--text-gray)",
    lineHeight: 1.7,
  },
}

export default Features
