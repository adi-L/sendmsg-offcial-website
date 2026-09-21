import React, { useEffect } from "react"

// Built bundle of https://github.com/comstarsystemsltd/sendmsg-signup,
// copied to static/signup/ (images must sit next to the JS — it resolves
// them via import.meta.url). Rebuild there and re-copy to update.
const SCRIPT_SRC = "/signup/sendmsg-register.js"
const DIALOG_ID = "signup-dialog"

export const PANEL_URL = "https://panel.sendmsg.co.il/"

interface SendmsgRegisterElement extends HTMLElement {
  open: () => void
  close: () => void
}

/**
 * CTA click handler: opens the signup modal when the web component is
 * loaded, otherwise lets the link navigate to the panel as a fallback.
 */
export const openSignup = (e?: React.MouseEvent) => {
  const el = document.getElementById(DIALOG_ID) as SendmsgRegisterElement | null
  if (el && typeof el.open === "function") {
    e?.preventDefault()
    el.open()
  }
}

const SignupDialog: React.FC = () => {
  useEffect(() => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return
    const script = document.createElement("script")
    script.type = "module"
    script.src = SCRIPT_SRC
    document.body.appendChild(script)
  }, [])

  return <sendmsg-register id={DIALOG_ID} business-ai="" />
}

export default SignupDialog
