import React, { useState, FormEvent } from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import CTA from "../components/CTA"
import { SUPPORT_EMAIL } from "../data/api"
import "../styles/jobs.css"
import type { PageContext } from "../locales/config"
import { useT } from "../locales/LocaleContext"
import { getT } from "../locales/messages"
import { formatText } from "../locales/config"

/* Applications have nowhere to go yet: the form flips to a success state
   in the browser, exactly like /contact/. The mail row beside it is the
   path that actually reaches a person, so it stays visible. */
const JOBS_EMAIL = SUPPORT_EMAIL

/* The site's icon set: 24-grid, 1.8 stroke, round caps, drawn rather
   than borrowed from a font. */
const stroke = (paths: React.ReactNode, size = 22) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {paths}
  </svg>
)

const MailIcon = () =>
  stroke(
    <>
      <rect x="2" y="4.5" width="20" height="15" rx="2.5" />
      <path d="m2.8 6 8.06 6.2a2 2 0 0 0 2.28 0L21.2 6" />
    </>
  )

/* Points the way the language runs. */
const GoIcon = ({ size = 20 }: { size?: number }) =>
  stroke(
    <>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </>,
    size
  )

const PlusIcon = () =>
  stroke(
    <>
      <path d="M12 5v14" className="jb-plus-v" />
      <path d="M5 12h14" />
    </>,
    20
  )

const factIcons: Record<string, React.ReactNode> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5 4.5 5.5V11c0 5 3.2 9 7.5 10.5 4.3-1.5 7.5-5.5 7.5-10.5V5.5z" />
      <path d="m8.8 11.8 2.3 2.4 4.1-4.6" />
    </>
  ),
  layers: (
    <>
      <path d="M12 2.5 2.5 7.5 12 12.5l9.5-5z" />
      <path d="m2.5 12.5 9.5 5 9.5-5" />
    </>
  ),
}

/* ── the openings ───────────────────────────────────────────────
   One list, and everything else on the page counts off it: the hero
   total, the badges, the options in the form's role menu. Changing a
   number here changes the whole page.

   First draft of the copy, written to match what the product actually
   is. Rewrite any line. */
type Opening = {
  id: string
  title: string
  count: number
  ltr?: boolean
  meta: string
  lede: string
  doing: string[]
  need: string[]
  plus: string[]
}

const countLabel = (n: number, t: { countOne: string; countMany: string }) =>
  n === 1 ? t.countOne : formatText(t.countMany, { n })

/* facts: moved to src/locales/he/pages/jobs.json as "facts". */
const JobsPage: React.FC = () => {
  const t = useT("pages/jobs")
  const TOTAL = t.openings.reduce((sum, job) => sum + job.count, 0)
  const [openId, setOpenId] = useState<string | null>(t.openings[0].id)
  const [role, setRole] = useState(t.openings[0].title)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  /* The button inside an opening carries its role into the form, so
     nobody has to remember which one they were reading. */
  const applyFor = (title: string) => {
    setRole(title)
    document.getElementById("jb-apply")?.scrollIntoView({ block: "start" })
  }

  return (
    <Layout>
      <div className="jb">
        {/* The page says its own name first, then the one number that
            makes it worth reading: how many seats are actually open. */}
        <section className="jb-hero">
          <div className="container">
            <h1 className="jb-hero-title">{t.heroTitle}</h1>
            <p className="jb-hero-claim">{t.heroClaim}</p>
            <p className="jb-hero-lede">
              {t.heroLede}
            </p>
            <p className="jb-count">
              <span className="jb-count-n jb-ltr">{TOTAL}</span>
              <span>{t.span}</span>
            </p>
          </div>
        </section>

        {/* Narrow claim beside wide evidence: an asymmetric split, so the
            reasons do not arrive as four identical cards. */}
        <section className="jb-section">
          <div className="container jb-split jb-split-why">
            <div className="jb-why-said">
              <div className="jb-head">
                <h2>{t.h2}</h2>
                <p>
                  {t.p}
                </p>
              </div>
            </div>

            <dl className="jb-facts">
              {t.facts.map(fact => (
                <div className="jb-fact" key={fact.t}>
                  <span className="jb-fact-icon">{stroke(factIcons[fact.icon])}</span>
                  <dt>{fact.t}</dt>
                  <dd>{fact.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* The openings: hairline rows that open in place. Not cards, and
            not three of anything, so the list can grow or shrink without
            the section falling apart. */}
        <section className="jb-section jb-roles-sec">
          <div className="container">
            <div className="jb-head">
              <h2>{t.h22}</h2>
              <p>
                {formatText(t.p2, { count: countLabel(TOTAL, t) })}
              </p>
            </div>

            <div className="jb-roles">
              {t.openings.map(job => {
                const isOpen = openId === job.id
                return (
                  <div className="jb-role" key={job.id} data-open={isOpen}>
                    <h3 className="jb-role-h">
                      <button
                        type="button"
                        className="jb-role-btn"
                        id={`jb-role-${job.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`jb-panel-${job.id}`}
                        onClick={() => setOpenId(isOpen ? null : job.id)}
                      >
                        <span className="jb-role-main">
                          <span className="jb-role-top">
                            <span className={`jb-role-t${job.ltr ? " jb-ltr" : ""}`}>
                              {job.title}
                            </span>
                            <span className="jb-badge">{countLabel(job.count, t)}</span>
                          </span>
                          <span className="jb-role-meta">{job.meta}</span>
                          <span className="jb-role-lede">{job.lede}</span>
                        </span>
                        <span className="jb-role-sign" aria-hidden="true">
                          <PlusIcon />
                        </span>
                      </button>
                    </h3>

                    <div
                      className="jb-panel"
                      id={`jb-panel-${job.id}`}
                      role="region"
                      aria-labelledby={`jb-role-${job.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="jb-panel-in">
                        <div className="jb-lists">
                          <div className="jb-list">
                            <h4>{t.h4}</h4>
                            <ul>
                              {job.doing.map(line => (
                                <li key={line}>{line}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="jb-list">
                            <h4>{t.h42}</h4>
                            <ul>
                              {job.need.map(line => (
                                <li key={line}>{line}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="jb-list">
                            <h4>{t.h43}</h4>
                            <ul>
                              {job.plus.map(line => (
                                <li key={line}>{line}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="jb-role-apply"
                          onClick={() => applyFor(job.title)}
                        >
                          {t.roleApply}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="jb-none">
              {t.none}
            </p>
          </div>
        </section>

        {/* Four steps read across, not down: a different family from the
            numbered column on /contact/. */}
        <section className="jb-section jb-flow-sec">
          <div className="container">
            <div className="jb-head">
              <h2>{t.h23}</h2>
              <p>{t.p3}</p>
            </div>
            <ol className="jb-flow">
              {t.steps.map((step, i) => (
                <li className="jb-flow-step" key={step.t}>
                  <span className="jb-flow-n jb-ltr" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="jb-flow-t">{step.t}</span>
                  <span className="jb-flow-d">{step.d}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* The form is wide, the alternative route is narrow. Same split
            as /contact/, mirrored, and the mail row stays because the
            form has no backend behind it yet. */}
        <section className="jb-section jb-apply-sec" id="jb-apply">
          <div className="container jb-split jb-split-apply">
            <div className="jb-form-col">
              <div className="jb-form">
                {submitted ? (
                  <div className="jb-sent" role="status">
                    <svg viewBox="0 0 52 52" width="68" height="68" aria-hidden="true">
                      <circle className="jb-sent-ring" cx="26" cy="26" r="24" fill="none" />
                      <path className="jb-sent-tick" fill="none" d="M14 27l8 8 16-17" />
                    </svg>
                    <h3>{t.h3}</h3>
                    <p>{t.p4}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <p className="jb-form-intro">{t.formIntro}</p>
                    <p className="jb-form-sub">
                      {t.formSub}
                    </p>

                    <div className="jb-field">
                      <label htmlFor="jb-name">{t.label}</label>
                      <input id="jb-name" name="name" type="text" autoComplete="name" required />
                    </div>

                    <div className="jb-pair">
                      <div className="jb-field">
                        <label htmlFor="jb-phone">{t.label2}</label>
                        <input id="jb-phone" name="phone" type="tel" autoComplete="tel" required />
                      </div>
                      <div className="jb-field">
                        <label htmlFor="jb-email">{t.label3}</label>
                        <input
                          id="jb-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    <div className="jb-field">
                      <label htmlFor="jb-role">{t.label4}</label>
                      <div className="jb-select">
                        <select
                          id="jb-role"
                          name="role"
                          value={role}
                          onChange={e => setRole(e.target.value)}
                        >
                          {t.openings.map(job => (
                            <option key={job.id} value={job.title}>
                              {job.title}
                            </option>
                          ))}
                          <option value="general">{t.select}</option>
                        </select>
                        <span className="jb-select-caret" aria-hidden="true">
                          {stroke(<path d="m6 9 6 6 6-6" />, 18)}
                        </span>
                      </div>
                    </div>

                    <div className="jb-field">
                      <label htmlFor="jb-cv">{t.label5}</label>
                      <input
                        id="jb-cv"
                        name="cv"
                        type="url"
                        inputMode="url"
                        placeholder="https://"
                        required
                      />
                    </div>

                    <div className="jb-field">
                      <label htmlFor="jb-about">
                        {t.label6}
                        <span className="jb-opt">{t.opt}</span>
                      </label>
                      <textarea id="jb-about" name="about" rows={4} />
                    </div>

                    <button type="submit" className="jb-submit">
                      {t.submit}
                    </button>
                    <p className="jb-note">
                      {t.note}
                    </p>
                  </form>
                )}
              </div>
            </div>

            <div className="jb-aside">
              <div className="jb-head">
                <h2>{t.h24}</h2>
                <p>{t.p5}</p>
              </div>
              <a className="jb-row" href={`mailto:${JOBS_EMAIL}?subject=${encodeURIComponent(t.applySubject)}`}>
                <span className="jb-row-icon">
                  <MailIcon />
                </span>
                <span className="jb-row-main">
                  <span className="jb-row-t">{t.rowT}</span>
                  <span className="jb-row-v jb-ltr">{JOBS_EMAIL}</span>
                  <span className="jb-row-note">{t.rowNote}</span>
                </span>
                <span className="jb-row-go">
                  <GoIcon />
                </span>
              </a>
            </div>
          </div>
        </section>
      </div>

      <CTA />
    </Layout>
  )
}

export default JobsPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = getT(pageContext.locale, "pages/jobs")
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/jobs/"
    />
  )
}
