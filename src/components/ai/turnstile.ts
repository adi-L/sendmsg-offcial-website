// Loaded on first panel open, never on page load: this is a static
// marketing site and 15MB of image weight was just removed from it.
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

let loading: Promise<void> | null = null

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string
          callback: (t: string) => void
          "error-callback": () => void
          size?: string
        }
      ) => string
      remove: (id: string) => void
    }
  }
}

export function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (loading) return loading
  loading = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script")
    s.src = SRC
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error("turnstile failed to load"))
    document.head.appendChild(s)
  })
  return loading
}

export function getToken(host: HTMLElement, sitekey: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.turnstile) {
      reject(new Error("turnstile not loaded"))
      return
    }
    const id = window.turnstile.render(host, {
      sitekey,
      size: "flexible",
      callback: (t) => {
        resolve(t)
        window.turnstile?.remove(id)
      },
      "error-callback": () => {
        reject(new Error("challenge error"))
        window.turnstile?.remove(id)
      },
    })
  })
}
