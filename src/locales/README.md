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
- `<strong>…</strong>` is bold and `<a href="/pricing/">…</a>` is a link, but
  only in strings a component renders with `<Rich>`. Internal links start with
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
- `he/common.json`: site-wide SEO strings.
- Guides and blog posts are markdown in `content/kb/he/` and `content/blog/he/`.

## Adding a new string

1. Add the key to the right `he/…json`.
2. In the component: `const t = useT("<namespace>")`, then one of:
   - `{t.key}` for plain text
   - `<Rich text={t.key} />` for text with `\n`, `<strong>` or links
   - `formatText(t.key, { n })` for text with `{placeholders}`
   - `<Fmt text={t.key} vars={{ price: <Ltr>₪40</Ltr> }} />` when a
     placeholder is an element
3. Internal links: `<LocalizedLink to="/x/">`, or `const lp = useLocalePath()`
   and `href={lp("/x/")}` on a plain `<a>`.
4. A page's `Head` can't use hooks:
   `const t = getT(pageContext.locale, "pages/x")`.
5. A new JSON file also needs one import and one key in `messages.ts`, kept
   alphabetical.

## Adding a language (e.g. English)

1. `cp -r src/locales/he src/locales/en` and translate the values. The keys
   stay the same.
2. `config.ts`: add `en: { dir: "ltr", label: "English", enabled: true }`.
3. `messages.ts`: import the `en/` files, build `const en: Messages = {...}` and
   add it to `messages`. `npm run typecheck` fails until every key exists.
4. Articles go in `content/kb/en/` and `content/blog/en/`.
5. Pages appear at `/en/...`. Hebrew URLs don't change, and `/api/` stays a
   single page.

After disabling or removing a language, run `npx gatsby clean` before the next
local build. Gatsby's cache keeps the old `/<code>/` pages, and they fail to
render once their text is gone. CI always builds from a clean checkout.

Before shipping a language:
- Inline styles still say `textAlign: "right"`, `marginLeft` and similar.
  Convert them to logical properties (`start`, `marginInlineStart`) for LTR.
- Number and date formatting still uses `"he-IL"` in a few components
  (pricing, banks, AILaunchpad).
- Add the language switcher to the Header.

## Proving a text move changed nothing

    npx gatsby build --prefix-paths
    node scripts/site-text.mjs snapshot before.json   # on the old code
    node scripts/site-text.mjs snapshot after.json    # on the new code
    node scripts/site-text.mjs compare before.json after.json
