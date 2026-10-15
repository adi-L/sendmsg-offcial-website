import { useCallback, useRef, useState } from "react"
import { loadTurnstile, getToken } from "./turnstile"
import { useText } from "../../locales/LocaleContext"
import heText from "../../locales/he/ai-assistant.json"

/* This component's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

const BASE = process.env.GATSBY_AGENT_URL ?? ""
const SITE_KEY = process.env.GATSBY_TURNSTILE_SITE_KEY ?? ""
const CLIENT_TIMEOUT_MS = 25_000 // inside the gateway's 30s upstream timeout
// getToken needs its OWN timeout, and this is the one gap that breaks the whole
// fallback promise. The Turnstile script's onerror catches a failed LOAD, but a
// challenge that mounts and then never calls callback or error-callback — a
// stalled iframe, a blocked sub-resource, some privacy extensions — leaves
// phase at "starting" for the life of the page view, showing neither a chat nor
// the four buttons. Nothing can rescue that state: startedRef is never reset,
// so there is no retry. Race getToken against this and route expiry to degraded.
const CHALLENGE_TIMEOUT_MS = 12_000

export type Phase = "idle" | "starting" | "ready" | "thinking" | "degraded"
export type Msg = { role: "user" | "assistant"; text: string }


const post = async (path: string, body: unknown): Promise<Response> =>
  fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
  })

// Wraps a promise with a timeout without leaving an unhandled rejection
// behind: the loser (whichever of `p` or the timer settles second) is
// always observed by a handler here, even once this wrapper has already
// settled via the other path.
const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("challenge timeout")), ms)
    p.then(
      (v) => {
        clearTimeout(timer)
        resolve(v)
      },
      (e) => {
        clearTimeout(timer)
        reject(e)
      }
    )
  })

export function useChat() {
  /* t.greeting is kept in sync with the line in knowledge/00-identity.md
     that tells the agent how the conversation opened. Change one, change
     the other. */
  const t = useText(TEXT)
  const [phase, setPhase] = useState<Phase>("idle")
  const [messages, setMessages] = useState<Msg[]>([])
  // Transient, inline notice for a condition that must NOT degrade the
  // panel -- currently only reason: "too_fast". Degrading unmounts the
  // whole message log (showChat becomes false) and startedRef never
  // resets, so a visitor who presses Enter twice inside a second would
  // otherwise lose their question and every prior answer, permanently.
  const [notice, setNotice] = useState<string | null>(null)
  const token = useRef<string | null>(null)

  // Starts (or restarts) a session. Used both for the first connection
  // attempt and as an explicit retry after a degraded state.
  const retry = useCallback(async (challengeHost: HTMLElement): Promise<void> => {
    // GATSBY_TURNSTILE_SITE_KEY is empty in .env.development and in CI
    // pending a repo variable. Without this check, every first panel open
    // fetches and executes challenges.cloudflare.com/turnstile/v0/api.js and
    // lets it fail on an empty sitekey -- a third-party request and a
    // console error on a site whose success criterion is "no blank panel,
    // no console errors". Fail straight to degraded instead, with nothing
    // loaded.
    if (!SITE_KEY) {
      setPhase("degraded")
      return
    }
    setPhase("starting")
    try {
      await loadTurnstile()
      const turnstileToken = await withTimeout(
        getToken(challengeHost, SITE_KEY),
        CHALLENGE_TIMEOUT_MS
      )
      const res = await post("/session", { turnstileToken })
      if (!res.ok) throw new Error(`session ${res.status}`)
      const json = (await res.json()) as { sessionToken: string }
      token.current = json.sessionToken
      // Open with a greeting so the panel is never an empty box waiting to be
      // filled. It is added client-side on purpose: send() posts only the
      // visitor's text and the conversation history lives server-side, so this
      // costs no tokens and no upstream turn. The agent is told in its system
      // prompt that the UI already opened this way, otherwise a visitor whose
      // first reply is just a name would be answering a question the agent has
      // no record of asking.
      setMessages((m) => (m.length ? m : [{ role: "assistant", text: t.greeting }]))
      setPhase("ready")
    } catch {
      setPhase("degraded")
    }
  }, [t.greeting])

  const send = useCallback(async (text: string): Promise<void> => {
    if (!token.current) {
      setPhase("degraded")
      return
    }
    setNotice(null)
    setMessages((m) => [...m, { role: "user", text }])
    setPhase("thinking")
    try {
      const res = await post("/message", { sessionToken: token.current, message: text })
      if (!res.ok) throw new Error(`message ${res.status}`)
      const json = (await res.json()) as { reply?: string; degraded?: boolean; reason?: string }
      if (json.degraded) {
        // Only the real per-session and per-IP caps ("limit", "budget",
        // "unavailable") degrade. "too_fast" is the 1-second min-gap
        // throttle -- transient by nature -- so keep the panel exactly as
        // it was and let the visitor just try again.
        if (json.reason === "too_fast") {
          setNotice(t.tooFast)
          setPhase("ready")
          return
        }
        setPhase("degraded")
        return
      }
      if (!json.reply) {
        setPhase("degraded")
        return
      }
      setMessages((m) => [...m, { role: "assistant", text: json.reply! }])
      setPhase("ready")
    } catch {
      setPhase("degraded")
    }
  }, [t.tooFast])

  const trackConversion = useCallback((event: "panel_click" | "signup_click"): void => {
    // Accepted blind spot: without a session token (e.g. /session itself
    // failed) we cannot report a conversion. We do not fall back to an
    // unauthenticated write here — that would trade a rare, honest gap for
    // a permanent abuse surface where anyone could inject fake conversions
    // into the gateway. And a dead /session usually means a dead gateway
    // anyway, so a beacon to /conversion would most likely fail too. Leave
    // this as a documented limitation, not something to "fix" by opening
    // the endpoint.
    if (!token.current) return
    const body = JSON.stringify({ sessionToken: token.current, event })
    // MUST survive navigation. panel_click fires immediately before the
    // browser follows the anchor to panel.sendmsg.co.il in the SAME tab,
    // and a plain unawaited fetch is cancelled on unload — losing exactly
    // the event the whole metric exists to produce. sendBeacon is queued
    // by the browser and outlives the page; keepalive is the fallback
    // where it is unavailable. Applied to every event uniformly so the
    // transport never has to branch on which one is "at risk".
    try {
      // "text/plain", not "application/json": a JSON content-type is not
      // CORS-simple, which forces an OPTIONS preflight, and a preflight
      // begun during unload is routinely dropped -- exactly the
      // panel_click case this beacon exists for. The gateway's
      // express.json() accepts text/plain too (src/app.ts) and still
      // parses this body as JSON.
      const blob = new Blob([body], { type: "text/plain" })
      if (navigator.sendBeacon?.(`${BASE}/conversion`, blob)) return
    } catch {
      // fall through to keepalive
    }
    void fetch(`${BASE}/conversion`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {})
  }, [])

  return { phase, messages, notice, retry, send, trackConversion }
}
