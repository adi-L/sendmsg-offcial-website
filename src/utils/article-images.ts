import { withPrefix } from "gatsby"

/**
 * The imported guides and articles are markdown, and their screenshots are
 * plain files under static/ rather than nodes in the image pipeline -- there
 * is no gatsby-remark-images in this project, on purpose. So the <img> tags
 * arrive from remark bare: no prefix, no dimensions, no loading hint.
 *
 * That costs the reader three ways on a guide carrying 29 screenshots:
 * every one is fetched before the first is read, each arrival reflows the
 * article under the cursor, and the src is absolute so it 404s under the
 * deploy's pathPrefix. This puts all three right on the way out.
 *
 * Dimensions cannot be measured here -- the browser bundle has no access to
 * the files -- so gatsby-node measures them at build time and hands them
 * over in page context. An image missing from the map still gets the loading
 * hints; it just keeps reserving no space.
 */
export type ImageSizes = Record<string, [number, number]>

const ATTR = (tag: string, name: string) =>
  new RegExp(`\\s${name}=`, "i").test(tag)

export const prepareArticleImages = (
  html: string,
  dir: "kb-images" | "blog-images",
  sizes: ImageSizes = {}
): string =>
  html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = /\ssrc="([^"]*)"/i.exec(tag)?.[1]
    const extra: string[] = []

    /* Reserving the right box is what stops the reflow, so it has to come
       from the real file rather than a guess. */
    const size = src ? sizes[src] : undefined
    if (size && !ATTR(tag, "width") && !ATTR(tag, "height")) {
      extra.push(`width="${size[0]}"`, `height="${size[1]}"`)
    }

    /* A guide is read top to bottom with the product open alongside, so a
       screenshot eight steps down has no claim on the first paint. */
    if (!ATTR(tag, "loading")) extra.push('loading="lazy"')
    if (!ATTR(tag, "decoding")) extra.push('decoding="async"')

    let out = extra.length
      ? tag.replace(/\s*\/?>$/, ` ${extra.join(" ")}$&`).replace(/\s+(\/?>)$/, "$1")
      : tag

    if (src?.startsWith(`/${dir}/`)) {
      out = out.replace(
        new RegExp(`(src|srcset)="/${dir}/`, "g"),
        `$1="${withPrefix(`/${dir}/`)}`
      )
    }

    return out
  })

/**
 * Every static image an article's HTML asks for, as written in the markup.
 * gatsby-node measures these; the keys are the raw srcs so the template can
 * look them up without re-deriving anything.
 */
export const articleImageSrcs = (html: string, dir: string): string[] => {
  const found = new Set<string>()
  for (const m of html.matchAll(/<img\b[^>]*\ssrc="([^"]*)"/gi)) {
    if (m[1].startsWith(`/${dir}/`)) found.add(m[1])
  }
  return [...found]
}
