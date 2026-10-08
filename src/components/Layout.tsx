import React, { ReactNode } from "react"
import Header from "./Header"
import Footer from "./Footer"
import SignupDialog from "./SignupDialog"
import PromoPopup from "./PromoPopup"

interface LayoutProps {
  children: ReactNode
}

/* Every page opens with a topbar, a logo row and a services mega-menu, so
   reaching the content from the keyboard meant tabbing through all of it on
   every page -- WCAG 2.4.1 Bypass Blocks, which is level A and so sits below
   the AA conformance /accessibility/ declares. The link is the first thing
   in the tab order and only shows itself once focused. */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <a className="skip-link" href="#main">
        דלגו לתוכן העמוד
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
