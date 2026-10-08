#!/usr/bin/env python3
"""
Import guides from the live sendmsg.co.il knowledge base into content/kb/.

The guides are WordPress/Elementor pages. Everything this script keeps comes
out of the one content container between the H1 and the "יש לך שאלה נוספת?"
contact block: the author, the body, and the tag list. The surrounding page
(nav, contact form, related-post cards, promo popup, footer) is furniture and
is dropped.

Screenshots are downloaded to static/kb-images/<slug>/ and referenced by
absolute path, so no image-processing plugin is needed and the paths resolve
the same in develop and in build.

Usage:
    python3 scripts/import-kb.py --list
    python3 scripts/import-kb.py --slug remail-sendmsg-connection
    python3 scripts/import-kb.py --all
    python3 scripts/import-kb.py --limit 3

Re-running is safe: a guide is re-fetched and overwritten in place.
"""

import argparse
import html as htmllib
import json
import os
import re
import subprocess
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KB_DATA = os.path.join(ROOT, "src", "data", "kb.ts")
OUT_MD = os.path.join(ROOT, "content", "kb")
OUT_IMG = os.path.join(ROOT, "static", "kb-images")

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36"

# Where the body stops. The live pages all close the article with this block.
BODY_END = "יש לך שאלה נוספת"


def fetch(url: str) -> str:
    out = subprocess.run(
        ["curl", "-sL", "--compressed", "-A", UA, url],
        capture_output=True, text=True,
    )
    return out.stdout


def fetch_binary(url: str, dest: str) -> bool:
    r = subprocess.run(
        ["curl", "-sL", "--compressed", "-A", UA, "-o", dest, "--write-out", "%{http_code}", url],
        capture_output=True, text=True,
    )
    ok = r.stdout.strip() == "200" and os.path.getsize(dest) > 0
    if not ok and os.path.exists(dest):
        os.remove(dest)
    return ok


def read_catalogue():
    """Parse src/data/kb.ts, which the crawler generated."""
    src = open(KB_DATA, encoding="utf-8").read()
    cats = {}
    for m in re.finditer(r'\{ id: "(c\d+)", label: "([^"]+)", slug: "([^"]+)" \}', src):
        cats[m.group(1)] = m.group(2)
    arts = []
    for m in re.finditer(r'\{ title: "((?:[^"\\]|\\.)*)", url: "([^"]+)", cats: \[([^\]]*)\] \}', src):
        ids = re.findall(r'"(c\d+)"', m.group(3))
        arts.append({
            "title": m.group(1).replace('\\"', '"'),
            "url": m.group(2),
            "cats": [cats[i] for i in ids if i in cats],
        })
    return arts


def slug_of(url: str) -> str:
    """A stable, filesystem-safe slug. Hebrew URLs stay Hebrew."""
    path = urllib.parse.urlparse(url).path.strip("/")
    return urllib.parse.unquote(path)


def strip_dead(s: str) -> str:
    """Drop what carries no article content. Iframes stay: older guides
    embed a YouTube walkthrough, and dropping it loses the guide."""
    return re.sub(r"(?is)<(script|style|noscript|svg)\b.*?</\1>", " ", s)


def widget_span(s: str, widget_type: str, start: int = 0):
    """Locate one Elementor widget by type, matching its closing </div>.

    Returns (inner_start, inner_end, outer_start, outer_end), or None.
    Needed because these widgets nest, so a regex to the next </div>
    truncates the body at the first inner element.
    """
    m = re.search(r'<div[^>]*data-widget_type="%s"[^>]*>' % re.escape(widget_type), s[start:])
    if not m:
        return None
    outer_start = start + m.start()
    inner_start = start + m.end()
    depth = 1
    for t in re.finditer(r"<(/?)div\b[^>]*>", s[inner_start:]):
        depth += -1 if t.group(1) else 1
        if depth == 0:
            return (inner_start, inner_start + t.start(), outer_start, inner_start + t.end())
    return None


def isolate_body(page: str, title: str):
    """The article body is its own widget.

    Taking `theme-post-content` rather than "everything after the H1"
    excludes the byline, the table of contents, the featured image and
    the tag list structurally, instead of trying to strip each of them
    back out of the text afterwards.
    """
    span = widget_span(page, "theme-post-content.default")
    if span:
        return page[span[0]:span[1]]

    # Fallback for a guide built without that widget.
    m = re.search(r"<h1[^>]*>.*?</h1>", page, re.S)
    if not m:
        return None
    end = page.find(BODY_END, m.end())
    return page[m.end():end if end != -1 else len(page)]


def take_author(page: str):
    span = widget_span(page, "post-info.default")
    if not span:
        return None
    txt = re.sub(r"<[^>]+>", " ", page[span[0]:span[1]])
    txt = htmllib.unescape(re.sub(r"[ \t\u00a0]+", " ", txt))
    m = re.search(r"מחבר המאמר:\s*([^|]{2,40}?)\s*$", txt.strip())
    return m.group(1).strip() if m else None


def take_tags(page: str):
    """The tag list sits in a heading widget after the body."""
    i = page.find("תגיות :")
    if i == -1:
        return []
    seg = page[i:i + 2500]
    seg = seg[:seg.find("</p>") if "</p>" in seg else len(seg)]
    tags = [htmllib.unescape(re.sub(r"<[^>]+>", "", t)).strip()
            for t in re.findall(r'<a[^>]*rel="tag"[^>]*>(.*?)</a>', seg, re.S)]
    return [t for t in tags if t][:12]


def take_featured(page: str):
    span = widget_span(page, "theme-post-featured-image.default")
    if not span:
        return None
    m = re.search(r'<img[^>]*src="([^"]+)"', page[span[0]:span[1]])
    return m.group(1) if m else None


def to_markdown(body: str, slug: str, img_map: dict) -> str:
    s = body

    # images first, before tags are stripped
    def img_sub(m):
        tag = m.group(0)
        src = re.search(r'src="([^"]+)"', tag)
        alt = re.search(r'alt="([^"]*)"', tag)
        if not src:
            return ""
        local = img_map.get(htmllib.unescape(src.group(1)))
        if not local:
            return ""
        return f"\n\n![{(alt.group(1) if alt else '').strip()}]({local})\n\n"

    s = re.sub(r"<img[^>]*>", img_sub, s)

    def frame_sub(m):
        src = re.search(r'src="([^"]+)"', m.group(0))
        if not src:
            return ""
        u = htmllib.unescape(src.group(1))
        if "youtube" in u or "youtu.be" in u or "vimeo" in u:
            return f"\n\n[צפייה בסרטון ההדרכה]({u})\n\n"
        return ""

    s = re.sub(r"(?is)<iframe[^>]*>.*?</iframe>|<iframe[^>]*/?>", frame_sub, s)

    s = re.sub(r"(?is)<(strong|b)[^>]*>(.*?)</\1>", lambda m: f"**{m.group(2).strip()}**", s)
    s = re.sub(r"(?is)<(em|i)[^>]*>(.*?)</\1>", lambda m: f"*{m.group(2).strip()}*", s)

    def a_sub(m):
        href = re.search(r'href="([^"]+)"', m.group(0))
        text = re.sub(r"<[^>]+>", "", m.group(2)).strip()
        if not text:
            return ""
        if not href:
            return text
        return f"[{text}]({href.group(1)})"

    s = re.sub(r"(?is)<a([^>]*)>(.*?)</a>", lambda m: a_sub(m), s)

    s = re.sub(r"(?is)<h2[^>]*>(.*?)</h2>", lambda m: "\n\n## " + re.sub(r"<[^>]+>", "", m.group(1)).strip() + "\n\n", s)
    s = re.sub(r"(?is)<h3[^>]*>(.*?)</h3>", lambda m: "\n\n### " + re.sub(r"<[^>]+>", "", m.group(1)).strip() + "\n\n", s)
    s = re.sub(r"(?is)<h4[^>]*>(.*?)</h4>", lambda m: "\n\n#### " + re.sub(r"<[^>]+>", "", m.group(1)).strip() + "\n\n", s)
    s = re.sub(r"(?is)<li[^>]*>(.*?)</li>", lambda m: "\n- " + re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(1))).strip(), s)
    s = re.sub(r"(?is)</p>|<br\s*/?>", "\n\n", s)

    s = re.sub(r"<[^>]+>", "", s)
    s = htmllib.unescape(s)

    # tidy whitespace without eating the markdown structure
    lines = []
    for raw in s.split("\n"):
        line = re.sub(r"[ \t ]+", " ", raw).strip()
        lines.append(line)
    s = "\n".join(lines)
    s = re.sub(r"\n{3,}", "\n\n", s).strip()
    return s


def yaml_quote(v: str) -> str:
    return '"' + v.replace("\\", "\\\\").replace('"', '\\"') + '"'


def import_one(art, verbose=True):
    slug = slug_of(art["url"])
    page = strip_dead(fetch(art["url"]))
    if not page or "<h1" not in page:
        print(f"  SKIP (no page): {art['title']}", file=sys.stderr)
        return None

    body = isolate_body(page, art["title"])
    if body is None:
        print(f"  SKIP (no body): {art['title']}", file=sys.stderr)
        return None

    author = take_author(page)
    tags = take_tags(page)
    featured = take_featured(page)

    # download the screenshots this guide actually uses
    # Guides are not consistent about where screenshots live: the newer
    # ones use /wp-content/uploads/ on sendmsg.co.il, the older ones
    # /uploads/images/ on comstar.co.il. Filtering on wp-content alone
    # silently produced guides with every screenshot missing.
    def wanted(u: str) -> bool:
        return u.startswith("http") and re.search(
            r"(sendmsg\.co\.il|comstar\.co\.il)/.*\.(png|jpe?g|webp|gif)",
            u, re.I,
        ) is not None

    srcs = []
    if featured and wanted(featured):
        srcs.append(featured)
    for m in re.finditer(r'<img[^>]*?src="([^"]+)"', body):
        u = htmllib.unescape(m.group(1))
        if wanted(u) and u not in srcs:
            srcs.append(u)

    img_dir = os.path.join(OUT_IMG, slug)
    img_map = {}
    if srcs:
        os.makedirs(img_dir, exist_ok=True)
    # Numbered by position, not named after the source file. The older
    # guides name screenshots in Hebrew, and stripping those to ASCII
    # collapses every one of them to the same "-------.png", so four
    # different screenshots silently overwrote each other.
    for i, u in enumerate(srcs, 1):
        ext = os.path.splitext(urllib.parse.urlparse(u).path)[1].lower()
        if ext not in (".png", ".jpg", ".jpeg", ".webp", ".gif"):
            ext = ".png"
        name = ("cover" if u == featured else f"{i:02d}") + ext
        dest = os.path.join(img_dir, name)
        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            img_map[u] = f"/kb-images/{urllib.parse.quote(slug)}/{name}"
            continue
        if fetch_binary(u, dest):
            img_map[u] = f"/kb-images/{urllib.parse.quote(slug)}/{name}"

    md = to_markdown(body, slug, img_map)
    if len(md) < 120:
        print(f"  SKIP (body too short, {len(md)} chars): {art['title']}", file=sys.stderr)
        return None

    fm = [
        "---",
        f"title: {yaml_quote(art['title'])}",
        f"slug: {yaml_quote(slug)}",
        f"source: {yaml_quote(art['url'])}",
        "categories:",
    ]
    for c in art["cats"]:
        fm.append(f"  - {yaml_quote(c)}")
    if featured and img_map.get(featured):
        fm.append(f"featuredImage: {yaml_quote(img_map[featured])}")
    if tags:
        fm.append("tags:")
        for t in tags:
            fm.append(f"  - {yaml_quote(t)}")
    if author:
        fm.append(f"author: {yaml_quote(author)}")
    fm.append("---")

    os.makedirs(OUT_MD, exist_ok=True)
    fname = re.sub(r"[^A-Za-z0-9֐-׿._-]", "-", slug) + ".md"
    out = os.path.join(OUT_MD, fname)
    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(fm) + "\n\n" + md + "\n")

    if verbose:
        print(f"  {art['title'][:46]:48} {len(md):6} chars  {len(img_map)} imgs  -> {fname}")
    return {"slug": slug, "file": fname, "images": len(img_map), "chars": len(md)}



def first_paragraph(md: str) -> str:
    """The guide's own opening sentence, for the index and for search.

    Headings, images and list items are skipped: the first prose line is
    what actually tells a reader whether this is the guide they want.
    """
    for line in md.split("\n"):
        line = line.strip()
        if not line or line.startswith(("#", "!", "-", "*", ">", "|")):
            continue
        if re.match(r"^\d+[.)]\s", line):
            continue
        text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", line)
        text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
        text = re.sub(r"[*_`]", "", text).strip()
        if len(text) < 40:
            continue
        if len(text) > 190:
            cut = text.rfind(" ", 0, 190)
            text = text[: cut if cut > 120 else 190].rstrip(" ,.;:-") + "…"
        return text
    return ""


def add_excerpts(verbose=True):
    """Backfill `excerpt` into guides already on disk, without refetching."""
    n = 0
    for name in sorted(os.listdir(OUT_MD)):
        if not name.endswith(".md"):
            continue
        path = os.path.join(OUT_MD, name)
        text = open(path, encoding="utf-8").read()
        parts = text.split("---\n", 2)
        if len(parts) < 3:
            continue
        fm, body = parts[1], parts[2]
        ex = first_paragraph(body)
        fm = re.sub(r"^excerpt: .*\n", "", fm, flags=re.M)
        if ex:
            fm = fm.rstrip("\n") + "\nexcerpt: " + yaml_quote(ex) + "\n"
            n += 1
        open(path, "w", encoding="utf-8").write("---\n" + fm + "---\n" + body)
    if verbose:
        print(f"excerpts written for {n} guides")
    return n


# ── relinking ───────────────────────────────────────────────────
# The guides link to each other, and to the marketing pages, by
# absolute sendmsg.co.il URL. Imported as-is, every guide sends the
# reader back out to the old WordPress site, which undoes most of the
# point of having them here. This pass runs at the end of an import so
# a re-import cannot quietly restore the outbound links.

# Live path -> the page that replaced it in this repo.
SERVICE_PAGES = {
    "": "/",
    "newsletters": "/newsletters/",
    "landingpages": "/landing-pages/",
    "digitalcourses": "/digital-courses/",
    "virtualnumber": "/virtual-number/",
    "crm": "/crm/",
    "meetings": "/meetings/",
    "contact": "/contact/",
    "support": "/support/",
    "about": "/about/",
    "terms": "/terms/",
    "privacy": "/privacy/",
    "accessibility": "/accessibility/",
    "affiliate": "/affiliate/",
    "api": "/api/",
    "kb": "/kb/",
    "services": "/services/",
    "shomer-shabbat": "/shomer-shabbat/",
    "pricelist": "/pricing/",
    "pricelist/packages": "/pricing/",
    "pricelist/smsbank": "/sms-bank/",
    "pricelist/emailbank": "/email-bank/",
    "שליחת-סמסים": "/sms/",
    "דומיין-פרטי": "/domain/",
}


def norm_path(url: str) -> str:
    """Decoded, lowercased, slash-trimmed path — the only reliable key.

    The guides are inconsistent about percent-encoding case, so comparing
    raw URLs matches barely half of the links that should match.
    """
    return urllib.parse.unquote(urllib.parse.urlparse(url).path).strip("/").lower()


def guide_map():
    """source path -> local /kb/<slug>/ for everything imported so far."""
    out = {}
    if not os.path.isdir(OUT_MD):
        return out
    for name in os.listdir(OUT_MD):
        if not name.endswith(".md"):
            continue
        text = open(os.path.join(OUT_MD, name), encoding="utf-8").read()
        src = re.search(r'^source: "([^"]+)"', text, re.M)
        slug = re.search(r'^slug: "([^"]+)"', text, re.M)
        if src and slug:
            out[norm_path(src.group(1))] = "/kb/" + urllib.parse.quote(slug.group(1)) + "/"
    return out


def relink_all(verbose=True):
    guides = guide_map()
    changed = 0
    rewritten = 0
    left = {}

    for name in sorted(os.listdir(OUT_MD)):
        if not name.endswith(".md"):
            continue
        path = os.path.join(OUT_MD, name)
        text = open(path, encoding="utf-8").read()
        before = text

        def sub(m):
            nonlocal rewritten
            url = m.group(1)
            key = norm_path(url)
            dest = guides.get(key) or SERVICE_PAGES.get(key)
            if dest:
                rewritten += 1
                return "](" + dest + ")"
            left[key] = left.get(key, 0) + 1
            return m.group(0)

        text = re.sub(r"\]\((https://(?:www\.)?sendmsg\.co\.il[^)]*)\)", sub, text)

        if text != before:
            open(path, "w", encoding="utf-8").write(text)
            changed += 1

    if verbose:
        print(f"relinked {rewritten} links across {changed} guides")
        if left:
            print("left pointing off-site (no local equivalent):")
            for k, n in sorted(left.items(), key=lambda x: -x[1]):
                print(f"  {n:3}  /{k}/")
    return rewritten


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--slug")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--limit", type=int)
    ap.add_argument("--excerpts", action="store_true",
                    help="only backfill excerpts, do not fetch")
    ap.add_argument("--relink", action="store_true",
                    help="only rewrite links in content/kb, do not fetch")
    args = ap.parse_args()

    if args.relink:
        relink_all()
        return

    if args.excerpts:
        add_excerpts()
        return

    arts = read_catalogue()

    if args.list:
        for a in arts:
            print(f"{slug_of(a['url'])[:60]:62} {a['title'][:40]}")
        print(f"\n{len(arts)} guides")
        return

    if args.slug:
        targets = [a for a in arts if slug_of(a["url"]) == args.slug or args.slug in a["url"]]
    elif args.all:
        targets = arts
    elif args.limit:
        targets = arts[: args.limit]
    else:
        ap.error("pass --list, --slug, --limit or --all")

    print(f"importing {len(targets)} guide(s)")
    done = [import_one(a) for a in targets]
    ok = [d for d in done if d]
    print(f"\n{len(ok)}/{len(targets)} imported, {sum(d['images'] for d in ok)} images")
    print()
    relink_all()
    add_excerpts()


if __name__ == "__main__":
    main()
