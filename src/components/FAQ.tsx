import React, { useState } from "react"

const faqs = [
  {
    q: "על איזה רקע טכנולוגי המערכת בנויה?",
    a: "המערכת בנויה על תשתית ענן מתקדמת עם שרתים ייעודיים ברחבי העולם, כך שהמיילים שלכם מגיעים מהר ובאמינות גבוהה.",
  },
  {
    q: "איך אני בונה את רשימת הלקוחות שלי?",
    a: "ניתן לייבא רשימות קיימות מאקסל, להוסיף טפסי הרשמה לאתר שלכם, ליצור דפי נחיתה עם טפסים מובנים, או לחבר את המערכת ל-CRM שלכם.",
  },
  {
    q: "מה ייחודי במערכת שלח מסר?",
    a: "שלח מסר היא מערכת All-in-One ישראלית הכוללת דיוור, SMS, דפי נחיתה, קורסים דיגיטליים ו-CRM, הכל במקום אחד. בנוסף, אנחנו המערכת היחידה בעולם עם מצב שומר שבת.",
  },
  {
    q: "האם יש הגבלה על דפי נחיתה?",
    a: "בחבילה החינמית ניתן ליצור עד 5 דפי נחיתה. בחבילות המשודרגות אין הגבלה על כמות דפי הנחיתה.",
  },
  {
    q: "האם הניוזלטרים מותאמים לנייד?",
    a: "כן! כל הניוזלטרים, דפי הנחיתה והקורסים שנבנים במערכת מותאמים אוטומטית לכל סוגי המסכים, מובייל, טאבלט ומחשב.",
  },
  {
    q: "מה זה מצב שומר שבת?",
    a: "תכונה ייחודית שחוסמת אתרים וקורסים בשבת וחג, מעכבת דיוורים מתוזמנים, מציגה תאריכים עבריים ועוד, מותאם במיוחד לקהל שומר מסורת.",
  },
  {
    q: "האם יש תוכנית שותפים?",
    a: "כן, תוכנית השותפים שלנו מאפשרת להרוויח עמלה על כל לקוח שאתם מפנים. צרו קשר לפרטים נוספים.",
  },
  {
    q: "איך אני מתחיל?",
    a: "פשוט נרשמים בחינם, ללא כרטיס אשראי, ללא התחייבות. תוך דקות אתם יכולים לשלוח את הניוזלטר הראשון שלכם.",
  },
]

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="section" style={styles.section}>
      <div className="container" style={styles.container}>
        <h2 className="section-title">
          שאלות <span className="gradient-text">נפוצות</span>
        </h2>

        <div style={styles.list}>
          {faqs.map((faq, i) => (
            <div key={i} style={styles.item}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={styles.question}
              >
                <span>{faq.q}</span>
                <span style={{
                  ...styles.arrow,
                  transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                }}>
                  ▾
                </span>
              </button>
              {openIndex === i && (
                <div style={styles.answer}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "var(--bg-soft)",
  },
  container: {
    maxWidth: "800px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "40px",
  },
  item: {
    background: "#fff",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-color)",
    overflow: "hidden",
  },
  question: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 24px",
    fontSize: "1.05rem",
    fontWeight: 600,
    textAlign: "right",
    color: "var(--text-dark)",
    background: "transparent",
    cursor: "pointer",
    border: "none",
    fontFamily: "inherit",
    gap: "16px",
  },
  arrow: {
    fontSize: "1.2rem",
    transition: "transform 0.2s",
    flexShrink: 0,
    color: "var(--primary-pink)",
  },
  answer: {
    padding: "0 24px 18px",
    fontSize: "0.95rem",
    color: "var(--text-gray)",
    lineHeight: 1.7,
  },
}

export default FAQ
