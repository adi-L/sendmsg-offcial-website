import React, { useState } from "react"
import {
  API_BASE,
  DESTRUCTIVE_ENDPOINT_IDS,
  type Endpoint,
  type Variant,
} from "../../data/api"
import { sampleUrl } from "../../data/api/samples"
import { useToken } from "./useToken"

interface Props {
  endpoint: Endpoint
  variant: Variant
}

interface Result {
  status: number
  statusText: string
  body: string
  durationMs: number
}

/**
 * Runs the request against the live API from the reader's browser.
 *
 * The API already sends Access-Control-Allow-Origin and accepts the
 * Authorization header, so this needs no proxy and no server change.
 *
 * Endpoints that send to real people or destroy data ask for a typed
 * confirmation first. Documentation should not be a place where clicking
 * around can empty a mailing list or fire a campaign.
 */
const TryIt: React.FC<Props> = ({ endpoint, variant }) => {
  const { siteId, token, setCredentials } = useToken()
  const [open, setOpen] = useState(false)
  const [body, setBody] = useState(() =>
    variant.requestExample ? JSON.stringify(variant.requestExample, null, 2) : ""
  )
  const [confirmText, setConfirmText] = useState("")
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  const destructive = DESTRUCTIVE_ENDPOINT_IDS.has(endpoint.id)
  const confirmed = !destructive || confirmText.trim().toUpperCase() === "SEND"
  const needsToken = endpoint.auth && !token.trim()

  async function run() {
    setRunning(true)
    setError(null)
    setResult(null)
    const started = performance.now()
    try {
      const headers: Record<string, string> = {}
      if (endpoint.auth) headers.Authorization = token.trim()
      if (body.trim()) headers["Content-Type"] = "application/json"

      const response = await fetch(sampleUrl(endpoint, { siteId, token }), {
        method: endpoint.method,
        headers,
        body: body.trim() ? body : undefined,
      })
      const text = await response.text()
      let pretty = text
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2)
      } catch {
        // Not JSON; show whatever came back.
      }
      setResult({
        status: response.status,
        statusText: response.statusText,
        body: pretty,
        durationMs: Math.round(performance.now() - started),
      })

      // The token endpoint hands back the credential every other call needs,
      // so capture it rather than making the reader copy it across.
      if (endpoint.id === "token") {
        try {
          const parsed = JSON.parse(text) as { Token?: string }
          if (parsed.Token) setCredentials({ token: parsed.Token })
        } catch {
          // Not a token response; nothing to capture.
        }
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message}. If this is a network error, check the token and that you are online.`
          : "The request failed."
      )
    } finally {
      setRunning(false)
    }
  }

  if (!open) {
    return (
      <div className="doc-tryit-bar">
        <button type="button" className="doc-tryit-open" onClick={() => setOpen(true)}>
          Try it
        </button>
        <span className="doc-tryit-hint">
          Runs against {API_BASE.replace("https://", "")}
        </span>
      </div>
    )
  }

  return (
    <div className="doc-tryit">
      <div className="doc-tryit-head">
        <span className="doc-panel-label">Run this request</span>
        <button type="button" className="doc-tryit-close" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>

      {needsToken ? (
        <p className="doc-tryit-warn">
          This endpoint needs a token. Get one from the token endpoint, or paste
          yours into the field in the top bar.
        </p>
      ) : null}

      {body ? (
        <label className="doc-tryit-field">
          <span>Request body</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={Math.min(14, body.split("\n").length + 1)}
            spellCheck={false}
          />
        </label>
      ) : null}

      {destructive ? (
        <label className="doc-tryit-field doc-tryit-confirm">
          <span>
            This sends to real people or removes real data. Type SEND to enable it.
          </span>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="SEND"
            spellCheck={false}
          />
        </label>
      ) : null}

      <button
        type="button"
        className="doc-tryit-run"
        onClick={run}
        disabled={running || !confirmed || needsToken}
      >
        {running ? "Running" : `Send ${endpoint.method} request`}
      </button>

      {error ? <p className="doc-tryit-error">{error}</p> : null}

      {result ? (
        <div className="doc-tryit-result">
          <div className="doc-tryit-status">
            <span
              className={`doc-status-dot${result.status < 300 ? " is-ok" : " is-bad"}`}
              aria-hidden="true"
            />
            {result.status} {result.statusText} · {result.durationMs}ms
          </div>
          <pre className="doc-code doc-code-response">
            <code>{result.body}</code>
          </pre>
        </div>
      ) : null}
    </div>
  )
}

export default TryIt
