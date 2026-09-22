import React, { useEffect, useRef, useState } from "react"

const PANEL_URL = "https://panel.sendmsg.co.il/"

type Holiday = {
  name: string
  date: Date
}

const dayFormat = new Intl.DateTimeFormat("he-IL", { day: "numeric" })
const monthFormat = new Intl.DateTimeFormat("he-IL", { month: "short" })

const relativeLabel = (date: Date): string => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const days = Math.round((date.getTime() - now.getTime()) / 86400000)
  if (days <= 0) return "היום"
  if (days === 1) return "מחר"
  return `בעוד ${days} ימים`
}

// Example prompts that type themselves into the textarea, one after another
const EXAMPLES = [
  "ניוזלטר חודשי לחנות תכשיטים, עם מבצע לחג ועדכון על קולקציה חדשה",
  "מייל השקה למסעדה חדשה, עם תפריט פתיחה והזמנה לערב היכרות",
  "עדכון ללקוחות הסטודיו על שעות הפעילות בחופשת הקיץ",
  "מבצע בלאק פריידי לחנות אונליין, עם קוד קופון ותאריך תפוגה",
  "סיכום שנה לעמותה, עם הישגים, תודות וקריאה לתרומה",
]

const STATIC_PLACEHOLDER = `לדוגמה: ${EXAMPLES[0]}...`

const TYPE_MS = 45
const DELETE_MS = 22
const HOLD_MS = 2200
const GAP_MS = 500

// Types an example out, holds it, erases it, moves to the next one.
// Runs only while `enabled` — we pause it the moment the user takes over.
const useTypedExample = (enabled: boolean): string => {
  const [text, setText] = useState("")

  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setText(EXAMPLES[0])
      return
    }

    let phrase = 0
    let chars = 0
    let erasing = false
    let timer = 0

    const step = () => {
      const current = EXAMPLES[phrase]
      if (!erasing) {
        chars += 1
        setText(current.slice(0, chars))
        if (chars === current.length) {
          erasing = true
          timer = window.setTimeout(step, HOLD_MS)
          return
        }
        timer = window.setTimeout(step, TYPE_MS)
        return
      }
      chars -= 1
      setText(current.slice(0, chars))
      if (chars === 0) {
        erasing = false
        phrase = (phrase + 1) % EXAMPLES.length
        timer = window.setTimeout(step, GAP_MS)
        return
      }
      timer = window.setTimeout(step, DELETE_MS)
    }

    timer = window.setTimeout(step, GAP_MS)
    return () => window.clearTimeout(timer)
  }, [enabled])

  return text
}

const AILaunchpad: React.FC = () => {
  const [prompt, setPrompt] = useState("")
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // the animated placeholder stands down once the box is focused or has text
  const typing = !focused && prompt === ""
  const typedExample = useTypedExample(typing)

  useEffect(() => {
    // Jewish holidays (Israel schedule) from Hebcal; panel stays hidden if unavailable
    const start = new Date()
    const end = new Date()
    end.setDate(end.getDate() + 400)
    const fmt = (d: Date) => d.toISOString().slice(0, 10)
    fetch(
      `https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&il=on&start=${fmt(start)}&end=${fmt(end)}`
    )
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const items: Holiday[] = (data.items || [])
          .filter(
            (item: any) =>
              item.category === "holiday" &&
              item.hebrew &&
              !item.hebrew.startsWith("ערב")
          )
          .map((item: any) => ({
            // base name only: drops day letters, candle counts and חוה"מ suffixes
            name: (item.hebrew as string)
              .replace(/:.*$/, "")
              .replace(/ [א-ת]['׳].*$/, "")
              .replace(/ \(.+\)$/, ""),
            date: new Date(`${item.date}T00:00:00`),
          }))
        // one entry per holiday, first day only
        const seen = new Set<string>()
        const unique = items.filter((h) => {
          if (seen.has(h.name)) return false
          seen.add(h.name)
          return true
        })
        setHolidays(unique.slice(0, 6))
      })
      .catch(() => setHolidays([]))
  }, [])

  // close the holiday menu on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [menuOpen])

  const pickHoliday = (h: Holiday | null) => {
    // the holiday is context passed behind the scenes, never inserted into the prompt
    setSelectedHoliday(h)
    setMenuOpen(false)
    inputRef.current?.focus()
  }

  const handleLaunch = () => {
    // TODO: connect to Creaditor studio. For now we pass the prompt to the panel
    // so the flow can be wired server-side later without changing this component.
    const params = new URLSearchParams()
    if (prompt.trim()) params.set("ai_prompt", prompt.trim())
    if (selectedHoliday) {
      params.set("ai_holiday", selectedHoliday.name)
      // local date, not toISOString: the Date is local midnight and UTC would shift a day
      const d = selectedHoliday.date
      params.set(
        "ai_holiday_date",
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
      )
    }
    const query = params.toString()
    window.open(query ? `${PANEL_URL}?${query}` : PANEL_URL, "_blank", "noopener")
  }

  return (
    <section className="section launchpad-section dot-grid">
      <div className="container">
        <h2 className="section-title">צרו ניוזלטר עם AI, ממשפט אחד</h2>
        <p className="section-subtitle">
          תארו מה תרצו לשלוח, וה-AI של שלח מסר יכתוב, יעצב ויכין טיוטה
          מוכנה לשליחה בתוך פחות מ-2 דקות.
        </p>

        <div className="launchpad-main">
          <div className="launchpad-box">
            <textarea
              ref={inputRef}
              className="launchpad-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              rows={3}
              aria-label="תיאור הניוזלטר שתרצו ליצור"
              placeholder={
                typing && typedExample
                  ? `לדוגמה: ${typedExample}\u258F`
                  : STATIC_PLACEHOLDER
              }
            />
            <div className="launchpad-actions">
              {holidays.length > 0 && (
                <div className="launchpad-holiday-menu" ref={menuRef}>
                  <button
                    type="button"
                    className={`launchpad-holiday-toggle${selectedHoliday ? " is-selected" : ""}`}
                    aria-haspopup="listbox"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {selectedHoliday ? selectedHoliday.name : "ניוזלטר לחג"}
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {menuOpen && (
                    <ul className="launchpad-holiday-dropdown" role="listbox" aria-label="החגים הקרובים">
                      {selectedHoliday && (
                        <li>
                          <button
                            type="button"
                            className="launchpad-holiday launchpad-holiday-clear"
                            onClick={() => pickHoliday(null)}
                          >
                            ללא חג
                          </button>
                        </li>
                      )}
                      {holidays.map((h) => (
                        <li key={`${h.name}-${h.date.toISOString()}`}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={selectedHoliday?.name === h.name}
                            className="launchpad-holiday"
                            onClick={() => pickHoliday(h)}
                          >
                            <span className="launchpad-holiday-date">
                              <strong>{dayFormat.format(h.date)}</strong>
                              <small>{monthFormat.format(h.date)}</small>
                            </span>
                            <span className="launchpad-holiday-info">
                              <span className="launchpad-holiday-name">{h.name}</span>
                              <span className="launchpad-holiday-when">
                                {relativeLabel(h.date)}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <button
                type="button"
                className="launchpad-btn"
                onClick={handleLaunch}
                aria-label="יצירה עם AI"
                title="יצירה עם AI"
              >
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17L17 7" />
                  <path d="M11 7h6v6" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default AILaunchpad
