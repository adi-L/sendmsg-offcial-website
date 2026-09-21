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

const row1: Array<{ src: string; alt: string }> = [
  { src: igudDir, alt: "איגוד הדירקטורים בישראל" },
  { src: igudTaasia, alt: "איגוד התעשיה הקיבוצית" },
  { src: success, alt: "Success" },
  { src: telAviv, alt: "עיריית תל אביב יפו" },
  { src: tzaarBaalei, alt: "אגודת צער בעלי חיים בישראל" },
  { src: dataPro, alt: "Data Pro Proximity" },
  { src: bizmakebiz, alt: "BizMakeBiz" },
  { src: technion, alt: "אגודת הסטודנטים בטכניון" },
]

const row2: Array<{ src: string; alt: string }> = [
  { src: isi, alt: "ISI Science for Life" },
  { src: logo019, alt: "019 Mobile" },
  { src: tznuLachayot, alt: "תנו לחיות לחיות" },
  { src: tzagAliya, alt: "TZAG Computer Systems" },
  { src: fontbit, alt: "Fontbit" },
  { src: prakti, alt: "פרקטי" },
  { src: habima, alt: "הבימה התיאטרון הלאומי" },
  { src: yadSarah, alt: "יד שרה" },
]

const SocialProof: React.FC = () => (
  <section className="section" style={styles.section}>
    <div className="container" style={styles.container}>
      <h2 style={styles.heading}>
        מעל 51,559 משתמשים מרוצים
      </h2>

      <div style={styles.logosGrid}>
        {row1.map((item) => (
          <div key={item.alt} style={styles.logoItem}>
            <img
              src={item.src}
              alt={item.alt}
              style={styles.logoImg}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div style={styles.logosGrid}>
        {row2.map((item) => (
          <div key={item.alt} style={styles.logoItem}>
            <img
              src={item.src}
              alt={item.alt}
              style={styles.logoImg}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
)

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
