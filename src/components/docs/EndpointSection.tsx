import React, { useEffect, useState } from "react"
import { API_BASE, schemaById, type Endpoint, type Field } from "../../data/api"
import { useDocsState } from "./useDocsState"

const FieldTable: React.FC<{ title: string; fields: Field[]; description?: string }> = ({
  title,
  fields,
  description,
}) => (
  <div className="doc-fields">
    <h4 className="doc-fields-title">{title}</h4>
    {description ? <p className="doc-fields-desc">{description}</p> : null}
    <table className="doc-table">
      <thead>
        <tr>
          <th scope="col">Field</th>
          <th scope="col">Type</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field) => (
          <tr key={field.name}>
            <th scope="row">
              <code>{field.name}</code>
              {field.required ? (
                <span className="doc-req">required</span>
              ) : null}
            </th>
            <td className="doc-type">{field.type ?? "—"}</td>
            <td>
              {field.description}
              {field.default ? (
                <span className="doc-default">
                  Defaults to <code>{field.default}</code>
                </span>
              ) : null}
              {field.note ? <span className="doc-note">{field.note}</span> : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const EndpointSection: React.FC<{ endpoint: Endpoint }> = ({ endpoint }) => {
  const { activeId, setActiveId, variantFor, setVariant } = useDocsState()
  // Collapsed by default so the page opens as a scannable list rather than a
  // wall of every endpoint at once. Uses <details>, so the content is still
  // in the HTML for agents and for the browser's own find-in-page.
  const [open, setOpen] = useState(false)

  // A link straight to an endpoint should arrive with it already open.
  useEffect(() => {
    const openIfTargeted = () => {
      if (window.location.hash === `#${endpoint.id}`) {
        setOpen(true)
        setActiveId(endpoint.id)
      }
    }
    openIfTargeted()
    window.addEventListener("hashchange", openIfTargeted)
    return () => window.removeEventListener("hashchange", openIfTargeted)
  }, [endpoint.id, setActiveId])

  const variant =
    endpoint.variants.find((v) => v.id === variantFor(endpoint.id)) ??
    endpoint.variants[0]

  const bodySchemas = (variant?.bodySchemas ?? [])
    .map((id) => schemaById.get(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))

  return (
    <details
      className={`doc-endpoint${endpoint.id === activeId ? " is-active" : ""}`}
      id={endpoint.id}
      open={open}
      onToggle={(e) => {
        const isOpen = (e.currentTarget as HTMLDetailsElement).open
        setOpen(isOpen)
        if (isOpen) setActiveId(endpoint.id)
      }}
    >
      <summary className="doc-summary">
        {/* The method badge wears the stamp's serrated edge. */}
        <span className={`doc-method doc-method-${endpoint.method.toLowerCase()}`}>
          {endpoint.method}
        </span>
        <span className="doc-summary-title">{endpoint.title}</span>
        <code className="doc-summary-path">{endpoint.path}</code>
        <span className="doc-summary-caret" aria-hidden="true" />
      </summary>

      <div className="doc-endpoint-body">
        <div className="doc-endpoint-main">
          <p className="doc-route">
            <code className="doc-path">
              <span className="doc-path-base">{API_BASE}</span>
              {endpoint.path}
            </code>
            <a className="doc-permalink" href={`#${endpoint.id}`} aria-label="Link to this endpoint">
              #
            </a>
          </p>

          {endpoint.description ? (
            <p className="doc-endpoint-desc">{endpoint.description}</p>
          ) : null}

          {endpoint.variants.length > 1 ? (
            <div className="doc-variants" role="tablist" aria-label="Request variant">
              {endpoint.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  role="tab"
                  aria-selected={v.id === variant?.id}
                  className={`doc-variant${v.id === variant?.id ? " is-active" : ""}`}
                  onClick={() => setVariant(endpoint.id, v.id)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          ) : null}

          {endpoint.query?.length ? (
            <FieldTable title="Query parameters" fields={endpoint.query} />
          ) : null}

          {bodySchemas.map((schema) => (
            <FieldTable
              key={schema.id}
              title={schema.title}
              description={schema.description}
              fields={schema.fields}
            />
          ))}

          {endpoint.notes?.length ? (
            <ul className="doc-notes">
              {endpoint.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}

          {/* Recorded rather than quietly smoothed over: these are places the
              original documentation is silent or contradicts itself. */}
          {endpoint.gaps?.length ? (
            <div className="doc-gap">
              <h4 className="doc-gap-title">Undocumented at source</h4>
              <ul>
                {endpoint.gaps.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </details>
  )
}

export default EndpointSection
