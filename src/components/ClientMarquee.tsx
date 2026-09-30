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

type Logo = { src: string; alt: string }

/* Ordered so the recognisable civic and national marks land early: the
   band is read for a second or two before the eye moves on, and whatever
   is on screen in that second is the whole impression it leaves. */
const logos: Logo[] = [
  { src: telAviv, alt: "עיריית תל אביב יפו" },
  { src: yadSarah, alt: "יד שרה" },
  { src: habima, alt: "הבימה התיאטרון הלאומי" },
  { src: technion, alt: "אגודת הסטודנטים בטכניון" },
  { src: nespresso, alt: "Nespresso" },
  { src: zaka, alt: "זק״א" },
  { src: remax, alt: "RE/MAX" },
  { src: igudDir, alt: "איגוד הדירקטורים בישראל" },
  { src: tzaarBaalei, alt: "אגודת צער בעלי חיים בישראל" },
  { src: hackeru, alt: "HackerU" },
  { src: mischar, alt: "לשכת המסחר והתעשייה חיפה והצפון" },
  { src: igudTaasia, alt: "איגוד התעשייה הקיבוצית" },
  { src: tnuLachayot, alt: "תנו לחיות לחיות" },
  { src: bni, alt: "BNI ישראל" },
  { src: lafayette, alt: "לאפייט — רשת נעליים ותיקים" },
  { src: betili, alt: "ביתילי" },
  { src: atid, alt: "רשת עתיד" },
  { src: logo019, alt: "019 Mobile" },
  { src: dataPro, alt: "Data Pro Proximity" },
  { src: success, alt: "Success" },
  { src: isi, alt: "ISI Science for Life" },
  { src: bizmakebiz, alt: "BizMakeBiz" },
  { src: prakti, alt: "פרקטי" },
  { src: metuka, alt: "מתוקה" },
  { src: skediya, alt: "שקדיה" },
  { src: enter, alt: "Enter" },
  { src: flyfoot, alt: "פלייפוט" },
  { src: fontbit, alt: "Fontbit" },
  { src: tzagAliya, alt: "TZAG Computer Systems" },
  { src: newBrand, alt: "פוקוס — מכירת רכב בתמונה" },
  { src: yarin, alt: "Yarin Shahaf Tel Aviv" },
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
const ClientMarquee: React.FC = () => (
  <div className="cm" dir="ltr">
    <div className="cm-track">
      {logos.map((logo) => (
        <span className="cm-item" key={logo.alt}>
          <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" />
        </span>
      ))}
      {logos.map((logo) => (
        <span className="cm-item cm-dup" key={`dup-${logo.alt}`} aria-hidden="true">
          <img src={logo.src} alt="" loading="lazy" decoding="async" />
        </span>
      ))}
    </div>
  </div>
)

export default ClientMarquee
