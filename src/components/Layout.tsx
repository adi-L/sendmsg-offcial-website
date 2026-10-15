import React, { ReactNode } from "react"
import Header from "./Header"
import Footer from "./Footer"
import SignupDialog from "./SignupDialog"
import PromoPopup from "./PromoPopup"
import { useText } from "../locales/LocaleContext"
import heText from "../locales/he/layout.json"

/* This component's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

interface LayoutProps {
  children: ReactNode
}

/* Every page opens with a topbar, a logo row and a services mega-menu, so
   reaching the content from the keyboard meant tabbing through all of it on
   every page -- WCAG 2.4.1 Bypass Blocks, which is level A and so sits below
   the AA conformance /accessibility/ declares. The link is the first thing
   in the tab order and only shows itself once focused. */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const t = useText(TEXT)
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skipLink}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <SignupDialog />
      <PromoPopup />
    </>
  )
}

export default Layout
