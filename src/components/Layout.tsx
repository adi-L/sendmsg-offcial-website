import React, { ReactNode } from "react"
import Header from "./Header"
import Footer from "./Footer"
import SignupDialog from "./SignupDialog"
import PromoPopup from "./PromoPopup"

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <SignupDialog />
      <PromoPopup />
    </>
  )
}

export default Layout
