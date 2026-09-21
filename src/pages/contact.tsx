import React, { useState, FormEvent } from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"

const PhoneIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const WhatsAppIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
)

const ClockIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <Layout>
      <div className="contact-page">
        <section className="contact-hero">
          <div className="container">
            <h1>בואו נדבר</h1>
            <p>שאלה, התלבטות או סתם רעיון? נשמח לשמוע ולעזור.</p>
          </div>
        </section>

        <section className="contact-body">
          <div className="container contact-grid">
            <aside className="contact-channels">
              <h2>הדרך המהירה</h2>

              <a href="tel:077-4600600" className="contact-channel">
                <span className="contact-badge contact-badge-blue">
                  <PhoneIcon />
                </span>
                <span className="contact-channel-text">
                  <strong>טלפון</strong>
                  <span dir="ltr">077-4600600</span>
                </span>
              </a>

              <a
                href="https://api.whatsapp.com/send?phone=972559377588"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-channel"
              >
                <span className="contact-badge contact-badge-green">
                  <WhatsAppIcon />
                </span>
                <span className="contact-channel-text">
                  <strong>WhatsApp</strong>
                  <span dir="ltr">055-9377588</span>
                </span>
              </a>

              <div className="contact-channel contact-channel-static">
                <span className="contact-badge contact-badge-blue">
                  <ClockIcon />
                </span>
                <span className="contact-channel-text">
                  <strong>שעות פעילות</strong>
                  <span>ימים א׳ עד ה׳, 9:00 עד 17:00</span>
                </span>
              </div>
            </aside>

            <div className="contact-card">
              {submitted ? (
                <div className="contact-success" role="status">
                  <svg viewBox="0 0 52 52" width="72" height="72" aria-hidden="true">
                    <circle className="contact-success-circle" cx="26" cy="26" r="24" fill="none" />
                    <path className="contact-success-check" fill="none" d="M14 27l8 8 16-17" />
                  </svg>
                  <h3>ההודעה נשלחה, תודה!</h3>
                  <p>נחזור אליכם בהקדם, בדרך כלל עוד באותו יום עבודה.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate={false}>
                  <h2>או שנחזור אליכם</h2>

                  <div className="contact-field">
                    <label htmlFor="contact-name">שם מלא</label>
                    <input id="contact-name" name="name" type="text" autoComplete="name" required />
                  </div>

                  <div className="contact-row">
                    <div className="contact-field">
                      <label htmlFor="contact-email">אימייל</label>
                      <input id="contact-email" name="email" type="email" autoComplete="email" required />
                    </div>
                    <div className="contact-field">
                      <label htmlFor="contact-phone">
                        טלפון <span className="contact-optional">לא חובה</span>
                      </label>
                      <input id="contact-phone" name="phone" type="tel" autoComplete="tel" />
                    </div>
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-message">איך נוכל לעזור?</label>
                    <textarea id="contact-message" name="message" rows={5} required />
                  </div>

                  <button type="submit" className="primary-btn contact-submit">
                    שליחת הודעה
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default ContactPage

export const Head: HeadFC = () => (
  <SEO title="צרו קשר" description="צרו קשר עם שלח מסר, טלפון, WhatsApp או טופס" pathname="/contact/" />
)
