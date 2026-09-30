import React, { useCallback, useEffect, useRef, useState } from "react"

/**
 * A horizontally scrollable box for content that has a floor width: field
 * tables, mostly, where squeezing three columns into a phone leaves the
 * description column too narrow to read.
 *
 * Two things here are easy to get wrong and both are about people who are not
 * using a mouse:
 *
 * A scrollable box has to be reachable from the keyboard, or its overflow is
 * unreachable without a pointer. That means tabindex. But a permanent tab stop
 * on a box that fits its content is a stop that does nothing, and this page has
 * thirty-odd tables, so it measures first and only takes focus while there is
 * actually something to scroll to.
 *
 * The fades mark the edges that continue. They are driven by scroll position
 * rather than shown permanently, so a table scrolled to its end stops
 * advertising more content that is not there.
 */

const ScrollArea: React.FC<{
  children: React.ReactNode
  label: string
  className?: string
}> = ({ children, label, className }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [scrollable, setScrollable] = useState(false)
  const [edges, setEdges] = useState({ start: false, end: false })

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    // A sub-pixel slack: layout rounding otherwise reports a box as scrollable
    // by a fraction of a pixel and leaves a fade hanging over a full table.
    const overflow = el.scrollWidth - el.clientWidth
    const can = overflow > 1
    setScrollable(can)
    setEdges({
      start: can && el.scrollLeft > 1,
      end: can && el.scrollLeft < overflow - 1,
    })
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    measure()

    // Fonts land after first paint and change every column width, so the first
    // measurement is taken again once they are ready.
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(measure).catch(() => {})
    }

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    // The row is what changes width when a variant switches the columns.
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => observer.disconnect()
  }, [measure])

  return (
    <div
      ref={ref}
      onScroll={measure}
      className={[
        "doc-scroll",
        scrollable ? "is-scrollable" : "",
        edges.start ? "at-start" : "",
        edges.end ? "at-end" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      // Only a box with hidden content earns a tab stop and a name.
      {...(scrollable
        ? { tabIndex: 0, role: "region", "aria-label": `${label} (scrollable)` }
        : {})}
    >
      {children}
    </div>
  )
}

export default ScrollArea
