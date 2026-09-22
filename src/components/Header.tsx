import React, { useState, useEffect, useRef } from "react"
import { withPrefix } from "gatsby"
import { useLocation } from "@reach/router"
import logo from "../images/logo.png"
import { openSignup } from "./SignupDialog"

import megaServices from "../images/blog/mailing-system.webp"
import megaPricing from "../images/illustrations/sms-bank.svg"
import megaSupport from "../images/illustrations/collab.svg"
import megaKnowledge from "../images/blog/digital-course-guide.webp"

const PANEL_URL = "https://panel.sendmsg.co.il/"

const ICON_PATHS: Record<string, React.ReactNode> = {
  package: (
    <>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.3 7l8.7 5 8.7-5M12 22V12" />
    </>
  ),
  messageSquare: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />,
  hash: <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />,
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 6L2 7" />
    </>
  ),
  layout: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </>
  ),
  graduation: (
    <>
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12.5V17c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5" />
    </>
  ),
  messageCircle: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </>
  ),
  code: <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />,
  book: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />,
  fileText: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </>
  ),
}

const Icon: React.FC<{ name: string }> = ({ name }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICON_PATHS[name]}
  </svg>
)

type MegaItem = { label: string; href: string; icon: string; desc: string }
type MegaMedia = { image: string; alt: string; caption: string; ctaLabel: string; ctaHref: string; contain?: boolean }
type NavItem = {
  label: string
  href: string
  items?: MegaItem[]
  media?: MegaMedia
}

const navItems: NavItem[] = [
  { label: "אודות", href: "/about/" },
  {
    label: "מחירון",
    href: "/pricing/",
    items: [
      { label: "חבילות דיוור", href: "/pricing/", icon: "package", desc: "כל המסלולים, מהחבילה החינמית ועד הבלתי מוגבלת." },
      { label: "בנק סמסים", href: "https://www.sendmsg.co.il/pricelist/smsbank/", icon: "messageSquare", desc: "רוכשים סמסים מראש ומשתמשים בקצב שלכם." },
      { label: "בנק שליחות", href: "https://www.sendmsg.co.il/pricelist/emailbank/", icon: "send", desc: "בנק דיוורים ללא מנוי חודשי." },
      { label: "מספר וירטואלי", href: "https://www.sendmsg.co.il/virtualnumber/", icon: "hash", desc: "מספר ייעודי לשליחה וקבלה של הודעות." },
    ],
    media: {
      image: megaPricing,
      alt: "חבילות ומסלולים",
      caption: "מתחילים בחינם, ומשדרגים רק כשהעסק גדל.",
      ctaLabel: "למחירון המלא ←",
      ctaHref: "/pricing/",
      contain: true,
    },
  },
  {
    label: "שירותים",
    href: "https://www.sendmsg.co.il/services/",
    items: [
      { label: "ניוזלטרים וקמפיינים", href: "https://www.sendmsg.co.il/newsletters/", icon: "mail", desc: "מעצבים ושולחים קמפיינים בתוך דקות." },
      { label: "דפי נחיתה", href: "https://www.sendmsg.co.il/landingpages/", icon: "layout", desc: "דף נחיתה מעוצב, בלי מעצב ובלי מתכנת." },
      { label: "קורסים דיגיטליים", href: "https://www.sendmsg.co.il/digitalcourses/", icon: "graduation", desc: "מעלים קורס, גובים תשלום, הכל במקום אחד." },
      { label: "מערכת סמסים (SMS)", href: "https://www.sendmsg.co.il/%d7%a9%d7%9c%d7%99%d7%97%d7%aa-%d7%a1%d7%9e%d7%a1%d7%99%d7%9d/", icon: "messageCircle", desc: "הודעות אישיות וקמפיינים המוניים." },
      { label: "ניהול מועדון לקוחות (CRM)", href: "https://www.sendmsg.co.il/crm/", icon: "users", desc: "כל הלקוחות והפילוחים במקום אחד." },
      { label: "פגישות ושיתופי פעולה", href: "https://www.sendmsg.co.il/meetings/", icon: "calendar", desc: "תיאום פגישות בלי פינג פונג של הודעות." },
      { label: "דומיין פרטי", href: "https://www.sendmsg.co.il/%d7%93%d7%95%d7%9e%d7%99%d7%99%d7%9f-%d7%a4%d7%a8%d7%98%d7%99/", icon: "globe", desc: "כתובת משלכם לדפים ולדיוורים." },
    ],
    media: {
      image: megaServices,
      alt: "מערכת הדיוור של שלח מסר",
      caption: "כל כלי השיווק, במנוי אחד.",
      ctaLabel: "לכל השירותים ←",
      ctaHref: "https://www.sendmsg.co.il/services/",
    },
  },
  {
    label: "תמיכה ושירות",
    href: "/support/",
    items: [
      { label: "צרו קשר", href: "/contact/", icon: "phone", desc: "טלפון, WhatsApp או טופס, איך שנוח לכם." },
      { label: "תכנית שותפים", href: "https://www.sendmsg.co.il/affiliate/", icon: "share", desc: "ממליצים על שלח מסר ומרוויחים." },
      { label: "התממשקות API", href: "https://www.sendmsg.co.il/api/", icon: "code", desc: "מחברים את המערכת לכל כלי אחר." },
    ],
    media: {
      image: megaSupport,
      alt: "צוות התמיכה",
      caption: "בני אדם עונים לכם, בעברית.",
      ctaLabel: "לצרו קשר ←",
      ctaHref: "/contact/",
      contain: true,
    },
  },
  {
    label: "מרכז הידע",
    href: "/blog/",
    items: [
      { label: "מדריכים", href: "https://www.sendmsg.co.il/kb/", icon: "book", desc: "צעד אחר צעד, איך עושים הכל במערכת." },
      { label: "מאמרים מקצועיים", href: "/blog/", icon: "fileText", desc: "טיפים וכלים לשיווק חכם יותר." },
    ],
    media: {
      image: megaKnowledge,
      alt: "מרכז הידע של שלח מסר",
      caption: "ידע שעוזר לשווק טוב יותר.",
      ctaLabel: "לכל המאמרים ←",
      ctaHref: "/blog/",
    },
  },
  { label: "שומר שבת", href: "/shomer-shabbat/" },
]

// Trailing slash keeps section matching honest: "/about/" must not light up
// on "/about-us/"
const withTrailingSlash = (path: string) => {
  const clean = path.split(/[?#]/)[0]
  return clean.endsWith("/") ? clean : `${clean}/`
}

const Caret: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className="nav-caret"
    style={open ? { transform: "rotate(180deg)" } : undefined}
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openMega, setOpenMega] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!openMega) return
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMega(null)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMega(null)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [openMega])

  const activeItem = navItems.find((item) => item.label === openMega)

  const { pathname } = useLocation()
  const currentPath = withTrailingSlash(pathname)
  const homePath = withTrailingSlash(withPrefix("/"))

  const matchesPath = (href: string) => {
    if (!href.startsWith("/")) return false
    const target = withTrailingSlash(withPrefix(href))
    // every path starts with home, so it only counts as an exact match
    return target === homePath
      ? currentPath === target
      : currentPath.startsWith(target)
  }

  // a section also counts as current when we are on one of its mega items,
  // e.g. /contact/ lights up "תמיכה ושירות"
  const isCurrent = (item: NavItem) =>
    matchesPath(item.href) || (item.items?.some((sub) => matchesPath(sub.href)) ?? false)

  return (
    <>
      <div style={styles.topBar}>
        <div className="container" style={styles.topBarInner}>
          <a href="tel:077-4600600" style={styles.topBarLink}>
            077-4600600 ☎
          </a>
          <span style={styles.topBarText}>ספק מורשה מס׳ הגנה: 11011707</span>
        </div>
      </div>
      <header ref={headerRef} className={`site-header${scrolled ? " site-header-scrolled" : ""}`}>
        <div className="container site-header-inner">
          <a href={withPrefix("/")} className="site-logo">
            <img src={logo} alt="שלח מסר - SendMsg" style={styles.logoImg} />
          </a>

          <nav className="site-nav" aria-label="תפריט ראשי">
            {navItems.map((item) =>
              item.items ? (
                <button
                  key={item.label}
                  type="button"
                  className={`nav-link${openMega === item.label ? " nav-link-active" : ""}${
                    isCurrent(item) ? " nav-link-current" : ""
                  }`}
                  aria-expanded={openMega === item.label}
                  aria-current={isCurrent(item) ? "true" : undefined}
                  onClick={() => setOpenMega(openMega === item.label ? null : item.label)}
                >
                  {item.label}
                  <Caret open={openMega === item.label} />
                </button>
              ) : (
                <a
                  key={item.label}
                  href={withPrefix(item.href)}
                  className={`nav-link${isCurrent(item) ? " nav-link-current" : ""}`}
                  aria-current={isCurrent(item) ? "page" : undefined}
                >
                  {item.label}
                </a>
              )
            )}
          </nav>

          <div className="header-actions">
            <a href={PANEL_URL} style={styles.loginBtn}>
              כניסה
            </a>
            <a href={PANEL_URL} className="primary-btn" style={styles.trialBtn} onClick={openSignup}>
              ניסיון חינם
            </a>
          </div>

          <button
            className="header-burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="תפריט"
            aria-expanded={menuOpen}
          >
            <span style={{ ...styles.burgerLine, ...(menuOpen ? styles.burgerLine1Open : {}) }} />
            <span style={{ ...styles.burgerLine, ...(menuOpen ? styles.burgerLine2Open : {}) }} />
            <span style={{ ...styles.burgerLine, ...(menuOpen ? styles.burgerLine3Open : {}) }} />
          </button>
        </div>

        {activeItem?.items && (
          <div className="mega-panel">
            <div className="container mega-inner">
              <div className="mega-items">
                {activeItem.items.map((sub) => (
                  <a key={sub.href + sub.label} href={withPrefix(sub.href)} className="mega-item" onClick={() => setOpenMega(null)}>
                    <span className="mega-item-icon">
                      <Icon name={sub.icon} />
                    </span>
                    <span>
                      <strong>{sub.label}</strong>
                      <span className="mega-item-desc">{sub.desc}</span>
                    </span>
                  </a>
                ))}
              </div>
              {activeItem.media && (
                <div className={`mega-media${activeItem.media.contain ? " mega-media-contain" : ""}`}>
                  <img src={activeItem.media.image} alt={activeItem.media.alt} loading="lazy" />
                  <p>{activeItem.media.caption}</p>
                  <a href={withPrefix(activeItem.media.ctaHref)} onClick={() => setOpenMega(null)}>
                    {activeItem.media.ctaLabel}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {menuOpen && (
          <div className="mobile-menu">
            {navItems.map((item) => (
              <React.Fragment key={item.label}>
                <a
                  href={withPrefix(item.href)}
                  className={`mobile-nav-link${isCurrent(item) ? " mobile-nav-link-current" : ""}`}
                  aria-current={isCurrent(item) ? "page" : undefined}
                >
                  {item.label}
                </a>
                {item.items?.map((sub) => (
                  <a
                    key={sub.href + sub.label}
                    href={withPrefix(sub.href)}
                    className={`mobile-sub-link${
                      matchesPath(sub.href) ? " mobile-sub-link-current" : ""
                    }`}
                    aria-current={matchesPath(sub.href) ? "page" : undefined}
                  >
                    {sub.label}
                  </a>
                ))}
              </React.Fragment>
            ))}
            <div style={styles.mobileActions}>
              <a href={PANEL_URL} style={styles.loginBtn}>כניסה</a>
              <a href={PANEL_URL} className="primary-btn" style={{ ...styles.trialBtn, width: "100%" }} onClick={openSignup}>
                ניסיון חינם
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  topBar: {
    background: "var(--bg-dark)",
    color: "#ccc",
    fontSize: "0.85rem",
    padding: "8px 0",
  },
  topBarInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBarLink: {
    color: "#fff",
    fontWeight: 500,
  },
  topBarText: {
    color: "#aaa",
  },
  logoImg: {
    height: 44,
    width: "auto",
  },
  loginBtn: {
    padding: "8px 20px",
    borderRadius: "var(--radius-xl)",
    border: "2px solid var(--primary-pink)",
    color: "var(--primary-pink)",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.2s",
    textAlign: "center",
  },
  trialBtn: {
    padding: "10px 24px",
    fontSize: "0.9rem",
  },
  burgerLine: {
    display: "block",
    width: "24px",
    height: "2px",
    background: "var(--text-dark)",
    transition: "transform 0.3s, opacity 0.3s",
  },
  burgerLine1Open: { transform: "translateY(7px) rotate(45deg)" },
  burgerLine2Open: { opacity: 0 },
  burgerLine3Open: { transform: "translateY(-7px) rotate(-45deg)" },
  mobileActions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "16px",
  },
}

export default Header
