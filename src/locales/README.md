# Site text

All visible text on the site lives here, as JSON. Code doesn't contain Hebrew,
apart from:
- the legal and KB data files in `src/data/`
- the regex in `components/ai/renderRtl.tsx`
- the Hebcal parsing in `components/AILaunchpad.tsx`
- the author-name keys in `pages/blog.tsx`, which match the posts' frontmatter
- the untranslated `/api` docs
- code comments

## Changing wording

Find the text: `grep -rn "some words" src/locales/he/`. Edit the JSON. That's it.

- `\n` is a line break.
- `<strong>…</strong>` is bold, `<ltr>₪40</ltr>` keeps a price or number
  left-to-right inside a Hebrew sentence, and `<a href="/pricing/">…</a>` is a
  link, but only in strings a component renders with `<Rich>`. Internal links start with
  `/` and stay inside the current language automatically. No other HTML works;
  it shows up as literal text.
- `{name}` is a value filled in by code: a number, a price or a link. Keep the
  braces and the name, but move it wherever the sentence needs it.
- Don't change `href`, `icon`, `id` or `to` fields unless you mean to change the
  link or the icon.
- Lists of items (features, FAQs, logos' alt text) are in the same order as
  the icons or images in the component. Add or remove an item in both places.

## Where things are

- `he/<component>.json`: one per component in `src/components`, in kebab case.
- `he/pages/<page>.json`: one per page in `src/pages`, including its `seo` title
  and description.
- `he/templates/<template>.json`: the guide and blog-post templates.
- `he/common.json`: site-wide SEO strings (used by `SEO.tsx`).
- Guides and blog posts are markdown in `content/kb/he/` and `content/blog/he/`.

## How a file gets its text

Each component, page and template imports its own JSON, so the text ships in
the same JavaScript chunk as the code that shows it:

```tsx
import heText from "../locales/he/pages/about.json"

const TEXT = { he: heText }

const AboutPage = () => {
  const t = useText(TEXT)   // picks the current page's language
  ...
}
```

A page's `Head` can't use hooks, so it reads `TEXT[pageContext.locale]`.

## Adding a new string

1. Add the key to the file's `he/…json`.
2. Use it:
   - `{t.key}` for plain text
   - `<Rich text={t.key} />` for text with `\n`, `<strong>`, `<ltr>` or links;
     pass `ltrClass="xx-ltr"` to style `<ltr>` runs (prices, numbers, Latin
     words inside a Hebrew sentence)
   - `formatText(t.key, { n })` for text with `{placeholders}`
   - `<Fmt text={t.key} vars={{ n: <Counter … /> }} />` when a placeholder is
     an element
3. Internal links: `<LocalizedLink to="/x/">`, or `const lp = useLocalePath()`
   and `href={lp("/x/")}` on a plain `<a>`.
4. A new component with text: create `he/<name>.json` and add the
   `heText` import and the `TEXT` line shown above.

## Adding a language (e.g. English)

1. `node scripts/add-locale.mjs en ltr English`. This copies `he/` to `en/`,
   adds the `en` import and `TEXT` entry to every file, and registers `en` in
   `config.ts` with `enabled: false`.
2. Translate the values in `src/locales/en/`. The keys, the list lengths and
   the `{placeholders}` stay the same.
3. Run `npm run verify`.
   - Typecheck fails on a file with no `en` entry or a missing key.
   - `tests/locale-shape` fails on a list with a different length or a
     placeholder that doesn't match. Lists are matched to icons and images by
     position, so a shorter list would break a page.
4. Articles go in `content/kb/en/` and `content/blog/en/`.
5. Set `enabled: true` in `config.ts`. Pages appear at `/en/...`, Hebrew URLs
   don't change, and `/api/` stays a single page. hreflang links appear only
   between pages that exist in both languages. Articles get none until they
   are translated.

After disabling or removing a language, run `npx gatsby clean` before the next
local build. Gatsby's cache keeps the old `/<code>/` pages, and they fail to
render once their text is gone. CI always builds from a clean checkout.

Before shipping a language:
- Inline styles still say `textAlign: "right"`, `marginLeft` and similar.
  Convert them to logical properties (`start`, `marginInlineStart`) for LTR.
- Number and date formatting still uses `"he-IL"` in a few components
  (pricing, banks, AILaunchpad).
- AILaunchpad shows holiday names from Hebcal's Hebrew field (`item.hebrew`);
  English would read `item.title`.
- An unknown `/en/...` URL shows the Hebrew 404 page: GitHub Pages serves only
  the root `404.html`.
- Add the language switcher to the Header.

## Proving a text move changed nothing

    npx gatsby build --prefix-paths
    node scripts/site-text.mjs snapshot before.json   # on the old code
    node scripts/site-text.mjs snapshot after.json    # on the new code
    node scripts/site-text.mjs compare before.json after.json
