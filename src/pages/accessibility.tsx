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
   site's to assume. What has been done about it, 2026-10-08: the
   machine-checkable parts of WCAG 2 AA now pass across all 157 pages
   (scripts/check-a11y.py, run against a clean --prefix-paths build).
   Getting there fixed real level-A failures that this build had while
   the page already declared AA: no skip link on any page, a heading
   level skipped on 149 pages, four links whose only content was an
   unlabelled image, and four text colours under 4.5:1.

   That is not the whole standard. Keyboard order and focus traps,
   focus visibility in practice, whether alt text is meaningful, and
   reflow at 320px still need a person. The sentence below about
   testing with NVDA, JAWS and VoiceOver is the company's published
   claim and was carried over as-is; it has not been re-verified
   against this build. */

/* Set from the last run of scripts/check-a11y.py against a release build. */
const LAST_CHECK = "8 באוקטובר 2026"
const PAGE_COUNT = 157

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
  { id: "a3", heading: "בדיקה אחרונה" },
  { id: "a4", heading: "רכיבים אשר עשויים להיות לא מונגשים" },
  { id: "a5", heading: "הגבלת אחריות" },
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

              {/* 5568 statements are expected to say when the site was last
                  reviewed. This section records the automated pass that runs
                  from scripts/check-a11y.py, and is explicit that it does not
                  cover the parts only a person can judge -- so the date here
                  is never mistaken for a full manual audit. Update LAST_CHECK
                  whenever that script is run against a release. */}
              <section className="lg-sec" id="a3">
                <h2>בדיקה אחרונה</h2>
                <p>
                  בדיקת הנגישות האוטומטית האחרונה של האתר בוצעה בתאריך{" "}
                  {LAST_CHECK}. נבדקו, בכל {PAGE_COUNT} עמודי האתר: הגדרת שפה
                  וכיווניות, קיום כותרת ייחודית לכל עמוד, טקסט חלופי לתמונות,
                  היררכיית כותרות רציפה, קיום אזור תוכן ראשי וקישור דילוג
                  אליו, תיוג שדות טפסים, שם נגיש לכל קישור וכפתור, ייחודיות
                  מזהים, סדר טאבים, וניגודיות צבעים ביחס של 4.5:1 לטקסט רגיל
                  ו-3:1 לטקסט גדול.
                </p>
                <p>
                  בדיקה אוטומטית אינה מחליפה בדיקה אנושית. הנושאים הבאים
                  נבחנים בנפרד ואינם מכוסים על ידה: סדר הניווט במקלדת ומלכודות
                  מיקוד, נראות סימון המיקוד בפועל, ניגודיות של טקסט מעל רקעים
                  מרובדים, האם הטקסט החלופי אכן מתאר את התמונה, והתנהגות העמוד
                  בהגדלה ובמסך צר.
                </p>
              </section>

              <section className="lg-sec" id="a4">
                <h2>רכיבים אשר עשויים להיות לא מונגשים</h2>
                <p>
                  האתר עשוי להכיל קודים חיצוניים ואלמנטים המוטמעים באמצעות{" "}
                  <span className="lg-ltr">iframe</span>, כגון מפות גוגל,
                  סרטוני <span className="lg-ltr">YouTube</span> ורכיבים של
                  צד שלישי. קודים אלו עשויים להיות לא מונגשים. כמו כן, ניתן
                  להפעיל סרטונים חיצוניים ללא כתוביות.
                </p>
              </section>

              <section className="lg-sec" id="a5">
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
