import React, { useState } from "react"
import { Link } from "gatsby"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/newsletters.css"

/* Every line below is the live /newsletters/ page's own copy. The one
   edit: the body said "Creaditor 2.0" while its own FAQ said 3.0, and
   3.0 is the version this page now uses throughout. */

/* "מה אנחנו מציעים" — eight items, as listed */
const offers = [
  "התאמה אישית של המסרים ללקוח בגוף ההודעה ובכותרת",
  "טכנולוגיות מתקדמות המאפשרות שיפור סיכויי הגעה לתיבה ראשית",
  "שליחת מייל כזימון ביומן לכל לקוח",
  "מניעת שליחת הודעות אוטומטיות בשבתות וחגים",
  "אפשרות לצירוף קבצים ותמונות למיילים",
  "עורך AI שחוסך לכם עבודה",
  "הגדרת תהליכי אוטומציה וסדרת הודעות מרגע ההרשמה",
  "מיילים רספונסיביים שמתאימים למכשירים ומסכים שונים",
]

/* "הנה הבונוסים שתקבלו על שהחלטתם לנסות" — the hook is pulled out of
   each paragraph so the five can be scanned without reading them all. */
const bonuses = [
  {
    t: "מערכת דיוור",
    hook: "חינם ולתמיד",
    d: "עם העורך הכי נוח והאוטומציות הכי מתקדמות, כך שתוכלו לשמור על קשר אישי (או אוטומטי) עם העוקבים והלקוחות שלכם. חשבון עד 250 מנויים ואלפיים דיוורים כל חודש.",
  },
  {
    t: "מערכת סמסים",
    hook: "100 סמסים ראשונים חינם",
    d: "שלחו פרסומות למועדון שלכם, תזכרו אנשים על פגישות, על חידוש מנוי, על סיום תוקף ובעצם על כל דבר שתרצו, יזום או אוטומטית.",
  },
  {
    t: "דפי נחיתה",
    hook: "3 דפים ראשונים חינם ולתמיד",
    d: "תוכלו לעצב אצלנו דפי נחיתה בקלות ולהגיע לרמה מאוד קרובה לאתר. מתאים להשקות, הרשמת קהל חדש, דפי מכירה ועוד.",
  },
  {
    t: "קורסים",
    hook: "קורס ראשון חינם ולתמיד",
    d: "משתמשי שלח מסר יכולים להקים קורס דיגיטלי בחינם, ללא הגבלת שיעורים, ולתת גישה בקליק רק לאנשי קשר שאתם בוחרים.",
  },
  {
    t: "ניהול לקוחות CRM",
    hook: "כלול בחשבון",
    d: "כל הנ״ל מתבצע במערכת שמאפשרת תיעודים מלאים על אנשי הקשר שלכם, כולל דוחות על איזה מסרים הם פתחו, תיעוד שיחות שבוצעו, שיעורים שנצפו ועוד. הכל מעמוד ״כרטיס לקוח״ מסודר.",
  },
]

/* The live page's seven questions and their answers, verbatim */
const faqs = [
  {
    id: "free",
    q: "אני עסק קטן וחושש מהתחייבות. יש חבילה חינמית?",
    a: "כן! המערכת מציעה חבילה חינמית שכוללת את כל התכונות המתקדמות – עורך התוכן המתקדם Creaditor 3.0 כולל יכולות AI עם תבניות עיצוב מוכנות, ויכולת ליצור אוטומציות. אין צורך להתחיל לשלם כדי להתנסות במערכת ולראות אם היא מתאימה לעסק שלך.",
  },
  {
    id: "design",
    q: "זה מסובך? אין לי רקע בעיצוב גרפי או ידע טכני האם אצליח לעצב ניוזלטר שנראה מקצועי לבד?",
    a: "המערכת בנויה בשיטת drag & drop, כלומר ״גרירה ושיחרור״, ללא צורך בידע טכני. יש מגוון תבניות מוכנות מחולקות לפי קטגוריות ונושאים שונים, אז אפשר פשוט לבחור תבנית, להתאים אותה לעסק ולשלוח. זה ידידותי וקל לשימוש.",
  },
  {
    id: "spam",
    q: "אני חושש שהמיילים שאשלח יגיעו לספאם ולא לתיבה הראשית. איך אתם מטפלים בזה?",
    a: "המערכת משתמשת בקוד נקי שמגביר את הניקוד אצל ספקי דואר כמו Gmail ו-Outlook. זה מבטיח שההודעות יגיעו במהירות לתיבת הדואר הרגילה של הנמענים ולא יסומנו כספאם, מה שמשפר את אחוזי הפתיחה. יש לנו גם מאמרים מצוינים לדרכי שיפור אחוזי הפתיחה של הדיוורים.",
  },
  {
    id: "auto",
    q: "אין לי זמן לשבת ולשלוח מיילים כל יום. האם המערכת יכולה לעבוד בשבילי אוטומטית?",
    a: "כן. יש מגוון יכולות אוטומציה כולל לוח אירועים שמספק סיבות לדיוורים. כמו כן המערכת כוללת אפשרות לשלוח סדרת מסרים אוטומטית מרגע ההרשמה, במצבי פעולה שונים וכן הודעות אוטומטיות לפי תאריכים (כמו יום הולדת) או סיום תוקף מועדון.",
  },
  {
    id: "mobile",
    q: "רוב הלקוחות שלי פותחים מיילים בטלפון הנייד. איך אדע שהדיוור ייראה טוב במובייל?",
    a: "העורך שלנו Creaditor 3.0 בעל יכולות גבוהות של שליטה בגרסת מובייל ודסקטופ וכל בנייה עם הבלוקים בנויים באופן מותאם רספונסיבית לכל המכשירים, כך שהמיילים ברמת 99% מותאמים ורספונסיביים למובייל ולמכשירים בגדלים שונים ללא צורך בשינויים מיוחדים.",
  },
  {
    id: "birthday",
    q: "אפשר לשלוח הודעות אוטומטיות ללקוחות בימי הולדת או אירועים מיוחדים?",
    a: "בהחלט! המערכת כוללת אוטומציות מתקדמות וייחודיות רק לשלח מסר, כמו ימי חג וימי מודעות לאורך השנה עם כ-400 אירועים שונים. בנוסף, יש אפשרות להודעות אוטומטיות לפי יום הולדת, סדרת מסרים מרגע ההרשמה למועדון לקוחות, התראות על סיום תוקף חברות, ואפשרויות אוטומציה נוספות. זה חוסך המון זמן ושומר על קשר רציף עם הלקוחות.",
  },
  {
    id: "integrations",
    q: "המערכת מתחברת לכלים אחרים שאני משתמש בהם?",
    a: "כן, המערכת תומכת באינטגרציות עם מערכות חיצוניות דרך פלטפורמות מובילות כמו Zapier, Integromat ו-Integrately. בנוסף ניתן להגדיר וובהוק Webhook לכל פעולה, כך שאפשר לחבר את מערכת הדיוור לכלים אחרים שאתם עובדים איתם (כמו CRM, אתר, חנות וירטואלית וכו׳). כמו כן, ניתן ליצור אוטומציות מתקדמות כמו שליחת סדרת מסרים למנויים חדשים, הודעות יומולדת, התראות על תוקף חברות במועדון ועוד.",
  },
]

const PlusIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path className="nl-plus-v" d="M12 4v16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const NewslettersPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Layout>
      <div className="nl">
        <section className="nl-hero">
          <div className="container">
            <h1>קמפיינים וניוזלטרים</h1>
            <p className="nl-hero-sub">
              ממשק נוח, AI שחוסך עבודה, תבניות ממירות, ואוטומציות חכמות כבר
              מהחבילה החינמית
            </p>
            <p className="nl-hero-note">
              שלח מסר מספקת תבניות מוכנות, קוד איכותי, חיבור ל-API, סדרת מסרים
              ואוטומציות מותאמות אישית.
            </p>
            <a href={PANEL_URL} className="nl-btn nl-btn-accent" onClick={openSignup}>
              פתיחת חשבון בחינם
            </a>
          </div>
        </section>

        {/* The claim gets the width, the AI line gets a surface: it is the
            one sentence on the page that is a promise about time. */}
        <section className="nl-editor">
          <div className="container">
            <div className="nl-editor-split">
              <div className="nl-editor-text">
                <h2>צרו מיילים יפייפיים, נקיים ומדויקים שמגיעים לתיבת הנמען</h2>
                <p>
                  התחילו את העבודה עם עורך AI שיחסוך לכם זמן יקר על עיצוב וניסוח.
                  המשיכו את התהליך במערכת{" "}
                  <span className="nl-ltr">Creaditor 3.0</span> עם ממשק פשוט
                  ונוח, להתאמה אישית מדויקת.
                </p>
              </div>
              <p className="nl-pull">AI שבונה דיוור מוכן לשליחה תוך דקות</p>
            </div>
          </div>
        </section>

        {/* Two paragraphs that argue one point, so they sit as one column
            of running text under a rule rather than in boxes. */}
        <section className="nl-keep">
          <div className="container">
            <div className="nl-keep-split">
              <h2>הדרך הנוחה ביותר לשמור על קשר עם הקהל שלך</h2>
              <div className="nl-keep-body">
                <p>
                  בעולם בו כולם שבעים מדיוור – תבדלו את עצמכם. בעזרת מערכת הדיוור
                  של שלח מסר תוכלו לשלוח מיילים מותאמים אישית, מעוצבים וחכמים תוך
                  דקות בודדות.
                </p>
                <p>
                  שמרו על קשר רציף עם הקהל שלכם, תגדילו מכירות ותוודאו שאף אחד לא
                  ישכח אתכם.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="nl-offers">
          <div className="container">
            <div className="nl-head">
              <h2>מה אנחנו מציעים</h2>
            </div>
            <ul className="nl-offer-list">
              {offers.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Each bonus leads with what it costs you, because that is the
            part the paragraph buries at its end. */}
        <section className="nl-bonus">
          <div className="container">
            <div className="nl-head">
              <h2>עוד לא מכירים את שלח מסר?</h2>
              <p>
                הנה הבונוסים שתקבלו על שהחלטתם לנסות, חלקם לכל החיים. משתמשים
                רשומים?{" "}
                <a href={PANEL_URL} className="nl-inline-link">
                  לחצו כאן ושלחו ניוזלטרים
                </a>
                .
              </p>
            </div>

            <dl className="nl-bonus-list">
              {bonuses.map((b) => (
                <div key={b.t} className="nl-bonus-row">
                  <dt>
                    <span className="nl-bonus-t">{b.t}</span>
                    <span className="nl-bonus-hook">{b.hook}</span>
                  </dt>
                  <dd>{b.d}</dd>
                </div>
              ))}
            </dl>

            <p className="nl-bonus-foot">
              כל זה במתנה על שהחלטתם לנסות, אין צורך בכרטיס אשראי. תירשמו,
              תשתמשו בכלים, תשפרו את העסק שלכם ושלמו רק כשהעסק יגדל ותצטרכו
              חבילה גדולה מ-250 מנויים.
            </p>
          </div>
        </section>

        {/* Collapsed panels are 0fr and invisible, so they leave the tab
            order instead of merely going out of sight. */}
        <section className="nl-faq">
          <div className="container">
            <div className="nl-head">
              <h2>שאלות נפוצות</h2>
            </div>

            <div className="nl-qs">
              {faqs.map((f) => {
                const isOpen = openId === f.id
                return (
                  <div className="nl-q" key={f.id} data-open={isOpen}>
                    <h3 className="nl-q-h">
                      <button
                        type="button"
                        className="nl-q-btn"
                        id={`nl-q-${f.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`nl-a-${f.id}`}
                        onClick={() => setOpenId(isOpen ? null : f.id)}
                      >
                        <span>{f.q}</span>
                        <span className="nl-q-sign" aria-hidden="true">
                          <PlusIcon />
                        </span>
                      </button>
                    </h3>
                    <div
                      className="nl-a"
                      id={`nl-a-${f.id}`}
                      role="region"
                      aria-labelledby={`nl-q-${f.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="nl-a-in">
                        <p>{f.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="nl-plans">
          <div className="container">
            <div className="nl-plans-row">
              <div>
                <h2>מתחילים בחינם, עד 250 מנויים</h2>
                <p>
                  חבילה בתשלום מ-<span className="nl-ltr">₪40</span> לחודש, או{" "}
                  <span className="nl-ltr">₪36</span> לחודש בחיוב שנתי, לא כולל
                  מע״מ.
                </p>
              </div>
              <Link to="/pricing/" className="nl-btn nl-btn-light">
                למחירון המלא
              </Link>
            </div>
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default NewslettersPage

export const Head: HeadFC = () => (
  <SEO
    title="קמפיינים וניוזלטרים"
    description="מערכת דיוור של שלח מסר: ממשק נוח, עורך AI שחוסך עבודה, תבניות ממירות ואוטומציות חכמות כבר מהחבילה החינמית, עד 250 מנויים בחינם."
    pathname="/newsletters/"
  />
)
