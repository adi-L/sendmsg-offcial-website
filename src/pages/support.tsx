import React, { useState } from "react"
import { Link } from "gatsby"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { SUPPORT_EMAIL } from "../data/api"
import {
  SUPPORT_PHONE,
  WHATSAPP_NUMBER,
  WHATSAPP_LINK,
  useSupportStatus,
} from "../data/support-hours"
import "../styles/support.css"

/* ── /support/ ──────────────────────────────────────────────────
   Copy is the live /support/ page's own.

   This page and /contact/ publish the same phone number, so they are
   deliberately split by job rather than by content: /contact/ owns the
   callback form and the routing out to the rest of the site, and this
   page leads with the answers, because four of the five questions the
   team is asked are already answered here. The channels sit below the
   answers, not above them, and the form is handed off rather than
   rebuilt — a second form with no backend would be worse than a link. */

/* The site's own icon set: 24-grid, 1.8 stroke, round caps. */
const stroke = (paths: React.ReactNode, size = 22) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {paths}
  </svg>
)

const PhoneIcon = () =>
  stroke(
    <path d="M6.5 3h-2A1.5 1.5 0 0 0 3 4.6C3 13 11 21 19.4 21a1.5 1.5 0 0 0 1.6-1.5v-2a1 1 0 0 0-.8-1l-3.3-.7a1 1 0 0 0-1 .4l-.9 1.2a13.6 13.6 0 0 1-6.4-6.4l1.2-.9a1 1 0 0 0 .4-1l-.7-3.3a1 1 0 0 0-1-.8Z" />
  )

const MailIcon = () =>
  stroke(
    <>
      <rect x="2" y="4.5" width="20" height="15" rx="2.5" />
      <path d="m2.8 6 8.06 6.2a2 2 0 0 0 2.28 0L21.2 6" />
    </>
  )

/* A brand mark is its own lettering: drawing a generic bubble in its
   place only makes it harder to find. */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
)

const FormIcon = () =>
  stroke(
    <>
      <rect x="3.5" y="3" width="17" height="18" rx="2.5" />
      <path d="M8 8.5h8M8 12.5h8M8 16.5h4" />
    </>
  )

/* Points the way the language runs. */
const GoIcon = ({ size = 20 }: { size?: number }) =>
  stroke(
    <>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </>,
    size
  )

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
    <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path className="sp-plus-v" d="M12 5v14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

/* The four questions the live page answers, verbatim. The answers run
   long, so each is kept as its own paragraphs rather than flattened. */
type Faq = {
  id: string
  q: string
  body: React.ReactNode
}

const FAQS: Faq[] = [
  {
    id: "lists",
    q: "האם אתם מספקים את רשימת הלקוחות?",
    body: (
      <>
        <p>
          לא, וזה גם לא חוקי. את הלקוחות שלכם אתם צריכים להביא בעצמכם, והם
          צריכים לתת הסכמה לכך שתדוורו אליהם.
        </p>
        <p>
          אבל אל דאגה: בנינו עבורכם מערכת שיווק מתקדמת ומקיפה שתאפשר לכם להשיג
          לידים איכותיים ולתחזק מועדון לקוחות אקסקלוסיבי.
        </p>
      </>
    ),
  },
  {
    id: "grow",
    q: "איך אני יוצר רשימה ואיך אוכל להגדיל את הרשימה?",
    body: (
      <>
        <p>
          רשימת תפוצה היא למעשה רשימת לקוחות אליהם ניתן להעביר מסרים באמצעות
          מערכת דיוור אלקטרוני. קיימות מספר דרכים להגדיל את רשימת התפוצה שלכם,
          והנה כמה טיפים בנושא:
        </p>
        <ul className="sp-a-list">
          <li>
            היחשפו כמה שיותר ברשתות החברתיות, ועודדו לקוחות להצטרף לרשימה שלכם
            דרך הפלטפורמות הללו.
          </li>
          <li>יצירת דפי נחיתה ושיווק שלהם ללקוחות פוטנציאליים.</li>
          <li>שימוש באנשי מקצוע כדוגמת כותבים, מקדמי אתרים וכדומה.</li>
          <li>
            יצירת הצעה מפתה של תמורה ללקוח, כמו קופון מיוחד או הנחה בהרשמה
            לרשימת התפוצה.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "shabbat",
    q: "האם המערכות כשרות גם עבור המגזר החרדי?",
    body: (
      <>
        <p>
          בהחלט. קיימת אצלנו האפשרות לא לשלוח אימיילים בשבתות וחגים, וניתן
          לחסום את האתר ואת דף הנחיתה בימים אלה.
        </p>
        <p>
          גם במערכת הקורסים ניתן להגדיר שהיא לא תיפתח בשבתות וחגים, כך שניתן
          יהיה ללמוד בה רק במהלך השבוע.
        </p>
        <p className="sp-a-more">
          <Link to="/shomer-shabbat/">
            לפרטים על ההגדרות לשומרי שבת
            <span aria-hidden="true">
              <GoIcon size={18} />
            </span>
          </Link>
        </p>
      </>
    ),
  },
  {
    id: "why",
    q: "יש הרבה מערכות בשוק, למה דווקא המערכת של שלח מסר?",
    body: (
      <>
        <p>
          נכון, יש הרבה מערכות בשוק. אבל אצלנו בשלח מסר דאגנו לשדרג את המערכות,
          להפוך אותן למתקדמות ביותר בשוק, ולספק את הכל תחת קורת גג אחת וברמה
          הגבוהה ביותר.
        </p>
        <p>
          במערכת הקורסים שלנו יש כלים ואפשרויות שלא תמצאו במערכות אחרות, כמו
          יצירת תפריט עליון, קישור לקבוצת פייסבוק ויצירת מערך וובינרים.
        </p>
        <p>
          בנוסף, מערכת ה-<span className="sp-ltr">SMS</span> שלנו היא
          מהמתקדמות ביותר, ומאפשרת ליצור הודעות ארוכות עם תוכן ומתן ערך אישי
          ללקוחות. אצלנו תמצאו סטטיסטיקות חכמות ומובילות, כולל מפות חום, וכך
          תוכלו לשפר את רמת הביצוע שלכם.
        </p>
        <p>
          ובסופו של דבר, האינטגרציה שלנו היא ברמה הגבוהה ביותר. הכל נעשה במערכת
          אחת שמייצרת עבורכם מערך שיווק מקיף ומקצועי, וחוסכת המון זמן וכסף.
        </p>
      </>
    ),
  },
]

const SupportPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id)
  const status = useSupportStatus()

  return (
    <Layout>
      <div className="sp">
        <section className="sp-hero">
          <div className="container">
            <div className="sp-hero-grid">
              <div>
                <h1>הצוות שלנו כאן בשבילכם</h1>
                <p className="sp-hero-sub">
                  רוב השאלות שמגיעות לתמיכה כבר נענו כאן למטה. מה שלא, הנציגים
                  עונים בטלפון.
                </p>
              </div>

              {/* A translucent panel is allowed to hold an object. This
                  one holds the support window, and answers the only
                  question it can answer for a visitor in another
                  timezone: are they open right now. */}
              <div className="sp-hours">
                <p className="sp-hours-label">זמני תמיכה</p>
                <p className="sp-hours-days">ימי ראשון עד חמישי</p>
                <p className="sp-hours-time">
                  <span className="sp-ltr">9:00–17:00</span>
                </p>
                {status && (
                  <p
                    className="sp-hours-now"
                    data-open={status.open}
                  >
                    <span className="sp-dot" aria-hidden="true" />
                    {status.open ? "פתוח עכשיו" : "סגור עכשיו"}
                    <span className="sp-hours-note">{status.note}</span>
                  </p>
                )}
                <a className="sp-call" href={`tel:${SUPPORT_PHONE.replace(/-/g, "")}`}>
                  <span className="sp-call-ico" aria-hidden="true">
                    <PhoneIcon />
                  </span>
                  <span className="sp-ltr">{SUPPORT_PHONE}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="sp-faq">
          <div className="container">
            <div className="sp-head">
              <h2>שאלות נפוצות</h2>
            </div>

            <div className="sp-qs">
              {FAQS.map((f) => {
                const isOpen = openId === f.id
                return (
                  <div className="sp-q" key={f.id} data-open={isOpen}>
                    <h3 className="sp-q-h">
                      <button
                        type="button"
                        className="sp-q-btn"
                        id={`sp-q-${f.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`sp-a-${f.id}`}
                        onClick={() => setOpenId(isOpen ? null : f.id)}
                      >
                        <span>{f.q}</span>
                        <span className="sp-q-sign" aria-hidden="true">
                          <PlusIcon />
                        </span>
                      </button>
                    </h3>
                    <div
                      className="sp-a"
                      id={`sp-a-${f.id}`}
                      role="region"
                      aria-labelledby={`sp-q-${f.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="sp-a-in">{f.body}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* The channels sit under the answers, and each one says when it
            is the right one to use, which is the part the live page's
            four identical blocks leave out. */}
        <section className="sp-ways">
          <div className="container">
            <div className="sp-ways-split">
              <div className="sp-head">
                <h2>לא מצאתם? דברו איתנו</h2>
                <p>
                  הצוות שעונה בטלפון הוא אותו צוות שעונה במייל ובוואטסאפ, בימי
                  ראשון עד חמישי בין <span className="sp-ltr">9:00</span> ל-
                  <span className="sp-ltr">17:00</span>. מחוץ לשעות האלה, השאירו
                  בקשה לחזרה.
                </p>
              </div>

              <ul className="sp-ways-list">
                <li>
                  <a href={`tel:${SUPPORT_PHONE.replace(/-/g, "")}`}>
                    <span className="sp-way-ico" aria-hidden="true">
                      <PhoneIcon />
                    </span>
                    <span className="sp-way-main">
                      <span className="sp-way-t sp-ltr">{SUPPORT_PHONE}</span>
                      <span className="sp-way-d">
                        הכי מהר, בזמן שעות הפעילות.
                      </span>
                    </span>
                    <span className="sp-way-go" aria-hidden="true">
                      <GoIcon />
                    </span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SUPPORT_EMAIL}`}>
                    <span className="sp-way-ico" aria-hidden="true">
                      <MailIcon />
                    </span>
                    <span className="sp-way-main">
                      <span className="sp-way-t sp-ltr">{SUPPORT_EMAIL}</span>
                      <span className="sp-way-d">
                        כשצריך לצרף צילום מסך או קובץ. נשתדל לענות בהקדם.
                      </span>
                    </span>
                    <span className="sp-way-go" aria-hidden="true">
                      <GoIcon />
                    </span>
                  </a>
                </li>
                <li>
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                    <span className="sp-way-ico" aria-hidden="true">
                      <WhatsAppIcon />
                    </span>
                    <span className="sp-way-main">
                      <span className="sp-way-t sp-ltr">{WHATSAPP_NUMBER}</span>
                      <span className="sp-way-d">
                        וואטסאפ, לשאלה קצרה שאפשר לכתוב בשורה.
                      </span>
                    </span>
                    <span className="sp-way-go" aria-hidden="true">
                      <GoIcon />
                    </span>
                  </a>
                </li>
                <li>
                  <Link to="/contact/">
                    <span className="sp-way-ico" aria-hidden="true">
                      <FormIcon />
                    </span>
                    <span className="sp-way-main">
                      <span className="sp-way-t">בקשה לחזרה טלפונית</span>
                      <span className="sp-way-d">
                        מחוץ לשעות הפעילות. נחזור אליכם תוך 24 שעות, בחלון
                        שתבחרו.
                      </span>
                    </span>
                    <span className="sp-way-go" aria-hidden="true">
                      <GoIcon />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default SupportPage

export const Head: HeadFC = () => (
  <SEO
    title="תמיכה ושירות"
    description="התמיכה של שלח מסר: ראשון עד חמישי 9:00 עד 17:00, טלפון 077-4600911, מייל ווואטסאפ, ותשובות לשאלות הנפוצות על רשימות תפוצה, כשרות לשומרי שבת ומה המערכת כוללת."
    pathname="/support/"
  />
)
