/* ── 301s from the old WordPress site ─────────────────────────────
   Every URL the old www.sendmsg.co.il exposed has to land somewhere on
   this site with a single 301, or its rankings and inbound links are
   lost. The list of those URLs is src/data/old-site-urls.txt (the old
   sitemaps, plus addresses that only Search Console and the launch audit
   knew about); tests/redirects.test.mjs fails if any of them resolves to
   nothing.

   Three sources, in this order:
   1. Articles and guides: each imported markdown file records its old
      address in `source:`, so those redirects write themselves and a newly
      imported article can never be forgotten.
   2. ALIASES: old addresses the markdown does not record, because the
      article was imported under a different slug or written by hand.
   3. PAGES: the product and company pages that moved, and the WordPress
      archives (categories, drafts) that have no page of their own here.

   Anything under GONE answers 410: WordPress machinery with no content
   behind it. A 410 tells Google to drop the URL at once, where a redirect
   to an unrelated page would be treated as a soft 404 anyway.

   Self-contained (no imports) so the tests can load it directly. */

/* Old path -> new path, both decoded, both with a trailing slash. */
export const PAGES: Record<string, string> = {
  "/he/": "/",
  "/newsletters/": "/newsletters/",
  "/landingpages/": "/landing-pages/",
  "/digitalcourses/": "/digital-courses/",
  "/onlinecourses/": "/digital-courses/",
  "/virtualnumber/": "/virtual-number/",
  "/pricelist/": "/pricing/",
  "/pricelist/packages/": "/pricing/",
  "/packages/": "/pricing/",
  "/pricelist/smsbank/": "/sms-bank/",
  "/smsbank/": "/sms-bank/",
  "/pricelist/emailbank/": "/email-bank/",
  "/emailbank/": "/email-bank/",
  "/שליחת-סמסים/": "/sms/",
  "/דומיין-פרטי/": "/domain/",
  "/team/": "/about/",
  // online meetings, the old name of the meetings module
  "/bizclub/": "/meetings/",
  // "who is it for": an audience index and seven audience pages, which
  // this site folds into the about page
  "/about/who-is-it-for/": "/about/",
  "/about/who-is-it-for/ecommerce/": "/about/",
  "/about/who-is-it-for/public-institutions/": "/about/",
  "/about/who-is-it-for/small-businesses/": "/about/",
  "/about/who-is-it-for/marketers/": "/about/",
  "/about/who-is-it-for/non-profits/": "/about/",
  "/about/who-is-it-for/ai-professionals/": "/about/",
  "/about/who-is-it-for/large-organizations/": "/about/",
  // pages that were never meant to be public, but were in the sitemap
  "/no-access/": "/",
  "/new-inner-page-draft/": "/",
  "/new_homepage_draft/": "/",
  "/default.aspx/": "/",
  // WordPress category archives: the blog's, and the guides' ten
  "/category/blog/": "/blog/",
  "/category/דומיינים/": "/kb/",
  "/category/מרכז-מידע-צעדים-ראשונים/": "/kb/",
  "/category/מרכז-מידע-חיבור-למערכות-חיצוניות/": "/kb/",
  "/category/מרכז-מידע-חיבור-למערכות-חיצוניות/מרכז-מידע-חיבור-לסליקה/": "/kb/",
  "/category/מרכז-מידע-מנויים-קבוצות-דיוור/": "/kb/",
  "/category/מרכז-מידע-ניוזלטרים-וקמפיינים/": "/kb/",
  "/category/מרכז-מידע-מסרונים/": "/kb/",
  "/category/מרכז-מידע-דפי-נחיתה/": "/kb/",
  "/category/מרכז-מידע-קורסים-דיגיטליים/": "/kb/",
  "/category/מרכז-מידע-אוטומציות/": "/kb/",
  "/category/מרכז-מידע-מגזר-חרדי/": "/kb/",
  "/category/מרכז-מידע-אפשרויות-מתקדמות/": "/kb/",
}

/* Articles whose old address their markdown does not carry. */
export const ALIASES: Record<string, string> = {
  "/improve-email-open-rates/": "/blog/שיפור-אחוזי-פתיחת-מיילים/",
  "/כל-כמה-זמן-לשלוח-דיוור-ללקוחות/": "/blog/email-frequency/",
  "/5_rules_campaign/": "/blog/5-rules-campaign/",
  "/digital-course-guide/": "/blog/digital-course-guide/",
  "/gmail-vs-private-domain-email-marketing/":
    "/blog/שליחת-מיילים-מ-gmail-או-מדומיין-פרטי-אילו-אפ/",
}

/* Path prefixes that answer 410 Gone. */
export const GONE: readonly string[] = [
  "/wp-admin",
  "/wp-login.php",
  "/wp-content/",
  "/wp-includes/",
  "/wp-json",
  "/xmlrpc.php",
  "/feed/",
  "/comments/feed/",
]

/* The old affiliate links: /minisite/?affiliate=<id> went to /he/?sid=<id>,
   and the signup form reads `sid` from the page it is on. */
export const AFFILIATE = { from: "/minisite/", param: "affiliate", to: "/", as: "sid" }

export type Article = { source: string; route: string }

/** Decoded, with exactly one leading and one trailing slash. */
export const normalise = (pathOrUrl: string): string => {
  let p = pathOrUrl.replace(/^https?:\/\/[^/]+/i, "").split(/[?#]/)[0]
  try {
    p = decodeURIComponent(p)
  } catch {
    // a malformed escape: compare it as written
  }
  p = "/" + p.replace(/^\/+|\/+$/g, "")
  return p === "/" ? "/" : `${p}/`
}

/** Every old -> new pair, sorted, with same-path pairs left out (a page
    that kept its address needs no redirect, only to exist). */
export const redirectPairs = (articles: readonly Article[]): [string, string][] => {
  const map = new Map<string, string>()
  for (const a of articles) map.set(normalise(a.source), normalise(a.route))
  for (const [from, to] of Object.entries(ALIASES)) map.set(normalise(from), normalise(to))
  for (const [from, to] of Object.entries(PAGES)) map.set(normalise(from), normalise(to))
  return [...map]
    .filter(([from, to]) => from !== to)
    .sort(([a], [b]) => a.localeCompare(b))
}

export type Resolution =
  | { kind: "redirect"; to: string }
  | { kind: "same" }
  | { kind: "gone" }
  | { kind: "missing" }

/** What one old URL becomes, given the redirects and the new site's pages. */
export const resolveOld = (
  oldUrl: string,
  pairs: ReadonlyMap<string, string>,
  pages: ReadonlySet<string>
): Resolution => {
  const p = normalise(oldUrl)
  if (GONE.some((g) => p.startsWith(g))) return { kind: "gone" }
  if (p === AFFILIATE.from) return { kind: "redirect", to: AFFILIATE.to }
  const to = pairs.get(p)
  if (to) return { kind: "redirect", to }
  if (pages.has(p)) return { kind: "same" }
  return { kind: "missing" }
}

/* ── server formats ─────────────────────────────────────────────
   nginx and Apache both match on the decoded path, so the keys are
   written in Hebrew as-is; the targets are percent-encoded because they
   go back out in a Location header. Each old path is listed with and
   without its trailing slash, so a link that dropped it still lands in
   one hop. */

const encodePath = (p: string) => p.split("/").map(encodeURIComponent).join("/")
const both = (p: string) => (p === "/" ? [p] : [p, p.slice(0, -1)])
const nginxQuote = (s: string) => `"${s.replace(/(["\\$])/g, "\\$1")}"`
const regexEscape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export const toNginx = (pairs: readonly [string, string][], siteUrl: string): string =>
  [
    "# Generated by the build (src/data/redirects.ts). Do not edit by hand.",
    "#",
    "# In the http {} block:",
    "",
    "# the Hebrew keys run to 300+ bytes once encoded; at nginx's default (64)",
    "# the map does not build and nginx refuses to start. If the http block",
    "# already sets this, keep the larger of the two and drop this line.",
    "map_hash_bucket_size 256;",
    "",
    "map $uri $sendmsg_redirect {",
    "    default \"\";",
    ...pairs.flatMap(([from, to]) =>
      both(from).map((f) => `    ${nginxQuote(f)} ${nginxQuote(encodePath(to))};`)
    ),
    "}",
    "",
    "# In EVERY server {} block that answers for the domain: the https one, and",
    "# the http and other-host ones too, BEFORE their catch-all redirect to",
    `# ${siteUrl}. Checked only after that redirect, an old link reached`,
    "# over http or the other host would take two hops.",
    "#",
    "#   if ($sendmsg_redirect) {",
    `#       return 301 ${siteUrl}$sendmsg_redirect$is_args$args;`,
    "#   }",
    `#   location ~ ^${regexEscape(AFFILIATE.from.slice(0, -1))}/?$ {`,
    `#       if ($arg_${AFFILIATE.param}) { return 301 ${siteUrl}${AFFILIATE.to}?${AFFILIATE.as}=$arg_${AFFILIATE.param}; }`,
    `#       return 301 ${siteUrl}${AFFILIATE.to};`,
    "#   }",
    `#   location ~ ^(${GONE.map(regexEscape).join("|")}) { return 410; }`,
    "",
  ].join("\n")

export const toApache = (pairs: readonly [string, string][], siteUrl: string): string => {
  const host = siteUrl.replace(/^https?:\/\//, "")
  // the same site on the other side of www
  const other = host.startsWith("www.") ? host.slice(4) : `www.${host}`
  return [
    "# Generated by the build (src/data/redirects.ts). Do not edit by hand.",
    "RewriteEngine On",
    "",
    "# Old addresses first, from any host and scheme, so an old link reached",
    "# over http or the other host still lands in one hop, not two.",
    "",
    "# old affiliate links",
    `RewriteCond %{QUERY_STRING} (?:^|&)${AFFILIATE.param}=([^&]+)`,
    `RewriteRule ^${regexEscape(AFFILIATE.from.slice(1))}?$ ${siteUrl}${AFFILIATE.to}?${AFFILIATE.as}=%1 [R=301,L,NE]`,
    `RewriteRule ^${regexEscape(AFFILIATE.from.slice(1))}?$ ${siteUrl}${AFFILIATE.to} [R=301,L]`,
    "",
    "# WordPress machinery: gone",
    `RewriteRule ^(?:${GONE.map((g) => regexEscape(g.slice(1))).join("|")}) - [G,L]`,
    "",
    "# old pages and articles",
    ...pairs.map(
      ([from, to]) =>
        // "%" escaped: in a substitution %1-%9 are back-references, so the
        // Hebrew "%D7%9E" would come out as "%D7E" (found on a real Apache)
        `RewriteRule ^${regexEscape(from.slice(1, -1))}/?$ ${siteUrl}${encodePath(to).replace(/%/g, "\\%")} [R=301,L,NE]`
    ),
    "",
    `# everything else: one hop to https://${host}, from ${other} and from http.`,
    "# Only for the real domain, so a staging copy can be tested as it is.",
    `RewriteCond %{HTTP_HOST} ^${regexEscape(other)}$ [NC,OR]`,
    `RewriteCond %{HTTP_HOST}#%{HTTPS} ^${regexEscape(host)}#off$ [NC]`,
    `RewriteRule ^(.*)$ ${siteUrl}/$1 [R=301,L,NE]`,
    "",
  ].join("\n")
}

export const toCsv = (pairs: readonly [string, string][], siteUrl: string): string =>
  [
    "old_url,new_url",
    ...pairs.map(
      ([from, to]) => `https://www.sendmsg.co.il${encodePath(from)},${siteUrl}${encodePath(to)}`
    ),
    "",
  ].join("\n")
