import React from "react"
import { useT } from "../locales/LocaleContext"

const GOOGLE_ICON =
  "https://cdn.trustindex.io/assets/platform/Google/icon.svg"
const GOOGLE_LOGO =
  "https://cdn.trustindex.io/assets/platform/Google/logo.svg"
const STAR_ICON =
  "https://cdn.trustindex.io/assets/platform/Google/star/f.svg"


/* The reviews are customers' own words, copied verbatim from Google. */
type Review = { name: string; date: string; avatar: string; text: string }

// Each row repeats its list 4 times; the keyframes travel -50%, so the
// second half is an exact copy of the first and the loop is seamless.
const REPEATS = 4

const Stars: React.FC = () => {
  const t = useT("google-reviews")
  return (
    <div style={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <img
          key={i}
          src={STAR_ICON}
          alt={`star ${i}`}
          width="17"
          height="17"
          loading="lazy"
        />
      ))}
      <span
        style={styles.verified}
        title={t.verifiedTitle}
      >
        &#10003;
      </span>
    </div>
  )
}

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <div className="gr-card" style={styles.card}>
    <div style={styles.cardHeader}>
      <img
        src={GOOGLE_ICON}
        alt="Google"
        width="20"
        height="20"
        loading="lazy"
        style={styles.platformIcon}
      />
      <div style={styles.profileInfo}>
        <span style={styles.name}>{review.name}</span>
        <span style={styles.date}>{review.date}</span>
      </div>
      <img
        src={review.avatar}
        alt={review.name}
        width="40"
        height="40"
        loading="lazy"
        style={styles.avatar}
      />
    </div>
    <Stars />
    <p style={styles.reviewText}>{review.text}</p>
  </div>
)

const MarqueeRow: React.FC<{ items: Review[]; reverse?: boolean }> = ({
  items,
  reverse,
}) => (
  <div className="gr-marquee" dir="ltr">
    <div className={`gr-track${reverse ? " gr-track-reverse" : ""}`}>
      {Array.from({ length: REPEATS }, (_, rep) =>
        items.map((review, i) => (
          <ReviewCard key={`${rep}-${i}`} review={review} />
        ))
      )}
    </div>
  </div>
)

const GoogleReviews: React.FC = () => {
  const t = useT("google-reviews")
  const rowTop = t.reviews.slice(0, 4)
  const rowBottom = t.reviews.slice(4)
  return (
    <section className="section" style={styles.section}>
      <style>{marqueeCss}</style>

      <div style={styles.ratingBlock}>
        {/* <strong style={styles.ratingLabel}>מְעוּלֶה</strong> */}
        <div style={styles.bigStars}>
          {[1, 2, 3, 4, 5].map((i) => (
            <img
              key={i}
              src={STAR_ICON}
              alt={`star ${i}`}
              width="28"
              height="28"
              loading="lazy"
            />
          ))}
        </div>
        {/* <span style={styles.ratingCount}>
          מבוסס על <strong>148 ביקורות</strong>
        </span> */}
        {/* <img
          src={GOOGLE_LOGO}
          alt="Google"
          width="110"
          height="35"
          loading="lazy"
          style={styles.googleLogo}
        /> */}
      </div>

      <div style={styles.rows}>
        <MarqueeRow items={rowTop} />
        <MarqueeRow items={rowBottom} reverse />
      </div>

      <div style={styles.trustBadge}>
        <span style={styles.trustText}>
          {t.verifiedBy} <span style={styles.trustBrand}>Trustindex</span>{" "}
          <span style={styles.trustInfo}>&#9432;</span>
        </span>
      </div>
    </section>
  )
}

const marqueeCss = `
.gr-marquee {
  overflow: hidden;
  width: 100%;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
}
.gr-track {
  display: flex;
  gap: 16px;
  width: max-content;
  animation: gr-scroll 60s linear infinite;
}
.gr-track-reverse {
  animation-direction: reverse;
  animation-duration: 75s;
}
.gr-marquee:hover .gr-track {
  animation-play-state: paused;
}
@keyframes gr-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .gr-track { animation: none; }
}
@media (max-width: 600px) {
  .gr-card { width: 280px !important; }
}
`

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "#fff",
    paddingTop: "48px",
    paddingBottom: "48px",
    overflow: "hidden",
  },
  ratingBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    marginBottom: "32px",
  },
  ratingLabel: {
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "#333",
  },
  bigStars: {
    display: "flex",
    gap: "4px",
  },
  ratingCount: {
    fontSize: "0.9rem",
    color: "#666",
  },
  googleLogo: {
    marginTop: "4px",
  },
  rows: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  card: {
    width: "340px",
    flexShrink: 0,
    direction: "rtl" as const,
    background: "#fff",
    border: "1px solid #e8e8e8",
    borderRadius: "8px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  platformIcon: {
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  name: {
    fontSize: "0.88rem",
    fontWeight: 600,
    color: "#333",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  date: {
    fontSize: "0.78rem",
    color: "#999",
  },
  avatar: {
    borderRadius: "50%",
    flexShrink: 0,
  },
  stars: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },
  verified: {
    marginRight: "6px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: "#4285f4",
    color: "#fff",
    fontSize: "10px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewText: {
    fontSize: "0.88rem",
    color: "#444",
    lineHeight: 1.7,
    margin: 0,
    whiteSpace: "pre-line",
  },
  trustBadge: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "center",
  },
  trustText: {
    fontSize: "0.78rem",
    background: "#e8463a",
    color: "#fff",
    padding: "4px 14px",
    borderRadius: "4px",
    fontWeight: 500,
  },
  trustBrand: {
    fontWeight: 700,
  },
  trustInfo: {
    marginRight: "4px",
  },
}

export default GoogleReviews
