import React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import CTA from "../components/CTA"
import SEO from "../components/SEO"
import { openSignup, PANEL_URL } from "../components/SignupDialog"
import "../styles/virtual-number.css"

/* Where the live page's "לרכישת מס' וירטואלי חדש" button goes */
const BUY_URL =
  "https://panel.sendmsg.co.il/PurchaseSms.aspx?cat=113#selectedPackege"

/* The demo the live page invites you to run, and the number it names */
const DEMO_NUMBER = "055-9377588"
const DEMO_WORD = "חגים"

/* The live page says all of this in one run-on sentence. Same claims,
   unpacked so they can be read. Nothing here is added to it. */
const capabilities = [
  {
    t: "ההודעות יוצאות ממספר משלכם",
    d: "המספר הווירטואלי מוציא את ההודעות שלכם ממספר ייעודי במערכת.",
  },
  {
    t: "כל התשובות במקום אחד",
    d: "התשובות של הנמענים מתרכזות ברשימה אחת שניתן לייצא.",
  },
  {
    t: "הסרה בהשב",
    d: "כלי אוטומציה שמסיר נמען מהרשימה לפי תשובה שלו.",
  },
  {
    t: "שיוך אוטומטי לקבוצות",
    d: "נמען שמשיב בביטוי נבחר משויך לקבוצה שלו מעצמו.",
  },
  {
    t: "אישורי הגעה, סקרים וחידונים",
    d: "הכל רץ על אותו מספר ואוסף את התשובות לאותה רשימה.",
  },
]

const VirtualNumberPage: React.FC = () => (
  <Layout>
    <div className="vn">
      <section className="vn-hero">
        <div className="container">
          <div className="vn-hero-split">
            <div className="vn-hero-text">
              <h1>מספר וירטואלי לשליחת הודעות</h1>
              <p className="vn-lead">
                מספר וירטואלי מאפשר להוציא את ההודעות שלכם ממספר במערכת, כאשר כל
                התשובות של הנמענים מתרכזות ברשימה שניתן לייצא.
              </p>
            </div>

            {/* One number, one button. The price is the whole offer, so it
                gets a surface of its own rather than a line in a list. */}
            <div className="vn-offer">
              <p className="vn-offer-label">עלות לשנה</p>
              <p className="vn-offer-price">
                <span className="vn-offer-cur" aria-hidden="true">₪</span>
                <span className="vn-offer-num">118</span>
                <span className="vn-sr">118 שקלים</span>
              </p>
              <p className="vn-offer-terms">+ מע״מ, לשנה</p>
              <a href={BUY_URL} className="vn-btn vn-btn-accent">
                לרכישת מס׳ וירטואלי חדש
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Ruled rows, term then sentence: five claims that each need a line
          of explanation, which is a list a card grid would only pad out. */}
      <section className="vn-what">
        <div className="container">
          <div className="vn-what-split">
            <div className="vn-head">
              <h2>מה המספר עושה</h2>
              <p>
                בנוסף יש כלי אוטומציה, אישורי הגעה, סקרים, חידונים ועוד, הכל על
                אותו מספר.
              </p>
            </div>

            <dl className="vn-list">
              {capabilities.map((c) => (
                <div key={c.t} className="vn-list-row">
                  <dt>{c.t}</dt>
                  <dd>{c.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* The one authored moment: the page shows you the message instead
          of describing it, and the message is real — it is the demo the
          live page asks you to run. */}
      <section className="vn-demo">
        <div className="container">
          <div className="vn-demo-split">
            <div className="vn-head">
              <h2>רוצים לראות איך זה עובד?</h2>
              <p>
                שלחו את המילה ״{DEMO_WORD}״ רווח כתובת המייל שלכם למספר{" "}
                <span className="vn-num">{DEMO_NUMBER}</span>.
              </p>
            </div>

            <div className="vn-phone" aria-hidden="true">
              <div className="vn-phone-to">
                <span className="vn-phone-to-label">אל</span>
                <span className="vn-num">{DEMO_NUMBER}</span>
              </div>
              <div className="vn-bubble">
                <span>{DEMO_WORD}</span>{" "}
                <span className="vn-bubble-mail">name@mail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="vn-buy">
        <div className="container">
          <div className="vn-buy-row">
            <div>
              <h2>מספר וירטואלי משלכם</h2>
              <p>
                <span className="vn-num">₪118</span> לשנה, + מע״מ
              </p>
            </div>
            <div className="vn-buy-actions">
              <a href={BUY_URL} className="vn-btn vn-btn-light">
                לרכישת מס׳ וירטואלי חדש
              </a>
              <a href={PANEL_URL} className="vn-buy-alt" onClick={openSignup}>
                פתיחת חשבון בחינם
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
    <CTA />
  </Layout>
)

export default VirtualNumberPage

export const Head: HeadFC = () => (
  <SEO
    title="מספר וירטואלי"
    description="מספר וירטואלי לשליחת הודעות: ההודעות יוצאות ממספר ייעודי, כל התשובות מתרכזות ברשימה אחת שניתן לייצא. ₪118 לשנה, לפני מע״מ."
    pathname="/virtual-number/"
  />
)
