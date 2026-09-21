import React, { useState } from "react"
import { Link } from "gatsby"
import { openSignup, PANEL_URL } from "./SignupDialog"

const CheckIcon = () => (
  <span className="pp-check" aria-hidden="true">
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M2 6.5L4.5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
)

const plans = [
  {
    name: "חבילה למתחילים",
    tagline: "להכיר את המערכת בקצב שלכם",
    price: { word: "חינם" },
    period: "לתמיד, בלי כרטיס אשראי",
    lead: "מה מקבלים:",
    highlight: false,
    features: [
      "250 מנויים",
      "2,000 דיוורים בחודש",
      "5 דפי נחיתה",
      "בונה קורסים דיגיטליים",
      "תמיכה במייל",
    ],
    cta: { label: "פתיחת חשבון בחינם", href: PANEL_URL, signup: true },
  },
  {
    name: "חבילה משודרגת",
    tagline: "לעסק שרוצה לצמוח עם כל הכלים",
    price: { num: "40", currency: "₪" },
    period: "לחודש, בחיוב שנתי",
    lead: "כל מה שבחבילה למתחילים, ובנוסף:",
    highlight: true,
    features: [
      "שליחות יומיות ללא הגבלה",
      "דפי נחיתה ללא הגבלה",
      "קורסים דיגיטליים ו-CRM",
      "API מלא וייצוא לאקסל",
      "תמיכה במייל, בצ׳אט ובטלפון",
    ],
    cta: { label: "שדרגו עכשיו", href: PANEL_URL, signup: false },
  },
  {
    name: "חבילה מותאמת",
    tagline: "לארגונים ולעסקים גדולים",
    price: { word: "מותאם אישית" },
    period: "מחיר שנקבע יחד איתכם",
    lead: "כל מה שבחבילה המשודרגת, ובנוסף:",
    highlight: false,
    features: [
      "100,000+ אנשי קשר",
      "ליווי הקמה אישי",
      "מנהל חשבון ייעודי",
      "SLA מובטח",
      "אינטגרציות מותאמות",
    ],
    cta: { label: "דברו איתנו", href: "/contact/", signup: false },
  },
]

const included = [
  {
    title: "מצב שומר שבת",
    text: "חסימת דפים ועיכוב דיוורים מכניסת שבת וחג ועד צאתם, מובנה בכל חבילה.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    ),
  },
  {
    title: "אבטחת מידע ISO 27001",
    text: "המערכת עומדת בתקן אבטחת המידע הבינלאומי ובתקנות הפרטיות.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "מותאם לכל מסך",
    text: "ניוזלטרים, דפי נחיתה וקורסים שנראים מצוין בנייד, בטאבלט ובמחשב.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </svg>
    ),
  },
  {
    title: "מערכת ישראלית ותיקה",
    text: "מאז 2009, עם ממשק בעברית ותמיכה בעברית מצוות שמכיר את העסקים כאן.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

const faqs = [
  {
    q: "האם החבילה החינמית מוגבלת בזמן?",
    a: "לא. חבילת המתחילים היא בחינם לתמיד, עד 250 מנויים ו-2,000 דיוורים בחודש. בלי כרטיס אשראי ובלי התחייבות.",
  },
  {
    q: "איך משדרגים חבילה?",
    a: "משדרגים מתוך המערכת בכל שלב שמתאים לכם. כל אנשי הקשר, דפי הנחיתה והקמפיינים שלכם נשארים בדיוק כמו שהם.",
  },
  {
    q: "איזו תמיכה מקבלים בכל חבילה?",
    a: "בחבילה למתחילים תקבלו תמיכה במייל. בחבילה המשודרגת גם בצ׳אט ובטלפון, ובחבילה המותאמת מלווה אתכם מנהל חשבון ייעודי.",
  },
  {
    q: "מה זה מצב שומר שבת?",
    a: "תכונה ייחודית שחוסמת דפי נחיתה ומעכבת דיוורים מתוזמנים מכניסת שבת וחג ועד צאתם, לפי זמנים מדויקים. זמינה בכל החבילות.",
  },
  {
    q: "למי מתאימה החבילה המותאמת?",
    a: "לארגונים ולעסקים עם מעל 100,000 אנשי קשר, או עם צרכים מיוחדים כמו אינטגרציות מותאמות, SLA מובטח ומנהל חשבון ייעודי. צרו קשר ונבנה חבילה יחד.",
  },
  {
    q: "איך מתחילים?",
    a: "נרשמים בחינם, בלי כרטיס אשראי. תוך כמה דקות אפשר לשלוח את הדיוור הראשון שלכם.",
  },
]

const PricingFAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="pp-faq">
      <div className="container">
        <h2>שאלות על המחירון</h2>
        <p className="pp-faq-sub">ולא מצאתם תשובה? נשמח לעזור בצ׳אט או בטלפון</p>
        <div className="pp-faq-list">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="pp-faq-item" data-open={open === i}>
              <button
                className="pp-faq-q"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{faq.q}</span>
                <span className="pp-faq-arrow" aria-hidden="true">▾</span>
              </button>
              {open === i && <div className="pp-faq-a">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Pricing: React.FC = () => (
  <div className="pp" id="pricing">
    <section className="pp-hero">
      <div className="container">
        <h1>מחירון פשוט ושקוף</h1>
        <p className="pp-hero-sub">
          מתחילים בחינם, בלי כרטיס אשראי ובלי התחייבות.
          <br />
          משדרגים רק כשזה מתאים לעסק שלכם.
        </p>
        <div className="pp-trust">
          {["בלי כרטיס אשראי", "מעל 50,000 משתמשים מאז 2009", "תקן אבטחת מידע ISO 27001"].map((t) => (
            <span key={t}>
              <svg width="15" height="15" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6.5L4.5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>

    <section className="pp-plans">
      <div className="container">
        <div className="pp-grid">
          {plans.map((plan) => (
            <div key={plan.name} className={`pp-card${plan.highlight ? " pp-card-popular" : ""}`}>
              {plan.highlight && <div className="pp-badge">הכי פופולרי</div>}
              <h2 className="pp-plan-name">{plan.name}</h2>
              <p className="pp-plan-tagline">{plan.tagline}</p>

              <div className="pp-price-row">
                {"num" in plan.price ? (
                  <>
                    <span className="pp-price-num">{plan.price.num}</span>
                    <span className="pp-price-cur">{plan.price.currency}</span>
                  </>
                ) : (
                  <span className="pp-price-word">{plan.price.word}</span>
                )}
              </div>
              <p className="pp-price-period">{plan.period}</p>

              <div className="pp-tear" aria-hidden="true" />

              <p className="pp-lead">{plan.lead}</p>
              <ul className="pp-features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.cta.href.startsWith("/") ? (
                <Link to={plan.cta.href} className="pp-btn-outline">
                  {plan.cta.label}
                </Link>
              ) : plan.highlight ? (
                <a href={plan.cta.href} className="primary-btn">
                  {plan.cta.label}
                </a>
              ) : (
                <a
                  href={plan.cta.href}
                  className="pp-btn-outline"
                  onClick={plan.cta.signup ? openSignup : undefined}
                >
                  {plan.cta.label}
                </a>
              )}
            </div>
          ))}
        </div>
        <p className="pp-plans-note">אפשר לשדרג או לעבור חבילה בכל שלב, בלי להקים שום דבר מחדש.</p>
      </div>
    </section>

    <section className="pp-band">
      <div className="container">
        <h2>בכל חבילה, בלי קשר למחיר</h2>
        <p className="pp-band-sub">הדברים שחשובים לנו לתת לכל עסק, מהיום הראשון</p>
        <div className="pp-band-grid">
          {included.map((item) => (
            <div key={item.title} className="pp-band-item">
              {item.icon}
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
)

export { PricingFAQ }
export default Pricing
