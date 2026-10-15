import React from "react"

import nespresso from "../images/clients/nespresso.png"
import hackeru from "../images/clients/hackeru.png"
import bni from "../images/clients/bni.png"
import zaka from "../images/clients/zaka.png"
import telAviv from "../images/clients/tel-aviv.svg"
import remax from "../images/clients/remax.png"
import habima from "../images/clients/habima.svg"
import yadSarah from "../images/clients/yad-sarah.webp"
import bizmakebiz from "../images/clients/bizmakebiz.png"
import enter from "../images/clients/enter.png"
import lafayette from "../images/clients/lafayette.png"
import flyfoot from "../images/clients/flyfoot.png"
import betili from "../images/clients/betili.png"
import skediya from "../images/clients/skediya.png"
import success from "../images/clients/success.png"
import technion from "../images/clients/technion-students.webp"
import dataPro from "../images/clients/data-pro.webp"
import igudTaasia from "../images/clients/igud-taasia.webp"
import igudDir from "../images/clients/igud-directorim.webp"
import prakti from "../images/clients/prakti.webp"
import fontbit from "../images/clients/fontbit.webp"
import isi from "../images/clients/isi.webp"
import logo019 from "../images/clients/019.webp"
import tznuLachayot from "../images/clients/tnu-lachayot.webp"
import tzaarBaalei from "../images/clients/tzaar-baalei-chaim.webp"
import tzagAliya from "../images/clients/tzag-aliya.webp"
import metuka from "../images/clients/metuka.svg"
import yarin from "../images/clients/yarin.png"
import mischar from "../images/clients/mischar-tasia.png"
import newBrand from "../images/clients/new-brand.png"
import { useText } from "../locales/LocaleContext"
import heText from "../locales/he/social-proof.json"

/* This component's text, per language: see src/locales/README.md. */
const TEXT = { he: heText }

/* Logos; their alt text is row1Alts / row2Alts in social-proof.json, in order. */
const row1: Array<{ src: string }> = [
  { src: igudDir },
  { src: igudTaasia },
  { src: success },
  { src: telAviv },
  { src: tzaarBaalei },
  { src: dataPro },
  { src: bizmakebiz },
  { src: technion },
]

const row2: Array<{ src: string }> = [
  { src: isi },
  { src: logo019 },
  { src: tznuLachayot },
  { src: tzagAliya },
  { src: fontbit },
  { src: prakti },
  { src: habima },
  { src: yadSarah },
]

const SocialProof: React.FC = () => {
  const t = useText(TEXT)
  return (
    <section className="section" style={styles.section}>
      <div className="container" style={styles.container}>
        <h2 style={styles.heading}>
          {t.heading}
        </h2>

        <div style={styles.logosGrid}>
          {row1.map((item, i) => (
            <div key={item.src} style={styles.logoItem}>
              <img
                src={item.src}
                alt={t.row1Alts[i]}
                style={styles.logoImg}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div style={styles.logosGrid}>
          {row2.map((item, i) => (
            <div key={item.src} style={styles.logoItem}>
              <img
                src={item.src}
                alt={t.row2Alts[i]}
                style={styles.logoImg}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "var(--bg-soft)",
    paddingTop: "64px",
    paddingBottom: "64px",
  },
  container: {
    textAlign: "center",
  },
  heading: {
    fontSize: "2.4rem",
    fontWeight: 800,
    background: "var(--primary-gradient)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "48px",
  },
  logosGrid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "48px",
    flexWrap: "wrap" as const,
    marginBottom: "32px",
  },
  logoItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "120px",
    height: "60px",
  },
  logoImg: {
    maxHeight: "50px",
    maxWidth: "110px",
    objectFit: "contain" as const,
    filter: "grayscale(100%)",
    opacity: 0.6,
  },
}

export default SocialProof
