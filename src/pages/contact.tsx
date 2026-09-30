import React, { useState, useEffect, FormEvent } from "react"
import { Link } from "gatsby"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import CTA from "../components/CTA"
import { SUPPORT_EMAIL } from "../data/api"
import "../styles/contact.css"

/* The numbers the live site publishes on this page. Support answers on
   4600911; 4600600 is the switchboard the topbar already carries. */
const SUPPORT_PHONE = "077-4600911"
const WHATSAPP_NUMBER = "055-9377588"
const WHATSAPP_LINK = "https://api.whatsapp.com/send?phone=972559377588"

/* The site's own icon set: 24-grid, 1.8 stroke, round caps. The WhatsApp
   mark is the one exception — a brand mark is its own lettering, and
   drawing a generic bubble in its place only makes it harder to find. */
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

const MailIcon = () =>
  stroke(
    <>
      <rect x="2" y="4.5" width="20" height="15" rx="2.5" />
      <path d="m2.8 6 8.06 6.2a2 2 0 0 0 2.28 0L21.2 6" />
    </>
  )

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
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

/* ── support hours ──────────────────────────────────────────────
   Sunday to Thursday, 9:00 to 17:00, Israel time. The visitor is not
   necessarily in that timezone, and "are they open right now" is the
   one question a contact page can actually answer for them. */
const TZ = "Asia/Jerusalem"
const OPEN_MIN = 9 * 60
const CLOSE_MIN = 17 * 60
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const HEBREW_DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]

type Status = { open: boolean; note: string }

function readStatus(): Status | null {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date())

  const value = (type: string) => parts.find(p => p.type === type)?.value ?? ""
  const day = WEEKDAYS.indexOf(value("weekday"))
  if (day < 0) return null

  const minutes = Number(value("hour")) % 24 * 60 + Number(value("minute"))
  const isWorkday = day <= 4

  if (isWorkday && minutes >= OPEN_MIN && minutes < CLOSE_MIN) {
    return { open: true, note: "עד 17:00" }
  }
  if (isWorkday && minutes < OPEN_MIN) {
    return { open: false, note: "נפתח היום ב-9:00" }
  }

  let next = (day + 1) % 7
  while (next > 4) next = (next + 1) % 7
  const when = next === (day + 1) % 7 ? "מחר" : `ביום ${HEBREW_DAYS[next]}`
  return { open: false, note: `נפתח ${when} ב-9:00` }
}

/* Null until mounted, so the server-rendered band carries the plain
   opening hours and a page with no JS never shows a stale "open now". */
function useSupportStatus() {
  const [status, setStatus] = useState<Status | null>(null)

  useEffect(() => {
    setStatus(readStatus())
    const id = window.setInterval(() => setStatus(readStatus()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return status
}

const steps = [
  {
    t: "הפרטים מגיעים לצוות התמיכה",
    d: "לא לתיבה כללית. הטופס נוחת אצל הנציגים שעונים בטלפון.",
  },
  {
    t: "נחזור אליכם בזמן שביקשתם",
    d: "בוקר, צהריים או אחר הצהריים, לפי מה שסימנתם בטופס.",
  },
  {
    t: "תוך 24 שעות, לכל היותר",
    d: "בימי פעילות זה בדרך כלל קורה הרבה קודם.",
  },
]

/* Labels and one-liners lifted from the site's own navigation, so the
   page does not describe the same destinations in two different voices. */
const elsewhere = [
  {
    t: "מדריכים",
    d: "צעד אחר צעד, איך עושים הכל במערכת.",
    href: "https://www.sendmsg.co.il/kb/",
    external: true,
  },
  { t: "מאמרים מקצועיים", d: "טיפים וכלים לשיווק חכם יותר.", href: "/blog/", external: false },
  { t: "התממשקות API", d: "מחברים את המערכת לכל כלי אחר.", href: "/api/", external: false },
  {
    t: "תכנית שותפים",
    d: "ממליצים על שלח מסר ומרוויחים.",
    href: "https://www.sendmsg.co.il/affiliate/",
    external: true,
  },
]

const callbackWindows = [
  { id: "morning", label: "שעות הבוקר 9:00–11:00" },
  { id: "midday", label: "שעות הצהריים 11:00–14:00" },
  { id: "afternoon", label: "שעות אחה״צ 14:00–16:30" },
]

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const status = useSupportStatus()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <Layout>
      <div className="ct">
        {/* The page says its own name, then the claim the live site leads
            with, then the only fact that expires: whether anyone is in. */}
        <section className="ct-hero">
          <div className="container">
            <h1 className="ct-hero-title">צור קשר</h1>
            <p className="ct-hero-claim">הצוות שלנו כאן בשבילכם</p>
            <p className="ct-hero-lede">
              טלפון, מייל, וואטסאפ או טופס חזרה. בוחרים את הדרך שנוחה לכם, ומדברים
              עם נציג אמיתי מהצוות.
            </p>
            <p className="ct-status" data-open={status ? status.open : undefined}>
              <span className="ct-status-dot" aria-hidden="true" />
              {status && (
                <>
                  <span>{status.open ? "התמיכה פתוחה עכשיו" : "התמיכה סגורה כרגע"}</span>
                  <span className="ct-status-sep" aria-hidden="true">
                    ·
                  </span>
                </>
              )}
              <span className="ct-status-note">
                {status ? status.note : "ימי ראשון עד חמישי, 9:00 עד 17:00"}
              </span>
            </p>
          </div>
        </section>

        {/* A phone number is the fastest thing on a contact page, so it is
            set at display size instead of being filed into a tile. */}
        <section className="ct-section">
          <div className="container">
            <div className="ct-head">
              <h2>איך להשיג אותנו</h2>
              <p>
                זמני תמיכה של נציגים מהצוות: ימי ראשון עד חמישי, בשעות 9:00–17:00.
              </p>
            </div>

            <a className="ct-call" href={`tel:${SUPPORT_PHONE}`}>
              <span className="ct-call-label">התקשרו אלינו</span>
              <span className="ct-call-num ct-ltr">{SUPPORT_PHONE}</span>
            </a>
            <p className="ct-call-note">הצוות שלנו מחכה לעזור לכם בצד השני.</p>

            <div className="ct-rows">
              <a className="ct-row" href={`mailto:${SUPPORT_EMAIL}`}>
                <span className="ct-row-icon">
                  <MailIcon />
                </span>
                <span className="ct-row-main">
                  <span className="ct-row-t">שלחו לנו מייל</span>
                  <span className="ct-row-v ct-ltr">{SUPPORT_EMAIL}</span>
                  <span className="ct-row-note">נשתדל לענות בהקדם האפשרי.</span>
                </span>
                <span className="ct-row-go">
                  <GoIcon />
                </span>
              </a>

              <a
                className="ct-row"
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="ct-row-icon">
                  <WhatsAppIcon />
                </span>
                <span className="ct-row-main">
                  <span className="ct-row-t">שלחו לנו וואטסאפ</span>
                  <span className="ct-row-v ct-ltr">{WHATSAPP_NUMBER}</span>
                  <span className="ct-row-note">הנציגים שלנו מחכים לכם בצד השני.</span>
                </span>
                <span className="ct-row-go">
                  <GoIcon />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Asymmetric split, not two equal columns: the promise is narrow,
            the work is wide. On one column the form comes first. */}
        <section className="ct-section ct-form-sec">
          <div className="container ct-split">
            <div className="ct-after">
              <div className="ct-head">
                <h2>מה קורה אחרי ששולחים</h2>
              </div>
              <ol className="ct-steps">
                {steps.map((step, i) => (
                  <li className="ct-step" key={step.t}>
                    <span className="ct-step-n" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span>
                      <span className="ct-step-t">{step.t}</span>
                      <span className="ct-step-d">{step.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="ct-form-col">
              <div className="ct-form">
                {submitted ? (
                  <div className="ct-sent" role="status">
                    <svg viewBox="0 0 52 52" width="68" height="68" aria-hidden="true">
                      <circle className="ct-sent-ring" cx="26" cy="26" r="24" fill="none" />
                      <path className="ct-sent-tick" fill="none" d="M14 27l8 8 16-17" />
                    </svg>
                    <h3>הפרטים נשלחו, תודה!</h3>
                    <p>נחזור אליכם בזמן שביקשתם, ולא יאוחר מ-24 שעות.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <p className="ct-form-intro">יש לך שאלה נוספת? אנחנו כאן בשבילך!</p>
                    <p className="ct-form-sub">
                      השאר את הפרטים שלך ונחזור אליך תוך 24 שעות.
                    </p>

                    <div className="ct-field">
                      <label htmlFor="ct-name">איך קוראים לך?</label>
                      <input id="ct-name" name="name" type="text" autoComplete="name" required />
                    </div>

                    <div className="ct-pair">
                      <div className="ct-field">
                        <label htmlFor="ct-phone">מס׳ טלפון שניתן לחזור אליו?</label>
                        <input id="ct-phone" name="phone" type="tel" autoComplete="tel" required />
                      </div>
                      <div className="ct-field">
                        <label htmlFor="ct-email">כתובת מייל פעילה?</label>
                        <input
                          id="ct-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    <div className="ct-field">
                      <label htmlFor="ct-message">
                        משהו נוסף שתרצה לציין?
                        <span className="ct-opt">לא חובה</span>
                      </label>
                      <textarea id="ct-message" name="message" rows={4} />
                    </div>

                    <fieldset className="ct-when">
                      <legend>מתי נוח לך שניצור קשר?</legend>
                      <div className="ct-when-opts">
                        {callbackWindows.map(w => (
                          <React.Fragment key={w.id}>
                            <input
                              className="ct-sr"
                              type="radio"
                              id={`ct-when-${w.id}`}
                              name="callback"
                              value={w.id}
                            />
                            <label className="ct-when-opt" htmlFor={`ct-when-${w.id}`}>
                              {w.label}
                            </label>
                          </React.Fragment>
                        ))}
                      </div>
                    </fieldset>

                    <button type="submit" className="ct-submit">
                      לקבלת שיחת ייעוץ עם נציג מטעם החברה
                    </button>
                    <p className="ct-note">
                      דחוף? התקשרו ל־<span className="ct-ltr">{SUPPORT_PHONE}</span> ותענו מיד
                      בשעות הפעילות.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* A ruled index, not a third row list: the page does not end on the
            family it already used two sections ago. */}
        <section className="ct-section dot-grid">
          <div className="container">
            <div className="ct-head">
              <h2>מרכז הידע</h2>
              <p>מדריכים, מאמרים ותיעוד API. זמינים בכל שעה, גם כשאנחנו לא.</p>
            </div>
            <div className="ct-index">
              {elsewhere.map(item =>
                item.external ? (
                  <a
                    className="ct-entry"
                    key={item.t}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="ct-entry-t">
                      {item.t}
                      <GoIcon size={17} />
                    </span>
                    <span className="ct-entry-d">{item.d}</span>
                  </a>
                ) : (
                  <Link className="ct-entry" key={item.t} to={item.href}>
                    <span className="ct-entry-t">
                      {item.t}
                      <GoIcon size={17} />
                    </span>
                    <span className="ct-entry-d">{item.d}</span>
                  </Link>
                )
              )}
            </div>
          </div>
        </section>
      </div>

      <CTA />
    </Layout>
  )
}

export default ContactPage

export const Head: HeadFC = () => (
  <SEO
    title="צרו קשר"
    description="הצוות של שלח מסר כאן בשבילכם. טלפון 077-4600911, מייל, וואטסאפ או טופס חזרה, ראשון עד חמישי 9:00 עד 17:00."
    pathname="/contact/"
  />
)
