import React from "react"
import type { HeadFC } from "gatsby"
import DocsLayout from "../components/docs/DocsLayout"
import EndpointSection from "../components/docs/EndpointSection"
import SEO from "../components/SEO"
import {
  API_BASE,
  API_VERSION,
  SUPPORT_EMAIL,
  conventions,
  endpointsByGroup,
  statusCodes,
  support,
  smsRules,
} from "../data/api"
import "../styles/api-docs.css"

const ApiPage: React.FC = () => (
  <DocsLayout>
    <section className="doc-intro" id="introduction">
      <h1 className="doc-h1">SendMsg API {API_VERSION}</h1>
      <p className="doc-lede">
        Manage subscribers and mailing lists, and send newsletters and SMS
        campaigns, from your own code.
      </p>

      <div className="doc-base">
        <span className="doc-base-label">Base URL</span>
        <code>{API_BASE}</code>
      </div>

      <div className="doc-quickstart">
        <p>
          Every call needs a token. Post your SiteID and API password to{" "}
          <a href="#token">the token endpoint</a>, then send the token you get
          back as the <code>Authorization</code> header on everything else. It
          lasts twelve hours.
        </p>
        <p>
          SiteID is your SendMsg account number. The API password comes from
          support, at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </div>

      <section className="doc-sub" id="api-support">
        <h2 className="doc-h2">API Support</h2>
        <p className="doc-section-lede">{support.requirement}</p>
        <ol className="doc-steps">
          {support.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="doc-foot-links">
          <a href={support.templateUrl} target="_blank" rel="noreferrer noopener">
            Template for a support request
          </a>
          <a href={`mailto:${support.email}`}>{support.email}</a>
        </p>
      </section>

      <section className="doc-sub" id="about-sms">
        <h2 className="doc-h2">About SMS</h2>
        <p className="doc-section-lede">
          {smsRules.lede} These restrictions apply to{" "}
          <code>{smsRules.restrictionsFor}</code>.
        </p>
        <ul className="doc-notes">
          {smsRules.restrictions.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="doc-sub" id="important">
        <h2 className="doc-h2">Important</h2>
        <dl className="doc-conventions">
        {conventions.map((c) => (
          <div key={c.title} className="doc-convention">
            <dt>{c.title}</dt>
            <dd>{c.body}</dd>
          </div>
          ))}
        </dl>
      </section>

      <section className="doc-sub" id="status-codes">
        <h2 className="doc-h2">Status codes</h2>
        <p className="doc-section-lede">
          Whatever the code, <code>result.ResultMessage</code> carries the detail.
        </p>
        <table className="doc-table doc-table-status">
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {statusCodes.map((s) => (
              <tr key={s.code}>
                <th scope="row">
                  <code className={`doc-code-chip is-${s.kind}`}>{s.code}</code>
                </th>
                <td>{s.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="doc-sub" id="for-agents">
        <h2 className="doc-h2">For agents and tooling</h2>
        <p className="doc-section-lede">
          The whole reference is available as plain text and as a machine
          description, generated from the same source as this page.
        </p>
        <ul className="doc-machine-links">
          <li>
            <a href="/api/llms.txt">llms.txt</a>
            <span>Structured index of every endpoint.</span>
          </li>
          <li>
            <a href="/api/llms-full.txt">llms-full.txt</a>
            <span>The complete reference as one markdown file.</span>
          </li>
          <li>
            <a href="/api/openapi.json">openapi.json</a>
            <span>Import into Postman, or generate a client.</span>
          </li>
        </ul>
      </section>
    </section>

    {endpointsByGroup.map(({ group, endpoints }) => (
      <section key={group.id} className="doc-group" id={group.id}>
        <header className="doc-group-head">
          <h2 className="doc-h2">{group.title}</h2>
          {group.description ? (
            <p className="doc-section-lede">{group.description}</p>
          ) : null}
        </header>
        {endpoints.map((endpoint) => (
          <EndpointSection key={`${endpoint.id}`} endpoint={endpoint} />
        ))}
      </section>
    ))}

    <footer className="doc-foot">
      <p>
        Questions about this reference go through{" "}
        <a href="#api-support">API Support</a>.
      </p>
    </footer>
  </DocsLayout>
)

export default ApiPage

export const Head: HeadFC = () => (
  <SEO
    title="API Reference"
    description="SendMsg API 4.0 reference. Manage subscribers and mailing lists, and send email and SMS campaigns, from your own code."
    pathname="/api/"
  />
)
