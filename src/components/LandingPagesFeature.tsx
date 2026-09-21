import React, { useEffect, useRef, useState } from "react"
import { openSignup, PANEL_URL } from "./SignupDialog"

const benefits = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    title: "בונים בלי קוד",
    text: "עורך גרירה ושחרור עם תבניות מעוצבות, וה-AI עוזר לנסח כותרות וטקסטים שמתאימים לעסק.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="16" y1="11" x2="22" y2="11" />
      </svg>
    ),
    title: "הלידים נכנסים ישר למערכת",
    text: "כל מי שממלא את הטופס נשמר אוטומטית ברשימת התפוצה שלכם, מוכן לדיוור או לאוטומציה הבאה.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="11.4" y1="18" x2="12.6" y2="18" />
      </svg>
    ),
    title: "נראה מצוין בכל מסך",
    text: "הדף מותאם אוטומטית לנייד, לטאבלט ולמחשב, בלי שתצטרכו לגעת בשום דבר.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "מחובר לעסק שלכם",
    text: "דומיין אישי, Google Analytics ופיקסלים של גוגל ופייסבוק, הכל מוגדר מתוך המערכת.",
  },
]

const LandingPagesFeature: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [reveal, setReveal] = useState<"idle" | "pending" | "visible">("idle")

  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReveal("visible")
          observer.disconnect()
        } else {
          setReveal((r) => (r === "idle" ? "pending" : r))
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="landing-pages"
      ref={sectionRef}
      className={`section lp-feature${reveal === "pending" ? " lp-reveal-pending" : ""}`}
    >
      <div className="container">
        <div className="lp-feature-grid">
          <div className="lp-feature-copy">
            <h2 className="lp-feature-title">דף נחיתה מקצועי, מוכן תוך דקות</h2>
            <p className="lp-feature-lead">
              בוחרים תבנית או מתארים ל-AI מה אתם צריכים, מתאימים טקסטים
              וצבעים, ומפרסמים. בלי מעצב, בלי מתכנת ובלי לצאת מהמערכת.
            </p>

            <ul className="lp-feature-list">
              {benefits.map((b) => (
                <li key={b.title} className="lp-feature-item">
                  <span className="lp-feature-icon">{b.icon}</span>
                  <div>
                    <h3 className="lp-feature-item-title">{b.title}</h3>
                    <p className="lp-feature-item-text">{b.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="lp-feature-cta-row">
              <a href={PANEL_URL} className="primary-btn" onClick={openSignup}>
                בונים דף נחיתה בחינם
              </a>
              <p className="lp-feature-note">
                עד <strong>5 דפי נחיתה</strong> בחבילה החינמית, ללא הגבלת זמן
              </p>
            </div>
          </div>

          <div className="lp-mockup" aria-hidden="true">
            <div className="lp-browser">
              <div className="lp-browser-bar">
                <span className="lp-browser-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="lp-browser-url">studio-noa.co.il</span>
              </div>
              <div className="lp-demo">
                <div className="lp-demo-nav">
                  <span className="lp-demo-logo">סטודיו נועה</span>
                  <span className="lp-demo-links">
                    <span>הסדנאות</span>
                    <span>עלינו</span>
                    <span>צרו קשר</span>
                  </span>
                </div>
                <div className="lp-demo-banner">
                  <svg viewBox="0 0 64 64" width="52" height="52" fill="none" stroke="#8a5738" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M24 14h16c-1.5 6-1.5 10 2 14 4.4 5 5 12-2 20a12 12 0 0 1-16 0c-7-8-6.4-15-2-20 3.5-4 3.5-8 2-14z" />
                    <path d="M22 14h20" />
                    <path d="M26 40c2 2.4 10 2.4 12 0" />
                  </svg>
                </div>
                <h4 className="lp-demo-h">סדנת קרמיקה למתחילים</h4>
                <p className="lp-demo-p">
                  ארבעה מפגשים בסטודיו בפלורנטין. כל הציוד עלינו, אתם רק
                  מגיעים עם ידיים נקיות וראש פתוח.
                </p>
                <div className="lp-demo-form">
                  <span className="lp-demo-field">שם מלא</span>
                  <span className="lp-demo-field">טלפון</span>
                  <span className="lp-demo-btn">שריינו לי מקום</span>
                </div>
                <p className="lp-demo-foot">נשארו 4 מקומות למחזור מרץ</p>
              </div>
            </div>

            <div className="lp-phone">
              <div className="lp-phone-screen">
                <span className="lp-phone-logo">סטודיו נועה</span>
                <span className="lp-phone-h">סדנת קרמיקה למתחילים</span>
                <span className="lp-phone-field">שם מלא</span>
                <span className="lp-phone-field">טלפון</span>
                <span className="lp-phone-btn">שריינו לי מקום</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingPagesFeature
