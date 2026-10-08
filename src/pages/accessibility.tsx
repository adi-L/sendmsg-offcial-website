import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import "../styles/legal.css"

/* ── /accessibility/ ────────────────────────────────────────────
   הצהרת נגישות, following the live sendmsg.co.il/accessibility/
   statement.

   ONE DELIBERATE DEPARTURE FROM THE LIVE TEXT, which needs a human
   decision before this ships:

   The live statement says the site is made accessible "על ידי
   פלטפורמת ווררפרס" and that WordPress may inject inaccessible
   third-party iframes. This site is not WordPress — it is a static
   Gatsby build — so repeating that sentence would make the legal
   declaration factually false about the site carrying it. The
   platform sentences below describe this site instead. Everything
   else (the standard, the conformance level, the tested assistive
   technologies, the limitation of liability, the contact details)
   is the company's own declaration and is left as published.

   The declared conformance level is the company's to make, not the
   site's to assume: if this build has not been re-audited against
   תקן ישראלי 5568, the level below must be re-checked before the
   page goes live. */

const ACCESS_EMAIL = "negishut@comstar.co.il"
const ACCESS_PHONE = "077-4600600"

/* What the live statement says was tested. */
const TESTED = [
  "הגדלה והקטנה של כלל הטקסט באתר",
  "שינוי ניגודיות צבעים, כולל רקע כהה",
  "הדגשת קישורים",
  "הנגשת תפריטים, טפסים והיררכיית כותרות באמצעות Tab",
  "עדכון פונטים לפונטים קריאים",
  "הצהרת נגישות עם הסבר אודות תאימות, פערים ופרטי קשר עבור פניות בנושאי הנגשה",
]

const SECTIONS = [
  { id: "a1", heading: "הנגשת האתר" },
  { id: "a2", heading: "מה נבדק" },
  { id: "a3", heading: "רכיבים אשר עשויים להיות לא מונגשים" },
  { id: "a4", heading: "הגבלת אחריות" },
]

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
    <path
      d="M4 12.5 9.5 18 20 6.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const AccessibilityPage: React.FC = () => (
  <Layout>
    <div className="lg">
      <section className="lg-hero">
        <div className="container">
          <h1>הצהרת נגישות</h1>
          <p className="lg-hero-sub">
            חברת קומסטאר מערכות בע״מ פועלת לקידום נגישות האתרים הישראלים
            והפיכתם למתאימים לכלל האוכלוסייה בישראל.
          </p>
          <p className="lg-hero-meta">
            נתקלתם במגבלה שהפריעה לגלישה או מנעה אותה? נשמח לשמוע על כך. פרטי
            ההתקשרות למשוב נמצאים בתחתית העמוד.
          </p>
        </div>
      </section>

      <section className="lg-doc">
        <div className="container">
          <div className="lg-grid">
            <nav className="lg-toc" aria-label="תוכן עניינים" data-count="true">
              <h2>תוכן עניינים</h2>
              <ol>
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.heading}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <div>
              <section className="lg-sec" id="a1">
                <h2>הנגשת האתר</h2>
                <p>
                  ההנגשה מתבצעת בקוד האתר עצמו, בהתאם לתקן הישראלי לנגישות 5568
                  המבוסס על התקן העולמי <span className="lg-ltr">WCAG 2</span>{" "}
                  והנחיות גוף התקינה הבין-לאומי{" "}
                  <span className="lg-ltr">W3C</span> לרמה{" "}
                  <span className="lg-ltr">AA</span>, ובעזרת ייעוץ מומחי הנגשה.
                </p>
                <p>
                  התאמת הנגישות נבדקה באמצעי עזר ומכשירים שונים, והסתייעה
                  בטכנולוגיות קוראי מסך כגון{" "}
                  <span className="lg-ltr">NVDA</span>,{" "}
                  <span className="lg-ltr">JAWS</span> ו-
                  <span className="lg-ltr">VoiceOver</span>.
                </p>
              </section>

              <section className="lg-sec" id="a2">
                <h2>מה נבדק</h2>
                <ul className="lg-checks">
                  {TESTED.map((t) => (
                    <li key={t}>
                      <span className="lg-check" aria-hidden="true">
                        <CheckIcon />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="lg-sec" id="a3">
                <h2>רכיבים אשר עשויים להיות לא מונגשים</h2>
                <p>
                  האתר עשוי להכיל קודים חיצוניים ואלמנטים המוטמעים באמצעות{" "}
                  <span className="lg-ltr">iframe</span>, כגון מפות גוגל,
                  סרטוני <span className="lg-ltr">YouTube</span> ורכיבים של
                  צד שלישי. קודים אלו עשויים להיות לא מונגשים. כמו כן, ניתן
                  להפעיל סרטונים חיצוניים ללא כתוביות.
                </p>
              </section>

              <section className="lg-sec" id="a4">
                <h2>הגבלת אחריות</h2>
                <p>
                  חברת קומסטאר מערכות בע״מ עושה מאמצים להנגשה מלאה באמצעות
                  הטכנולוגיות המוטמעות בקודי האתר, אך אינה אחראית לתוכן הדפים,
                  לדיוקם או לשימוש בהם בצורה הנכונה לצרכי נגישות.
                </p>
                <p>
                  במידה ומצאתם דף שאינו מאפשר לגלוש בצורה מונגשת, אנא פנו אלינו
                  עם הקישור ונסייע בהנגשתו.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="lg-contact">
        <div className="container">
          <div className="lg-contact-in">
            <h2>פרטי התקשרות למשוב</h2>
            <p>
              במידה ובמהלך הגלישה נתקלתם בכל זאת במגבלה שהפריעה לגלישה או מנעה
              אותה לחלוטין, נשמח לשמוע על כך. אנא ידעו אותנו באחת מהדרכים האלה,
              ואם אפשר צרפו את הקישור לדף.
            </p>
            <ul className="lg-contact-rows">
              <li>
                <a href={`tel:${ACCESS_PHONE.replace(/-/g, "")}`}>
                  <span className="lg-contact-t">טלפון</span>
                  <span className="lg-contact-v lg-ltr">{ACCESS_PHONE}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${ACCESS_EMAIL}`}>
                  <span className="lg-contact-t">מייל</span>
                  <span className="lg-contact-v lg-ltr">{ACCESS_EMAIL}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
    <CTA />
  </Layout>
)

export default AccessibilityPage

export const Head: HeadFC = () => (
  <SEO
    title="הצהרת נגישות"
    description="הצהרת הנגישות של שלח מסר: תקן ישראלי 5568 ברמה AA לפי WCAG 2, מה נבדק, אילו רכיבים עשויים להיות לא מונגשים, ופרטי התקשרות לפניות בנושא נגישות."
    pathname="/accessibility/"
  />
)
