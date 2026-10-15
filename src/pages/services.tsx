import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/services.css"
import type { PageContext } from "../locales/config"
import { useText } from "../locales/LocaleContext"
import LocalizedLink from "../locales/LocalizedLink"
import { formatText } from "../locales/config"
import Rich from "../locales/Rich"
import heText from "../locales/he/pages/services.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }
type PageText = typeof heText

/* ── The services hub ───────────────────────────────────────────
   This page routes. Every module below now has its own page, so
   the hub's only job is to show the whole shape of the system and
   hand off — it must not restate the capability lists those pages
   already carry, or it becomes the worst copy of each of them.

   Headline is the live /services/ page's own line. Every price and
   every hook below is lifted from the child page it links to, so
   there is exactly one place each figure is maintained. */

type Row = {
  t: string
  hook: string
  /* The real figure, or null when the module is simply in the account */
  price: React.ReactNode
  to?: string
  href?: string
}

type Family = {
  id: string
  label: string
  /* Why these belong together, in the system's own terms */
  note: string
  rows: Row[]
}

const FAMILIES = (t: PageText): Family[] => [
  {
    id: "mailing",
    label: t.families[0].label,
    note: t.families[0].note,
    rows: [
      {
        t: t.families[0].rows[0].t,
        hook: t.families[0].rows[0].hook,
        price: <Rich text={t.families[0].rows[0].price} ltrClass="sv-ltr" />,
        to: "/newsletters/",
      },
      {
        t: t.families[0].rows[1].t,
        hook: t.families[0].rows[1].hook,
        price: t.families[0].rows[1].price,
        to: "/landing-pages/",
      },
      {
        t: t.families[0].rows[2].t,
        hook: t.families[0].rows[2].hook,
        price: t.families[0].rows[2].price,
        to: "/digital-courses/",
      },
      {
        t: t.families[0].rows[3].t,
        hook: t.families[0].rows[3].hook,
        price: t.families[0].rows[3].price,
        href: "https://ai.sendmsg.co.il/",
      },
    ],
  },
  {
    id: "sms",
    label: t.families[1].label,
    note: t.families[1].note,
    rows: [
      {
        t: t.families[1].rows[0].t,
        hook: t.families[1].rows[0].hook,
        price: t.families[1].rows[0].price,
        to: "/sms/",
      },
      {
        t: t.families[1].rows[1].t,
        hook: t.families[1].rows[1].hook,
        price: <Rich text={t.families[1].rows[1].price} ltrClass="sv-ltr" />,
        to: "/sms-bank/",
      },
      {
        t: t.families[1].rows[2].t,
        hook: t.families[1].rows[2].hook,
        price: <Rich text={t.families[1].rows[2].price} ltrClass="sv-ltr" />,
        to: "/virtual-number/",
      },
    ],
  },
  {
    id: "clients",
    label: t.families[2].label,
    note: t.families[2].note,
    rows: [
      {
        t: t.families[2].rows[0].t,
        hook: t.families[2].rows[0].hook,
        price: t.families[2].rows[0].price,
        to: "/crm/",
      },
      {
        t: t.families[2].rows[1].t,
        hook: t.families[2].rows[1].hook,
        price: t.families[2].rows[1].price,
        to: "/meetings/",
      },
      {
        t: t.families[2].rows[2].t,
        hook: t.families[2].rows[2].hook,
        price: t.families[2].rows[2].price,
        to: "/affiliate/",
      },
    ],
  },
  {
    id: "infra",
    label: t.families[3].label,
    note: t.families[3].note,
    rows: [
      {
        t: t.families[3].rows[0].t,
        hook: t.families[3].rows[0].hook,
        price: <Rich text={t.families[3].rows[0].price} ltrClass="sv-ltr" />,
        to: "/email-bank/",
      },
      {
        t: t.families[3].rows[1].t,
        hook: t.families[3].rows[1].hook,
        price: <Rich text={t.families[3].rows[1].price} ltrClass="sv-ltr" />,
        to: "/domain/",
      },
      {
        t: t.families[3].rows[2].t,
        hook: t.families[3].rows[2].hook,
        price: t.families[3].rows[2].price,
        to: "/api/",
      },
    ],
  },
]


/* FREE: moved to src/locales/he/pages/services.json as "free". */
const ArrowIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      d="M14 5l-7 7 7 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ExternalIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      d="M14 4h6v6M20 4l-8.5 8.5M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const RowBody: React.FC<{ r: Row }> = ({ r }) => (
  <>
    <span className="sv-row-t">{r.t}</span>
    <span className="sv-row-hook">{r.hook}</span>
    <span className="sv-row-price">{r.price}</span>
    <span className="sv-row-go" aria-hidden="true">
      {r.href ? <ExternalIcon /> : <ArrowIcon />}
    </span>
  </>
)

const ServicesPage: React.FC = () => {
  const t = useText(TEXT)
  const MODULE_COUNT = FAMILIES(t).reduce((n, f) => n + f.rows.length, 0)
  return (
    <Layout>
      <div className="sv">
        <section className="sv-hero">
          <div className="container">
            <div className="sv-hero-grid">
              <div className="sv-hero-main">
                <h1>{t.h1}</h1>
                <p className="sv-hero-sub">
                  {t.heroSub}
                </p>
                <p className="sv-hero-note">
                  {formatText(t.heroNote, { n: MODULE_COUNT })}
                </p>
                <a
                  href={PANEL_URL}
                  className="sv-btn sv-btn-accent"
                  onClick={openSignup}
                >
                  {t.btn}
                </a>
              </div>

              {/* The panel holds an object, not a sentence: it is the
                  index of the page, with the real count per family. */}
              <nav className="sv-jump" aria-label={t.ariaLabel}>
                <ul>
                  {FAMILIES(t).map((f) => (
                    <li key={f.id}>
                      <a href={`#${f.id}`}>
                        <span className="sv-jump-t">{f.label}</span>
                        <span className="sv-jump-n">{f.rows.length}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {/* The page itself. The family label parks beside its own rows
            and hands off to the next as you scroll, so a long index
            never loses which group you are reading. */}
        <section className="sv-index">
          <div className="container">
            {FAMILIES(t).map((f) => (
              <div className="sv-fam" id={f.id} key={f.id}>
                <div className="sv-fam-head">
                  <h2>{f.label}</h2>
                  <p>{f.note}</p>
                </div>
                <ul className="sv-rows">
                  {f.rows.map((r) => (
                    <li key={r.t}>
                      {r.to ? (
                        <LocalizedLink to={r.to}>
                          <RowBody r={r} />
                        </LocalizedLink>
                      ) : (
                        <a
                          href={r.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <RowBody r={r} />
                          <span className="sv-sr">{t.sr}</span>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="sv-free">
          <div className="container">
            <div className="sv-free-grid">
              <div className="sv-head">
                <h2>{t.h2}</h2>
                <p>
                  {t.p}
                </p>
                <LocalizedLink to="/pricing/" className="sv-free-link">
                  {t.freeLink}
                  <span aria-hidden="true">
                    <ArrowIcon />
                  </span>
                </LocalizedLink>
              </div>
              <dl className="sv-free-list">
                {t.free.map((f) => (
                  <div className="sv-free-item" key={f.t}>
                    <dt>{f.t}</dt>
                    <dd>{f.d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </div>
      <CTA />
    </Layout>
  )
}

export default ServicesPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = TEXT[pageContext.locale]
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/services/"
    />
  )
}
