import { useCallback, useRef, useState } from "react"
import { loadTurnstile, getToken } from "./turnstile"

const BASE = process.env.GATSBY_AGENT_URL ?? ""
const SITE_KEY = process.env.GATSBY_TURNSTILE_SITE_KEY ?? ""
const CLIENT_TIMEOUT_MS = 25_000 // inside the gateway's 30s upstream timeout

export type Phase = "idle" | "starting" | "ready" | "thinking" | "degraded"
export type Msg = { role: "user" | "assistant"; text: string }

const post = async (path: string, body: unknown): Promise<Response> =>
  fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
  })

export function useChat() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [messages, setMessages] = useState<Msg[]>([])
  const token = useRef<string | null>(null)

  // Starts (or restarts) a session. Used both for the first connection
  // attempt and as an explicit retry after a degraded state.
  const retry = useCallback(async (challengeHost: HTMLElement): Promise<void> => {
    setPhase("starting")
    try {
      await loadTurnstile()
      const turnstileToken = await getToken(challengeHost, SITE_KEY)
      const res = await post("/session", { turnstileToken })
      if (!res.ok) throw new Error(`session ${res.status}`)
      const json = (await res.json()) as { sessionToken: string }
      token.current = json.sessionToken
      setPhase("ready")
    } catch {
      setPhase("degraded")
    }
  }, [])

  const send = useCallback(async (text: string): Promise<void> => {
    if (!token.current) {
      setPhase("degraded")
      return
    }
    setMessages((m) => [...m, { role: "user", text }])
    setPhase("thinking")
    try {
      const res = await post("/message", { sessionToken: token.current, message: text })
      if (!res.ok) throw new Error(`message ${res.status}`)
      const json = (await res.json()) as { reply?: string; degraded?: boolean }
      if (json.degraded || !json.reply) {
        setPhase("degraded")
        return
      }
      setMessages((m) => [...m, { role: "assistant", text: json.reply! }])
      setPhase("ready")
    } catch {
      setPhase("degraded")
    }
  }, [])

  const trackConversion = useCallback((event: "panel_click" | "signup_click"): void => {
    if (!token.current) return
    // Fire and forget: a failed metric must never interrupt the visitor.
    void post("/conversion", { sessionToken: token.current, event }).catch(() => {})
  }, [])

  return { phase, messages, retry, send, trackConversion }
}
