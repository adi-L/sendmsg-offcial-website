import React from "react"

import logo019 from "../images/clients/019.webp"
import atid from "../images/clients/atid.gif"
import betili from "../images/clients/betili.png"
import bizmakebiz from "../images/clients/bizmakebiz.png"
import bni from "../images/clients/bni.png"
import dataPro from "../images/clients/data-pro.webp"
import enter from "../images/clients/enter.png"
import flyfoot from "../images/clients/flyfoot.png"
import fontbit from "../images/clients/fontbit.webp"
import habima from "../images/clients/habima.svg"
import hackeru from "../images/clients/hackeru.png"
import igudDir from "../images/clients/igud-directorim.webp"
import igudTaasia from "../images/clients/igud-taasia.webp"
import isi from "../images/clients/isi.webp"
import lafayette from "../images/clients/lafayette.png"
import metuka from "../images/clients/metuka.svg"
import mischar from "../images/clients/mischar-tasia.png"
import nespresso from "../images/clients/nespresso.png"
import newBrand from "../images/clients/new-brand.png"
import prakti from "../images/clients/prakti.webp"
import remax from "../images/clients/remax.png"
import skediya from "../images/clients/skediya.png"
import success from "../images/clients/success.png"
import technion from "../images/clients/technion-students.webp"
import telAviv from "../images/clients/tel-aviv.svg"
import tnuLachayot from "../images/clients/tnu-lachayot.webp"
import tzaarBaalei from "../images/clients/tzaar-baalei-chaim.webp"
import tzagAliya from "../images/clients/tzag-aliya.webp"
import yadSarah from "../images/clients/yad-sarah.webp"
import yarin from "../images/clients/yarin.png"
import zaka from "../images/clients/zaka.png"
import { useT } from "../locales/LocaleContext"

type Logo = { src: string }

/* Ordered so the recognisable civic and national marks land early: the
   band is read for a second or two before the eye moves on, and whatever
   is on screen in that second is the whole impression it leaves. */
/* Each logo's alt text is the same position in `alts` in client-marquee.json. */
const logos: Logo[] = [
  { src: telAviv },
  { src: yadSarah },
  { src: habima },
  { src: technion },
  { src: nespresso },
  { src: zaka },
  { src: remax },
  { src: igudDir },
  { src: tzaarBaalei },
  { src: hackeru },
  { src: mischar },
  { src: igudTaasia },
  { src: tnuLachayot },
  { src: bni },
  { src: lafayette },
  { src: betili },
  { src: atid },
  { src: logo019 },
  { src: dataPro },
  { src: success },
  { src: isi },
  { src: bizmakebiz },
  { src: prakti },
  { src: metuka },
  { src: skediya },
  { src: enter },
  { src: flyfoot },
  { src: fontbit },
  { src: tzagAliya },
  { src: newBrand },
  { src: yarin },
]

/* A logo wall that outgrew its band. The track carries the set twice and
   translates exactly one set's width, so the seam never lands on screen;
   the copy is aria-hidden because a screen reader wants each client named
   once, not twice. The whole thing is ltr regardless of the page around
   it — the animation is a fixed leftward translate, and flipping the
   writing direction under it only reverses which end the seam enters from.

   Under reduced motion the duplicate is dropped and the row wraps into a
   static grid, because a paused max-content track would clip two thirds
   of the clients out of the page. */
const ClientMarquee: React.FC = () => {
  const t = useT("client-marquee")
  return (
    <div className="cm" dir="ltr">
      <div className="cm-track">
        {logos.map((logo, i) => (
          <span className="cm-item" key={logo.src}>
            <img src={logo.src} alt={t.alts[i]} loading="lazy" decoding="async" />
          </span>
        ))}
        {logos.map((logo) => (
          <span className="cm-item cm-dup" key={`dup-${logo.src}`} aria-hidden="true">
            <img src={logo.src} alt="" loading="lazy" decoding="async" />
          </span>
        ))}
      </div>
    </div>
  )
}

export default ClientMarquee
