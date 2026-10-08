import { useEffect, useState } from "react"

/* ── support hours and support channels ─────────────────────────
   Shared by /contact/ and /support/, which both publish the same
   window and the same three channels. One source so the two pages
   can never drift apart on a phone number or an opening time.

   The numbers the live site publishes: support answers on 4600911;
   4600600 is the switchboard the topbar already carries. */

export const SUPPORT_PHONE = "077-4600911"
export const WHATSAPP_NUMBER = "055-9377588"
export const WHATSAPP_LINK = "https://api.whatsapp.com/send?phone=972559377588"

/* Sunday to Thursday, 9:00 to 17:00, Israel time. The visitor is not
   necessarily in that timezone, and "are they open right now" is the
   one question a support page can actually answer for them. */
const TZ = "Asia/Jerusalem"
const OPEN_MIN = 9 * 60
const CLOSE_MIN = 17 * 60
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const HEBREW_DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]

export type Status = { open: boolean; note: string }

export function readStatus(): Status | null {
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

  const minutes = (Number(value("hour")) % 24) * 60 + Number(value("minute"))
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
export function useSupportStatus() {
  const [status, setStatus] = useState<Status | null>(null)

  useEffect(() => {
    setStatus(readStatus())
    const id = window.setInterval(() => setStatus(readStatus()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return status
}
