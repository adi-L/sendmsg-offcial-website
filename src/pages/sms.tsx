import React, { useState } from "react"
import { Link } from "gatsby"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/sms.css"

/* Copy is the live SMS page's own. Where it names the virtual number
   or the message banks, this page links to ours instead of to the
   live site. */

const BUY_NUMBER_URL =
  "https://panel.sendmsg.co.il/PurchaseSms.aspx?cat=113#selectedPackege"

/* The nine things the live page lists under its headline */
const capabilities = [
  "הודעות קצרות וארוכות במחירים מדהימים",
  "מודול אוטומטי ליצירת קישורים מקוצרים",
  "אפשרות למספר וירטואלי הכולל אוטומציות והסרה אוטומטית בהשב",
  "שליחת המסרונים בפולסים של X הודעות כל Y דקות",
  "שליחת הודעות לפי קבוצות דיוור ופילוח משתמשים בודדים",
  "מערכת צ׳אט פנימית של הודעות וואטסאפ מול הלקוחות",
  "אוטומציות לפי מקליקים",
  "תצוגת סטטיסטיקות של אחוז הקלקות על קישורים",
  "שילוב אימוג׳ים בתוכן ההודעה",
]

/* The live page's five questions and their answers, verbatim */
const faqs = [
  {
    id: "uses",
    q: "לאיזה שימושים מתאים שיווק ב-SMS?",
    a: [
      "SMS מתאים במיוחד לתזכורות, מבצעים, הנעה לפעולה מיידית, עדכוני סטטוס הזמנות, אימות כניסה (OTP) והפניית תשומת לב לקמפיין מייל שנשלח במקביל. כל הגופים הגדולים במשק משתמשים בשיווק במסרונים, וזה לא מקרי.",
    ],
  },
  {
    id: "package",
    q: "איך בוחרים את חבילת ה-SMS הנכונה?",
    a: [
      "חבילות המסרונים נחלקות לפי כמות תווים להודעה: 70, 140 או 210 תווים. מומלץ לנסח טיוטת הודעה טיפוסית, לבדוק את כמות התווים בפועל (כולל תווים בקישורים), ולהתאים את המסלול לפי אורך ההודעה ומספר המנויים.",
    ],
  },
  {
    id: "auto",
    q: "האם ניתן לשלוח הודעות אוטומטיות ב-SMS?",
    a: [
      "כן. ניתן לשלוח הודעות מבוססות תאריך, כמו ברכות יום הולדת או תזכורות לסיום חוזה.",
      "עם מספר וירטואלי ניתן גם להגדיר אוטומציות מלאות. לדוגמה, מנוי שמשיב מילת מפתח מסוימת עובר אוטומטית לקבוצת דיוור רלוונטית ומקבל סדרת הודעות בהתאם.",
    ],
  },
  {
    id: "shortlink",
    q: "מה זה קישור מקוצר ולמה כדאי להשתמש בו במסרונים?",
    a: [
      "קישור מקוצר הוא גרסה קצרה של כתובת URL ארוכה. במקום להדביק קישור מלא שאוכל עשרות תווים בהודעה, המערכת מייצרת קישור קצר שמפנה לאותו יעד.",
      "זה חוסך תווים יקרים ומאפשר לכתוב הודעה ארוכה יותר באותה חבילה.",
      "בנוסף, לקישור המקוצר במערכת שלח מסר ניתן להגדיר הגבלת כמות לחיצות, תוקף עד תאריך מסוים, הפניה לדף חלופי לאחר פקיעה, ושיוך אוטומטי של המקליק לקבוצת דיוור, כולל דוח סטטיסטיקות הקלקות בזמן אמת.",
    ],
  },
  {
    id: "failed",
    q: "הודעה שנכשלת בשליחה, יורדת מהחבילה?",
    a: [
      "לא. הודעות שנכשלו בשליחה אינן נספרות ואינן יורדות מיתרת החבילה. ניתן לעקוב אחרי סטטוס כל שליחה בלשונית ״הודעות שנשלחו״, כולל כמה הגיעו בהצלחה וכמה נכשלו ומדוע.",
    ],
  },
]

const PlusIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path className="sm-plus-v" d="M12 4v16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const SmsPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Layout>
      <div className="sm">
        <section className="sm-hero">
          <div className="container">
            <h1>מערכת לשליחת סמסים</h1>
            <p className="sm-hero-sub">
              היום כל מנהל שיווק מיומן יודע ששיווק חייב לכלול שליחת הודעות
              בסמסים, ועם כמה שמדובר בטכנולוגיה וותיקה, כל הגופים הגדולים במשק
              משתמשים בה.
            </p>
            <p className="sm-hero-note">
              כדי שתכירו אותנו טוב, תוכלו להירשם כבר עכשיו, להעלות עד 250 נמענים
              ו-5 סמסים בחינם לבדיקות.
            </p>
            <a href={PANEL_URL} className="sm-btn sm-btn-accent" onClick={openSignup}>
              פתיחת חשבון בחינם
            </a>
          </div>
        </section>

        {/* Two paragraphs that argue one point, so they run as text
            rather than sitting in boxes pretending to be separate. */}
        <section className="sm-why">
          <div className="container">
            <div className="sm-why-split">
              <h2>למה סמס</h2>
              <div className="sm-why-body">
                <p>
                  השיווק בסמסים מתאים לתזכורות, מבצעים, הנעה לפעולה מיידית,
                  הפניית תשומת לב למייל שנשלח, עדכון סטטוס הזמנות, כניסה למנויים
                  על ידי אימות (OTP) ועוד.
                </p>
                <p>
                  מומחי שיווק, רשתות ועסקים וותיקים קבעו לא פעם שמערכת הסמסים של
                  שלח מסר קלה מאוד לשימוש, מתקדמת, עם מגוון אוטומציות באמצעות
                  קישורים מקוצרים, מספר וירטואלי ואפשרויות התממשקות למערכות
                  חיצוניות.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="sm-caps">
          <div className="container">
            <div className="sm-head">
              <h2>
                להגדיל את המכירות בזכות שליחת סמסים, עם מערכת SMS המתקדמת ביותר
                בשוק
              </h2>
            </div>
            <ul className="sm-cap-list">
              {capabilities.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* The virtual number is a product of its own, so the block
            states its price and hands off to its page rather than
            repeating that page here. */}
        <section className="sm-vn">
          <div className="container">
            <div className="sm-vn-split">
              <div className="sm-vn-text">
                <h2>אפשרות להוספת מספר וירטואלי</h2>
                <p>
                  מספר וירטואלי מאפשר לשלוח הודעות ממספר שמתחיל ב-
                  <span className="sm-ltr">055</span>. כל ההודעות החוזרות של
                  הנמענים מגיעות למערכת, ומתרכזות ברשימה שניתן לייצא.
                </p>
                <p>
                  זאת בניגוד למצבים בהם השולח הוא מספר נייח או שם העסק, שלא
                  מאפשר שליחה בהודעה חוזרת, או מספר הנייד שלכם, מה שמערבב את
                  ההודעות מהנמענים עם הודעות פרטיות שמגיעות אליכם למכשיר.
                </p>
                <p>
                  בנוסף, מספר וירטואלי מאפשר אוטומציה של הסרה בהודעה חוזרת, שיוך
                  אוטומטי לקבוצות על ידי כתיבת ביטוי נבחר בהודעה חוזרת, אישורי
                  הגעה, סקרים, חידונים ועוד.
                </p>
              </div>

              <div className="sm-vn-offer">
                <p className="sm-vn-label">עלות לשנה</p>
                <p className="sm-vn-price">
                  <span className="sm-vn-cur" aria-hidden="true">₪</span>
                  <span className="sm-vn-num">118</span>
                  <span className="sm-sr">118 שקלים</span>
                </p>
                <p className="sm-vn-terms">לא כולל מע״מ</p>
                <a href={BUY_NUMBER_URL} className="sm-btn sm-btn-accent">
                  לרכישת מס׳ וירטואלי חדש
                </a>
                <Link to="/virtual-number/" className="sm-vn-alt">
                  לפרטים על המספר הווירטואלי
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Messages are bought as banks, so the price link goes to the
            bank calculator rather than to the subscription price list. */}
        <section className="sm-prices">
          <div className="container">
            <div className="sm-prices-row">
              <div>
                <h2>מחירי מסרונים</h2>
                <p>
                  המסרונים נרכשים כבנק, בתשלום חד פעמי ובלי מנוי חודשי. המחיר
                  נקבע לפי כמות ההודעות ולפי אורך ההודעה, 70, 140 או 210 תווים.
                </p>
              </div>
              <Link to="/sms-bank/" className="sm-btn sm-btn-light">
                למחירון בנק הסמסים
              </Link>
            </div>
          </div>
        </section>

        {/* Collapsed panels are 0fr and invisible, so they leave the tab
            order instead of merely going out of sight. */}
        <section className="sm-faq">
          <div className="container">
            <div className="sm-head">
              <h2>שאלות ותשובות</h2>
            </div>

            <div className="sm-qs">
              {faqs.map((f) => {
                const isOpen = openId === f.id
                return (
                  <div className="sm-q" key={f.id} data-open={isOpen}>
                    <h3 className="sm-q-h">
                      <button
                        type="button"
                        className="sm-q-btn"
                        id={`sm-q-${f.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`sm-a-${f.id}`}
                        onClick={() => setOpenId(isOpen ? null : f.id)}
                      >
                        <span>{f.q}</span>
                        <span className="sm-q-sign" aria-hidden="true">
                          <PlusIcon />
                        </span>
                      </button>
                    </h3>
                    <div
                      className="sm-a"
                      id={`sm-a-${f.id}`}
                      role="region"
                      aria-labelledby={`sm-q-${f.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="sm-a-in">
                        {f.a.map((para) => (
                          <p key={para}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default SmsPage

export const Head: HeadFC = () => (
  <SEO
    title="מערכת סמסים"
    description="מערכת שליחת סמסים של שלח מסר: קישורים מקוצרים, מספר וירטואלי, אוטומציות, שליחה בפולסים וסטטיסטיקות הקלקות. נרשמים ומקבלים 5 סמסים לבדיקות."
    pathname="/sms/"
  />
)
