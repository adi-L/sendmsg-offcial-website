import React, { useState } from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/shomer-shabbat.css"
import type { PageContext } from "../locales/config"
import { useText } from "../locales/LocaleContext"
import Rich from "../locales/Rich"
import LocalizedLink from "../locales/LocalizedLink"
import heText from "../locales/he/pages/shomer-shabbat.json"

/* This page's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }
type PageText = typeof heText

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2 6.5L4.5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const icon = (paths: React.ReactNode) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {paths}
  </svg>
)

const CandlesIcon = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 10v10M16 10v10M5 20h14" />
    <path d="M8 7c1 -1 1 -2.4 0 -3.4C7 4.6 7 6 8 7zM16 7c1 -1 1 -2.4 0 -3.4C15 4.6 15 6 16 7z" />
  </svg>
)

const steps = (t: PageText) => [
  {
    label: t.steps[0].label,
    title: t.steps[0].title,
    text: t.steps[0].text,
    icon: <CandlesIcon />,
  },
  {
    label: t.steps[1].label,
    title: t.steps[1].title,
    text: t.steps[1].text,
    icon: icon(<><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></>),
  },
  {
    label: t.steps[2].label,
    title: t.steps[2].title,
    text: t.steps[2].text,
    icon: icon(<><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" /></>),
  },
  {
    label: t.steps[3].label,
    title: t.steps[3].title,
    text: t.steps[3].text,
    icon: icon(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18M11 15h4M13 13v4" /></>),
  },
]

const features = (t: PageText) => [
  {
    title: t.features[0].title,
    desc: t.features[0].desc,
    icon: icon(<><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M9 9a3 3 0 0 1 6 0v2M8.5 11h7v4h-7z" /></>),
  },
  {
    title: t.features[1].title,
    desc: t.features[1].desc,
    icon: icon(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
  },
  {
    title: t.features[2].title,
    desc: t.features[2].desc,
    icon: icon(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>),
  },
  {
    title: t.features[3].title,
    desc: t.features[3].desc,
    icon: icon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>),
  },
  {
    title: t.features[4].title,
    desc: t.features[4].desc,
    icon: <span>{t.span}</span>,
  },
  {
    title: t.features[5].title,
    desc: t.features[5].desc,
    icon: <span>{t.span2}</span>,
  },
  {
    title: t.features[6].title,
    desc: t.features[6].desc,
    icon: icon(<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M3 17l5-4 4 3 4-4 5 5" /></>),
  },
  {
    title: t.features[7].title,
    desc: t.features[7].desc,
    icon: icon(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>),
  },
]

const ShomerShabbatPage: React.FC = () => {
  const t = useText(TEXT)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <Layout>
      <div className="sh">
        {/* Hero */}
        <section className="sh-hero">
          <div className="container">
            <h1>{t.h1}</h1>
            <p className="sh-hero-sub">
              {t.heroSub}
            </p>
            <div className="sh-hero-actions">
              <a href={PANEL_URL} className="primary-btn" onClick={openSignup}>
                {t.a}
              </a>
              <LocalizedLink to="/pricing/" className="sh-link">
                {t.link}
              </LocalizedLink>
            </div>
            <div className="sh-hero-trust">
              {t.heroTrust.map((item) => (
                <span key={item}>
                  <CheckIcon />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Shabbat timeline */}
        <section className="sh-band">
          <div className="container">
            <h2>{t.h2}</h2>
            <p className="sh-band-sub">{t.bandSub}</p>
            <div className="sh-steps">
              {steps(t).map((step) => (
                <div key={step.label} className="sh-step">
                  <div className="sh-step-icon">{step.icon}</div>
                  <div className="sh-step-label">{step.label}</div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="sh-section">
          <div className="container">
            <h2 className="sh-section-title">{t.sectionTitle}</h2>
            <p className="sh-section-sub">
              {t.sectionSub}
            </p>
            <div className="sh-features">
              {features(t).map((f) => (
                <div key={f.title} className="sh-feature">
                  <div className="sh-feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blocked page mockup */}
        <section className="sh-section sh-mock-section">
          <div className="container">
            <div className="sh-mock-grid">
              <div className="sh-mock-text">
                <h2>{t.h22}</h2>
                <p>
                  {t.p}
                </p>
                <p>
                  {t.p2}
                </p>
              </div>
              <div className="sh-browser" role="img" aria-label={t.ariaLabel}>
                <div className="sh-browser-bar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="sh-browser-body">
                  <p className="sh-browser-bsd">{t.browserBsd}</p>
                  <div className="sh-browser-candles">
                    <CandlesIcon size={40} />
                  </div>
                  <p className="sh-browser-title">{t.browserTitle}</p>
                  <p className="sh-browser-text">
                    <Rich text={t.browserText} />
                  </p>
                  <div className="sh-browser-tear" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="sh-section">
          <div className="container">
            <h2 className="sh-section-title">{t.sectionTitle2}</h2>
            <div className="sh-faq-list">
              {t.faqs.map((faq, i) => (
                <div key={faq.q} className="sh-faq-item" data-open={openFaq === i}>
                  <button
                    className="sh-faq-q"
                    aria-expanded={openFaq === i}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <span className="sh-faq-arrow" aria-hidden="true">▾</span>
                  </button>
                  {openFaq === i && <div className="sh-faq-a">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <CTA />
    </Layout>
  )
}

export default ShomerShabbatPage

export const Head: HeadFC<unknown, PageContext> = ({ pageContext }) => {
  const t = TEXT[pageContext.locale]
  return (
    <SEO locale={pageContext.locale}
      title={t.seo.title}
      description={t.seo.description}
      pathname="/shomer-shabbat/"
    />
  )
}
