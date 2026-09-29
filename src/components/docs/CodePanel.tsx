import React, { useMemo, useState } from "react"
import type { Endpoint, Variant } from "../../data/api"
import {
  buildSample,
  LANGUAGES,
  LANGUAGE_LABELS,
  type Language,
} from "../../data/api/samples"
import { useToken } from "./useToken"
import TryIt from "./TryIt"

interface Props {
  endpoint: Endpoint
  variant: Variant
}

const CopyButton: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="doc-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1600)
        } catch {
          // Clipboard blocked; the reader can still select the text.
        }
      }}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

/**
 * Renders the request sample in the reader's chosen language, the documented
 * response, and the console. Samples come from the endpoint definition rather
 * than being written out per language, so they cannot fall out of step.
 */
const CodePanel: React.FC<Props> = ({ endpoint, variant }) => {
  const [language, setLanguage] = useState<Language>("curl")
  const { siteId, token } = useToken()

  const sample = useMemo(
    () => buildSample(endpoint, variant, language, { siteId, token }),
    [endpoint, variant, language, siteId, token]
  )

  const response = variant.responseExample
    ? JSON.stringify(variant.responseExample, null, 2)
    : null

  return (
    <div className="doc-panel">
      <div className="doc-panel-head">
        <div className="doc-langs" role="tablist" aria-label="Sample language">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              role="tab"
              aria-selected={lang === language}
              className={`doc-lang${lang === language ? " is-active" : ""}`}
              onClick={() => setLanguage(lang)}
            >
              {LANGUAGE_LABELS[lang]}
            </button>
          ))}
        </div>
        <CopyButton value={sample} label="request" />
      </div>

      <pre className="doc-code">
        <code>{sample}</code>
      </pre>

      <TryIt endpoint={endpoint} variant={variant} />

      {response ? (
        <>
          {/* The tear-line: request is the stub you keep, response is what
              comes back. Echoes the stamp perforation used across the site. */}
          <div className="doc-perf" aria-hidden="true" />
          <div className="doc-panel-head doc-panel-head-sub">
            <span className="doc-panel-label">Response</span>
            <CopyButton value={response} label="response" />
          </div>
          <pre className="doc-code doc-code-response">
            <code>{response}</code>
          </pre>
          {variant.responseNotes ? (
            <dl className="doc-resp-notes">
              {Object.entries(variant.responseNotes).map(([path, note]) => (
                <div key={path} className="doc-resp-note">
                  <dt>{path}</dt>
                  <dd>{note}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </>
      ) : (
        <p className="doc-panel-empty">
          The original documentation gives no response for this endpoint.
        </p>
      )}
    </div>
  )
}

export default CodePanel
