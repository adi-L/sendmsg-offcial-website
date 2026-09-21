import React from "react"

type Props = {
  label?: string
  ratio?: string
  kind?: "video" | "image"
}

/** Grey placeholder block. Swap with a real <video> or <img> when the asset is ready. */
const MediaPlaceholder: React.FC<Props> = ({
  label = "וידאו או תמונה יתווספו כאן",
  ratio = "16 / 9",
  kind = "video",
}) => (
  <div
    className="media-placeholder"
    style={{ aspectRatio: ratio }}
    aria-label={label}
  >
    {kind === "video" ? (
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10,8 16,12 10,16" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21,15 16,10 5,21" />
      </svg>
    )}
    <span>{label}</span>
  </div>
)

export default MediaPlaceholder
