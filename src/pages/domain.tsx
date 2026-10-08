import React, { useState } from "react"
import { Link } from "gatsby"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/domain.css"

/* Copy is the live domain page's own. Its answers arrive as one run-on
   string because the source joins paragraphs without spaces; they are
   split back into sentences here, not rewritten. */

/* Prices as the live page states them, before VAT */
const prices = [
  { ext: ".co.il / .org.il", buy: 120, renew: 160 },
  { ext: ".com", buy: 125, renew: 167 },
]

const reasons = [
  "נראות ומיתוג גבוה כלפי הלקוחות",
  "דומיין אישי בבעלותכם לתמיד",
  "אפשרות עתידית להעברה לכל רשם דומיינים",
  "עדכון אוטומטי של כל ההגדרות והרשומות",
  "הוספת הרשומות על פי הדרישות החדשות של ג׳ימייל ו-Yahoo",
  "ללא עלות: תיבה וירטואלית תחת כתובת הדומיין",
  "אפשרות הגדרת תיבה וירטואלית להפניה לתיבת הג׳ימייל",
  "תעודת SSL בחינם לדפי הנחיתה, לקורסים ולבתי הספר",
  "ניתן להגדיר גם אתר חיצוני (למשל וורדפרס) עם SSL",
  "ניהול רשומות עצמאי, כולל סיוע ושירות על ידי צוות שלח מסר",
]

const faqs = [
  {
    id: "ownership",
    q: "האם הדומיין בבעלותי לתמיד ברגע שרוכשים?",
    a: [
      "הדומיין בבעלותכם הבלעדית, כל עוד הרישום מחודש בזמן בכל סיום תוקף.",
    ],
  },
  {
    id: "why-here",
    q: "אז למה לרכוש דרככם ולא דרך אתר חיצוני אחר?",
    a: [
      "יש מספר יתרונות לרכוש דרך שלח מסר. למשל, ברשם רגיל לא מקבלים תיבת מייל וירטואלית ולא תעודת SSL חינמית תחת הדומיין. בנוסף, אם יש לכם חבילת דיוור בשלח מסר, אנחנו חוסכים לכם איש טכני ומעדכנים את כל הרשומות מאחורי הקלעים.",
    ],
  },
  {
    id: "same",
    q: "האם זה כמו לרכוש דומיין בחברה חיצונית?",
    a: [
      "כן, מבחינת הבעלות על הדומיין זה אותו דבר.",
      "ניתן גם לבדוק יום לאחר הרכישה את הבעלות בכתובת whois.domaintools.com. ההבדל הוא רק בתוספות שמקבלים משלח מסר.",
    ],
  },
  {
    id: "sender",
    q: "אם אני בוחר כתובת, מה רשימת התפוצה שלי רואה בשם השולח?",
    a: [
      "בשם השולח ניתן להגדיר כל כתובת שניתן לאמת.",
      "אם הגדרתם או רכשתם דומיין דרכנו, ניתן לעדכן כל כתובת מייל תחת הדומיין שנרכש, למשל info@mydomain.co.il.",
    ],
  },
  {
    id: "transfer",
    q: "אם יש לי כבר דומיין פרטי, מה ההנחה שאני יכול לקבל?",
    a: [
      "אם יש לכם כתובת דומיין שרכשתם בעבר, ניתן לבצע העברה לפי עלות חידוש. בנוסף לשירות ההעברה אלינו מקבלים גם חידוש לשנה נוספת, כולל כל השירותים שצוינו: תיבה וירטואלית, תעודת SSL, הגדרת רשומות וכדומה.",
    ],
  },
  {
    id: "website",
    q: "האם הדומיין יכול לשמש לאתר שלי? איך?",
    a: [
      "כן, בהחלט.",
      "לאחר רכישת הדומיין ניתן להוסיף רשומה (לרוב www) שמפנה לכתובת שמקבלים מחברת האחסון שבה האתר מאוחסן. כמובן, צוות השירות שלנו ישמח לסייע.",
    ],
  },
  {
    id: "subdomains",
    q: "האם אפשר להוסיף סאב דומיינים לדומיין? ועד כמה?",
    a: [
      "ניתן להוסיף סאב דומיינים ללא הגבלה.",
      "מאחורי הקלעים אנחנו מוסיפים לכם סאב דומיין lp, כך שתוכלו מיד לאחר הרכישה להגדיר דפי נחיתה תחת הכתובת שלכם. בנוסף אנחנו מוסיפים סאב דומיין course, ובממשק תוכלו לשנות ולהוסיף סאב דומיינים נוספים.",
    ],
  },
  {
    id: "which",
    q: "תוכלו להמליץ לי איזה דומיין לבחור?",
    a: [
      "לרוב מה שנהוג לחפש זה שמות שקרובים או דומים לשם העסק או המותג שלכם, ורצוי לא ארוכים.",
      "ואם עדיין קשה להחליט, הצוות ישמח לסייע.",
    ],
  },
  {
    id: "mailboxes",
    q: "האם אפשר להגדיר יותר מתיבה וירטואלית אחת לדומיין?",
    a: [
      "דומיין שנרכש דרך מערכת שלח מסר מאפשר פתיחה של מספר תיבות ללא הגבלה.",
      "למשל, ברגע שרוכשים דומיין אפשר לייצר תיבות כמו info@domain.co.il, office@domain.co.il וכך הלאה, מה שמאפשר שליחה מאת מספר תפקידים בחברה.",
    ],
  },
]

const he = (n: number) => n.toLocaleString("he-IL")

const PlusIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path className="dm-plus-v" d="M12 4v16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const DomainPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Layout>
      <div className="dm">
        <section className="dm-hero">
          <div className="container">
            <h1>רכישת דומיין פרטי</h1>
            <p className="dm-hero-sub">
              מערכת שלח מסר מאפשרת רכישת דומיין פרטי בבעלותכם.
            </p>
            <p className="dm-hero-note">
              לאחר פתיחת חשבון בשלח מסר עוברים לעדכון פרטי בעלות הדומיין, ואז
              לרכישה.
            </p>
            <a href={PANEL_URL} className="dm-btn dm-btn-accent" onClick={openSignup}>
              פתיחת חשבון בחינם
            </a>
          </div>
        </section>

        {/* Four numbers, two of them the ones people actually ask about.
            A table because these really are parallel values. */}
        <section className="dm-prices">
          <div className="container">
            <div className="dm-head">
              <h2>כמה זה עולה</h2>
              <p>
                העלות כוללת כבר את כל השירותים: תיבה וירטואלית, תעודת SSL,
                הגדרת רשומות וכדומה.
              </p>
            </div>

            <table className="dm-table">
              <caption className="dm-sr">
                מחירי רכישה וחידוש של דומיין לפי סיומת, בשקלים, לפני מע״מ
              </caption>
              <thead>
                <tr>
                  <th scope="col">סיומת</th>
                  <th scope="col">רכישה</th>
                  <th scope="col">חידוש לשנה</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((p) => (
                  <tr key={p.ext}>
                    <th scope="row">
                      <span className="dm-ltr">{p.ext}</span>
                    </th>
                    <td>
                      <span className="dm-ltr">₪{he(p.buy)}</span>
                    </td>
                    <td>
                      <span className="dm-ltr">₪{he(p.renew)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="dm-foot">
              המחירים אינם כוללים מע״מ. יש להיכנס או להירשם קודם לחשבון בשלח
              מסר. דומיין קיים אפשר להעביר אלינו בעלות חידוש, וההעברה כוללת
              חידוש לשנה נוספת.
            </p>
          </div>
        </section>

        <section className="dm-why">
          <div className="container">
            <div className="dm-why-split">
              <div className="dm-head">
                <h2>למה לרכוש דומיין פרטי לעסק</h2>
              </div>
              <ul className="dm-why-list">
                {reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Collapsed panels are 0fr and invisible, so they leave the tab
            order instead of merely going out of sight. */}
        <section className="dm-faq">
          <div className="container">
            <div className="dm-head">
              <h2>שאלות נפוצות</h2>
            </div>

            <div className="dm-qs">
              {faqs.map((f) => {
                const isOpen = openId === f.id
                return (
                  <div className="dm-q" key={f.id} data-open={isOpen}>
                    <h3 className="dm-q-h">
                      <button
                        type="button"
                        className="dm-q-btn"
                        id={`dm-q-${f.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`dm-a-${f.id}`}
                        onClick={() => setOpenId(isOpen ? null : f.id)}
                      >
                        <span>{f.q}</span>
                        <span className="dm-q-sign" aria-hidden="true">
                          <PlusIcon />
                        </span>
                      </button>
                    </h3>
                    <div
                      className="dm-a"
                      id={`dm-a-${f.id}`}
                      role="region"
                      aria-labelledby={`dm-q-${f.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="dm-a-in">
                        {f.a.map((para) => (
                          <p key={para}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="dm-faq-foot">
              שאלה שלא מופיעה כאן?{" "}
              <Link to="/contact/" className="dm-inline-link">
                דברו איתנו
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default DomainPage

export const Head: HeadFC = () => (
  <SEO
    title="רכישת דומיין פרטי"
    description="רכישת דומיין פרטי דרך שלח מסר: co.il ב-₪120 ו-com ב-₪125 לפני מע״מ, כולל תיבה וירטואלית, תעודת SSL והגדרת רשומות אוטומטית."
    pathname="/domain/"
  />
)
