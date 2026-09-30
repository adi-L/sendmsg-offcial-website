import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import "../styles/creaditor.css"

/* Creaditor is a separate product with its own site. Every outbound
   link here leaves sendmsg.co.il, so they all open in a new tab and
   the page never pretends to be the product's own home. */
const CREADITOR_URL = "https://creaditor.ai/"

/* The site's icon set: 24-grid, 1.8 stroke, round caps, drawn rather
   than borrowed from a font. */
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

/* Points the way the language runs. */
const GoIcon = ({ size = 20 }: { size?: number }) =>
  stroke(
    <>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </>,
    size
  )

const ImageIcon = () =>
  stroke(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <circle cx="8.6" cy="8.6" r="1.6" />
      <path d="M21 14.5 16.4 10 5 21" />
    </>,
    34
  )

const builderIcons: Record<string, React.ReactNode> = {
  courses: (
    <>
      <path d="M3 6.5 12 3l9 3.5-9 3.5z" />
      <path d="M21 6.5v5" />
      <path d="M6.5 8.7v5.6c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9V8.7" />
    </>
  ),
  forms: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M8.5 8.5h7" />
      <path d="M8.5 12.5h7" />
      <path d="M8.5 16.5h3.5" />
    </>
  ),
  newsletters: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.3 6.4 7.5 5.8a2 2 0 0 0 2.4 0l7.5-5.8" />
    </>
  ),
  pages: (
    <>
      <rect x="3" y="3.5" width="18" height="17" rx="2.5" />
      <path d="M3 9h18" />
      <path d="M9 20.5V9" />
    </>
  ),
  sites: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.4 9.5h17.2" />
      <path d="M3.4 14.5h17.2" />
      <path d="M12 3c-2.4 2.4-3.6 5.4-3.6 9s1.2 6.6 3.6 9c2.4-2.4 3.6-5.4 3.6-9S14.4 5.4 12 3Z" />
    </>
  ),
}

/* Wording follows creaditor.ai's own page, translated rather than
   reinvented. The product names stay in Latin script because that is
   how the product ships. */
const builders = [
  {
    icon: "courses",
    name: "Creaditor Courses",
    claim: "להפוך את מה שהמשתמשים שלכם יודעים לקורס שהם יכולים למכור.",
    shot: "builder-courses",
    shotLabel: "עורך הקורסים: מסך בניית שיעורים עם תפריט הפרקים",
  },
  {
    icon: "forms",
    name: "Creaditor Forms",
    claim: "לאסוף כל דבר, ולהציג אותו בכל מקום.",
    shot: "builder-forms",
    shotLabel: "עורך הטפסים: שדות בגרירה ותצוגת התשובות",
  },
  {
    icon: "newsletters",
    name: "Creaditor Newsletters",
    claim: "לשלוח קמפיינים שנראים מעוצבים, לא מורכבים מחלקים.",
    shot: "builder-newsletters",
    shotLabel: "עורך הניוזלטרים: מייל מעוצב עם סרגל הבלוקים",
  },
  {
    icon: "pages",
    name: "Creaditor Pages",
    claim: "להשיק את דף הקמפיין בלי לפתוח קריאה לפיתוח.",
    shot: "builder-pages",
    shotLabel: "עורך דפי הנחיתה: דף נחיתה בתצוגת עריכה",
  },
  {
    icon: "sites",
    name: "Creaditor Sites",
    claim: "אתר שלם, מפורסם תחת המותג שלכם.",
    shot: "builder-sites",
    shotLabel: "בונה האתרים: מפת עמודים לצד תצוגה מקדימה",
  },
]

/* "What it remembers", straight off the product page. */
const memory = [
  { t: "לוגו וצבעי המותג", d: "הנכסים של הלקוח נטענים פעם אחת ומשמשים בכל בונה." },
  { t: "ערכת נושא וטיפוגרפיה", d: "אותן החלטות עיצוב חוזרות בכל מה שנבנה." },
  { t: "קהל היעד", d: "למי הלקוח מדבר, ולכן באיזו רמה הטקסט נכתב." },
  { t: "טון הדיבור", d: "איך הלקוח נשמע, לא איך מודל שפה נשמע כברירת מחדל." },
  { t: "כל מה שנבנה בבונים האחרים", d: "דף נחיתה שנבנה אתמול הוא הקשר למייל של מחר." },
]

const frameworks = ["React", "Vue", "Angular", "Next.js", "WordPress", "Plain HTML"]

/* Every image on this page is still a slot. The label is the brief:
   each one names the asset that belongs there, so the page carries its
   own shot list until the real files land. */
const Shot = ({
  id,
  label,
  ratio = "16 / 10",
  tone,
}: {
  id: string
  label: string
  ratio?: string
  tone?: "ink"
}) => (
  <figure className="cr-shot" data-tone={tone} style={{ aspectRatio: ratio }}>
    <span className="cr-shot-icon">
      <ImageIcon />
    </span>
    <figcaption className="cr-shot-label">
      <span className="cr-shot-id cr-ltr">{id}</span>
      <span className="cr-shot-text">{label}</span>
    </figcaption>
  </figure>
)

const CreaditorPage = () => {
  return (
    <Layout>
      <div className="cr">
        {/* ── hero ───────────────────────────────────────────────
            Ink band, asymmetric: the claim on one side, the product
            itself on the other. */}
        <section className="cr-hero">
          <div className="container cr-hero-in">
            <div className="cr-hero-said">
              <h1 className="cr-hero-title cr-ltr">Creaditor</h1>
              <p className="cr-hero-claim">חמישה בונים. מוח אחד.</p>
              <p className="cr-hero-lede">
                חמישה בונים שמשתלבים בתוך המוצר שלכם, מופעלים על ידי המשתמשים או
                על ידי סוכני AI, וחולקים מוח אחד.
              </p>
              <div className="cr-hero-acts">
                <a
                  className="primary-btn cr-btn"
                  href={CREADITOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  לאתר Creaditor
                  <GoIcon size={18} />
                </a>
                <a
                  className="cr-btn-ghost"
                  href={CREADITOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  לתיאום שיחה
                </a>
              </div>
              <ul className="cr-hero-strip" aria-label="הבונים">
                {builders.map((b) => (
                  <li key={b.name} className="cr-ltr">
                    {b.name.replace("Creaditor ", "")}
                  </li>
                ))}
              </ul>
            </div>
            <div className="cr-hero-shot">
              <Shot
                id="hero-editor.webp"
                label="צילום מסך ראשי: עורך Creaditor פתוח על דיוור במותג של לקוח"
                ratio="16 / 11"
                tone="ink"
              />
            </div>
          </div>
        </section>

        {/* ── the five ───────────────────────────────────────────
            A numbered hairline list, not five equal tiles: these are
            five named things with one claim each, and that is a list. */}
        <section className="cr-section">
          <div className="container">
            <div className="cr-head">
              <h2>חמישה בונים</h2>
              <p>
                אחד לכל דבר שהלקוחות שלכם צריכים לבנות, וכולם מדברים עם אותו
                מוח.
              </p>
            </div>
            <ol className="cr-builders">
              {builders.map((b, i) => (
                <li className="cr-builder" key={b.name}>
                  <span className="cr-builder-n cr-ltr" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="cr-builder-icon">
                    {stroke(builderIcons[b.icon])}
                  </span>
                  <span className="cr-builder-main">
                    <strong className="cr-builder-name cr-ltr">{b.name}</strong>
                    <span className="cr-builder-claim">{b.claim}</span>
                  </span>
                  <span className="cr-builder-shot">
                    <Shot id={`${b.shot}.webp`} label={b.shotLabel} />
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── the brain ──────────────────────────────────────────
            Narrow claim, wide evidence. The memory is label and
            explanation, so it is a definition list. */}
        <section className="cr-section cr-brain-sec">
          <div className="container cr-split cr-split-brain">
            <div className="cr-brain-said">
              <div className="cr-head">
                <h2>המוח</h2>
                <p>
                  הוא כבר מכיר את העסק. במקום להתחיל מדף ריק, כל בונה נפתח עם
                  ההקשר של הלקוח כבר בפנים. לסוכנים יש גישה לאותו הקשר עצמו דרך
                  נקודת קצה MCP.
                </p>
              </div>
              <Shot
                id="brain-context.webp"
                label="לוח ההקשר: לוגו, צבעים, טיפוגרפיה וטון הדיבור של הלקוח"
                ratio="4 / 3"
              />
            </div>
            <div className="cr-memory-col">
              <p className="cr-memory-kicker">מה הוא זוכר</p>
              <dl className="cr-memory">
                {memory.map((m) => (
                  <div className="cr-mem" key={m.t}>
                    <dt>{m.t}</dt>
                    <dd>{m.d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ── the contrast ───────────────────────────────────────
            The product's own comparison, kept as two facing panels
            rather than a feature table. */}
        <section className="cr-section cr-vs-sec">
          <div className="container">
            <p className="cr-vs-kicker">קנבס ריק נמכר בנפרד. אצל אחרים.</p>
            <div className="cr-vs">
              <div className="cr-vs-panel" data-side="other">
                <p className="cr-vs-who">כל בונה AI אחר</p>
                <p className="cr-vs-what">קנבס ריק ובורר צבעים.</p>
                <Shot
                  id="vs-empty-canvas.webp"
                  label="קנבס ריק: עורך פתוח בלי תוכן ובלי מותג"
                  ratio="16 / 10"
                />
              </div>
              <div className="cr-vs-panel" data-side="brain">
                <p className="cr-vs-who">עם המוח</p>
                <p className="cr-vs-what">מייל גמור, במותג, מהפעם הראשונה.</p>
                <Shot
                  id="vs-finished-email.webp"
                  label="אותו מסך אחרי המוח: דיוור גמור בצבעי הלקוח"
                  ratio="16 / 10"
                  tone="ink"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── two ways in ────────────────────────────────────────
            Two doors, one context. Split down the middle because the
            two halves really are symmetrical here. */}
        <section className="cr-section cr-ways-sec">
          <div className="container">
            <div className="cr-head">
              <h2>שתי דרכים להיכנס, מוח אחד</h2>
              <p>
                משלבים את הבונה למשתמשים שלכם. מפנים את הסוכנים שלכם לאותו הקשר.
                אף אחד מהשניים לא מתחיל מדף ריק.
              </p>
            </div>
            <div className="cr-ways">
              <div className="cr-way">
                <p className="cr-way-t">למשתמשים שלכם</p>
                <p className="cr-way-d">
                  תג סקריפט אחד. בלי שלב build, בלי CSS לייבא, בלי backend
                  להקים.
                </p>
                <ul className="cr-chips" aria-label="סביבות נתמכות">
                  {frameworks.map((f) => (
                    <li key={f} className="cr-ltr">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cr-way">
                <p className="cr-way-t">לסוכנים שלכם</p>
                <p className="cr-way-d">
                  נקודת קצה <span className="cr-ltr">MCP</span> שמחזירה לסוכן את
                  אותו הקשר ואת אותם בלוקים שהמשתמש מקבל בעורך.
                </p>
                <ul className="cr-chips" aria-label="מה הסוכן מקבל">
                  <li>ההקשר של הלקוח</li>
                  <li>הבלוקים</li>
                  <li>הפרסום</li>
                </ul>
              </div>
            </div>
            <p className="cr-proof">
              הבונים האלה מריצים את העורכים של <strong>שלח מסר</strong>, מערכת
              הדיוור שמשרתת אלפי לקוחות בישראל ובעולם.
            </p>
          </div>
        </section>

        {/* ── white label ────────────────────────────────────────
            One sentence, set as type. No card. */}
        <section className="cr-label-sec">
          <div className="container cr-label-in">
            <p className="cr-label-claim">הלוגו שלכם. הצבעים שלכם. הבעיה שלנו.</p>
            <p className="cr-label-d">
              <span className="cr-ltr">White-label</span> מהרנדר הראשון. שום דבר
              שהמשתמשים שלכם נוגעים בו לא אומר{" "}
              <span className="cr-ltr">Creaditor</span>.
            </p>
          </div>
        </section>

        {/* ── out ────────────────────────────────────────────────
            The page ends where the product lives. */}
        <section className="cr-section cr-out-sec">
          <div className="container cr-out">
            <div className="cr-out-said">
              <h2>חמישה בונים בתוך המוצר שלכם</h2>
              <p>נעזור לכם להשיק את זה.</p>
            </div>
            <div className="cr-out-acts">
              <a
                className="primary-btn cr-btn"
                href={CREADITOR_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                לאתר Creaditor
                <GoIcon size={18} />
              </a>
              <a
                className="cr-out-link"
                href={CREADITOR_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="cr-ltr">creaditor.ai</span>
                <GoIcon size={18} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default CreaditorPage

export const Head: HeadFC = () => (
  <SEO
    title="Creaditor"
    description="Creaditor: חמישה בונים שמשתלבים בתוך המוצר שלכם, לקורסים, טפסים, ניוזלטרים, דפי נחיתה ואתרים, כולם עם מוח AI אחד שמכיר את המותג של הלקוח."
    pathname="/creaditor/"
  />
)
