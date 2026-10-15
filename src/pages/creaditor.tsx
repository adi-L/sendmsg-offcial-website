import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import "../styles/creaditor.css"
import type { PageContext } from "../locales/config"
import { useT } from "../locales/LocaleContext"
import { getT } from "../locales/messages"
import Rich from "../locales/Rich"

/* Creaditor is a separate product with its own site. Every outbound
   link here leaves sendmsg.co.il, so they all open in a new tab and
   the page never pretends to be the product's own home. */
const CREADITOR_URL = "https://creaditor.ai/"

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

/* Points the way the language runs. */
const GoIcon = ({ size = 20 }: { size?: number }) =>
  stroke(
    <>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </>,
    size
  )

const ImageIcon = () =>
  stroke(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <circle cx="8.6" cy="8.6" r="1.6" />
      <path d="M21 14.5 16.4 10 5 21" />
    </>,
    34
  )

const builderIcons: Record<string, React.ReactNode> = {
  courses: (
    <>
      <path d="M3 6.5 12 3l9 3.5-9 3.5z" />
      <path d="M21 6.5v5" />
      <path d="M6.5 8.7v5.6c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9V8.7" />
    </>
  ),
  forms: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M8.5 8.5h7" />
      <path d="M8.5 12.5h7" />
      <path d="M8.5 16.5h3.5" />
    </>
  ),
  newsletters: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.3 6.4 7.5 5.8a2 2 0 0 0 2.4 0l7.5-5.8" />
    </>
  ),
  pages: (
    <>
      <rect x="3" y="3.5" width="18" height="17" rx="2.5" />
      <path d="M3 9h18" />
      <path d="M9 20.5V9" />
    </>
  ),
  sites: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.4 9.5h17.2" />
      <path d="M3.4 14.5h17.2" />
      <path d="M12 3c-2.4 2.4-3.6 5.4-3.6 9s1.2 6.6 3.6 9c2.4-2.4 3.6-5.4 3.6-9S14.4 5.4 12 3Z" />
    </>
  ),
}

/* builders: moved to src/locales/he/pages/creaditor.json as "builders". */
/* memory: moved to src/locales/he/pages/creaditor.json as "memory". */
const frameworks = ["React", "Vue", "Angular", "Next.js", "WordPress", "Plain HTML"]

/* Every image on this page is still a slot. The label is the brief:
   each one names the asset that belongs there, so the page carries its
   own shot list until the real files land. */
const Shot = ({
  id,
  label,
  ratio = "16 / 10",
  tone,
}: {
  id: string
  label: string
  ratio?: string
  tone?: "ink"
}) => (
  <figure className="cr-shot" data-tone={tone} style={{ aspectRatio: ratio }}>
    <span className="cr-shot-icon">
      <ImageIcon />
    </span>
    <figcaption className="cr-shot-label">
      <span className="cr-shot-id cr-ltr">{id}</span>
      <span className="cr-shot-text">{label}</span>
    </figcaption>
  </figure>
)

const CreaditorPage = () => {
  const t = useT("pages/creaditor")
  return (
    <Layout>
      <div className="cr">
        {/* ── hero ───────────────────────────────────────────────
            Ink band, asymmetric: the claim on one side, the product
            itself on the other. */}
        <section className="cr-hero">
          <div className="container cr-hero-in">
            <div className="cr-hero-said">
              <h1 className="cr-hero-title cr-ltr">Creaditor</h1>
              <p className="cr-hero-claim">{t.heroClaim}</p>
              <p className="cr-hero-lede">
                {t.heroLede}
              </p>
              <div className="cr-hero-acts">
                <a
                  className="primary-btn cr-btn"
                  href={CREADITOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.a}
                  <GoIcon size={18} />
                </a>
                <a
                  className="cr-btn-ghost"
                  href={CREADITOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.btnGhost}
                </a>
              </div>
              <ul className="cr-hero-strip" aria-label={t.ariaLabel}>
                {t.builders.map((b) => (
                  <li key={b.name} className="cr-ltr">
                    {b.name.replace("Creaditor ", "")}
                  </li>
                ))}
              </ul>
            </div>
            <div className="cr-hero-shot">
              <Shot
                id="hero-editor.webp"
                label={t.label}
                ratio="16 / 11"
                tone="ink"
              />
            </div>
          </div>
        </section>

        {/* ── the five ───────────────────────────────────────────
            A numbered hairline list, not five equal tiles: these are
            five named things with one claim each, and that is a list. */}
        <section className="cr-section">
          <div className="container">
            <div className="cr-head">
              <h2>{t.h2}</h2>
              <p>
                {t.p}
              </p>
            </div>
            <ol className="cr-builders">
              {t.builders.map((b, i) => (
                <li className="cr-builder" key={b.name}>
                  <span className="cr-builder-n cr-ltr" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="cr-builder-icon">
                    {stroke(builderIcons[b.icon])}
                  </span>
                  <span className="cr-builder-main">
                    <strong className="cr-builder-name cr-ltr">{b.name}</strong>
                    <span className="cr-builder-claim">{b.claim}</span>
                  </span>
                  <span className="cr-builder-shot">
                    <Shot id={`${b.shot}.webp`} label={b.shotLabel} />
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── the brain ──────────────────────────────────────────
            Narrow claim, wide evidence. The memory is label and
            explanation, so it is a definition list. */}
        <section className="cr-section cr-brain-sec">
          <div className="container cr-split cr-split-brain">
            <div className="cr-brain-said">
              <div className="cr-head">
                <h2>{t.h22}</h2>
                <p>
                  {t.p2}
                </p>
              </div>
              <Shot
                id="brain-context.webp"
                label={t.label2}
                ratio="4 / 3"
              />
            </div>
            <div className="cr-memory-col">
              <p className="cr-memory-kicker">{t.memoryKicker}</p>
              <dl className="cr-memory">
                {t.memory.map((m) => (
                  <div className="cr-mem" key={m.t}>
                    <dt>{m.t}</dt>
                    <dd>{m.d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ── the contrast ───────────────────────────────────────
            The product's own comparison, kept as two facing panels
            rather than a feature table. */}
        <section className="cr-section cr-vs-sec">
          <div className="container">
            <p className="cr-vs-kicker">{t.vsKicker}</p>
            <div className="cr-vs">
              <div className="cr-vs-panel" data-side="other">
                <p className="cr-vs-who">{t.vsWho}</p>
                <p className="cr-vs-what">{t.vsWhat}</p>
                <Shot
                  id="vs-empty-canvas.webp"
                  label={t.label3}
                  ratio="16 / 10"
                />
              </div>
              <div className="cr-vs-panel" data-side="brain">
                <p className="cr-vs-who">{t.vsWho2}</p>
                <p className="cr-vs-what">{t.vsWhat2}</p>
                <Shot
                  id="vs-finished-email.webp"
                  label={t.label4}
                  ratio="16 / 10"
                  tone="ink"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── two ways in ────────────────────────────────────────
            Two doors, one context. Split down the middle because the
            two halves really are symmetrical here. */}
        <section className="cr-section cr-ways-sec">
          <div className="container">
            <div className="cr-head">
              <h2>{t.h23}</h2>
              <p>
                {t.p3}
              </p>
            </div>
            <div className="cr-ways">
              <div className="cr-way">
                <p className="cr-way-t">{t.wayT}</p>
                <p className="cr-way-d">
                  {t.wayD}
                </p>
                <ul className="cr-chips" aria-label={t.ariaLabel2}>
                  {frameworks.map((f) => (
                    <li key={f} className="cr-ltr">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cr-way">
                <p className="cr-way-t">{t.wayT2}</p>
                <p className="cr-way-d">
                  {t.wayD2}<span className="cr-ltr">MCP</span>{t.wayD3}
                </p>
                <ul className="cr-chips" aria-label={t.ariaLabel3}>
                  <li>{t.li}</li>
                  <li>{t.li2}</li>
                  <li>{t.li3}</li>
                </ul>
              </div>
            </div>
            <p className="cr-proof">
              <Rich text={t.proof} />
            </p>
          </div>
        </section>

        {/* ── white label ────────────────────────────────────────
            One sentence, set as type. No card. */}
        <section className="cr-label-sec">
          <div className="container cr-label-in">
            <p className="cr-label-claim">{t.labelClaim}</p>
            <p className="cr-label-d">
              <span className="cr-ltr">White-label</span>{t.labelD}{" "}
              <span className="cr-ltr">Creaditor</span>.
            </p>
          </div>
        </section>

        {/* ── out ────────────────────────────────────────────────
            The page ends where the product lives. */}
        <section className="cr-section cr-out-sec">
          <div className="container cr-out">
            <div className="cr-out-said">
              <h2>{t.h24}</h2>
              <p>{t.p4}</p>
            </div>
            <div className="cr-out-acts">
              <a
                className="primary-btn cr-btn"
                href={CREADITOR_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.a2}
                <GoIcon size={18} />
              </a>
              <a
                className="cr-out-link"
                href={CREADITOR_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="cr-ltr">creaditor.ai</span>
                <GoIcon size={18} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default CreaditorPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = getT(pageContext.locale, "pages/creaditor")
  return (
    <SEO locale={pageContext.locale}
      title="Creaditor"
      description={t.seo.description}
      pathname="/creaditor/"
    />
  )
}
