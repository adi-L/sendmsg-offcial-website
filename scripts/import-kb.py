#!/usr/bin/env python3
"""
Import content from the live sendmsg.co.il WordPress site.

Two collections, same extraction:
  guides   -> content/kb/    + static/kb-images/     (--all, --slug, --limit)
  articles -> content/blog/  + static/blog-images/   (--articles)

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
import io
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

BLOG_MD = os.path.join(ROOT, "content", "blog")
BLOG_IMG = os.path.join(ROOT, "static", "blog-images")
BLOG_CATEGORY = "מאמרים מקצועיים"

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


def cf_decode(hex_str: str) -> str:
    """Undo Cloudflare's email obfuscation.

    Cloudflare rewrites every mailto: on the live site into
    /cdn-cgi/l/email-protection#<hex>, and the address text into a
    <span class="__cf_email__" data-cfemail="<hex>"> whose visible text stays
    the placeholder "[email protected]" until their JS runs. A scraper sees the
    placeholder, so the address has to come out of the hex: the first byte is
    the XOR key for the rest."""
    try:
        b = bytes.fromhex(hex_str)
    except ValueError:
        return ""
    if len(b) < 2:
        return ""
    key = b[0]
    return bytes(c ^ key for c in b[1:]).decode("utf-8", "replace")


def undo_cf_email(s: str) -> str:
    """Put the real addresses back, before any tag stripping happens."""
    s = re.sub(
        r'(?is)<span[^>]*class="[^"]*__cf_email__[^"]*"[^>]*'
        r'data-cfemail="([0-9a-fA-F]+)"[^>]*>.*?</span>',
        lambda m: cf_decode(m.group(1)) or "", s)

    # an anchor pointing at the obfuscator: the address is either in the href
    # fragment, or in the span we just decoded into the link text
    def anchor(m):
        attrs, text = m.group(1), m.group(2)
        # the hex sits either in the href fragment or in data-cfemail on the
        # anchor itself — Cloudflare uses both shapes on the same site
        frag = (re.search(r"email-protection#([0-9a-fA-F]+)", attrs)
                or re.search(r'data-cfemail="([0-9a-fA-F]+)"', attrs))
        addr = cf_decode(frag.group(1)) if frag else ""
        if not addr:
            bare = re.sub(r"<[^>]+>", "", text).strip()
            addr = bare if re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", bare) else ""
        if not addr:
            return text
        # "[email protected]" is Cloudflare's placeholder standing in for the
        # address until their JS runs; any other link text is the real thing
        # and has to survive (one article links the word "שלחו לנו הודעה" at a
        # mailto: carrying a subject line).
        plain = htmllib.unescape(re.sub(r"<[^>]+>", "", text))
        if re.fullmatch(r"\s*\[email\s*protected\]\s*", plain):
            text = addr
        return '<a href="mailto:' + addr + '">' + text + "</a>"

    return re.sub(r"(?is)<a([^>]*email-protection[^>]*)>(.*?)</a>", anchor, s)


# A cell or paragraph whose whole content is escaped markup is a code sample
# the guide means you to copy, not markup to render. The PayPal guide says so
# in as many words ("קוד הניתן להעתקה") and the live page escapes it inside a
# table cell; unescaping that into the page output both breaks the sample and
# emits a live PayPal button.
CODEY = re.compile(r"(?is)<(td|p)\b[^>]*>(.*?)</\1>")


def fence_escaped_code(s: str, stash: list) -> str:
    def one(m):
        inner = re.sub(r"(?i)<br\s*/?>", "\n", m.group(2))
        inner = htmllib.unescape(re.sub(r"<[^>]+>", "", inner)).strip()
        inner = "\n".join(ln.strip() for ln in inner.split("\n"))
        if not inner.startswith("<") or ">" not in inner:
            return m.group(0)
        if not re.match(r"<[a-zA-Z/!][^>]*>", inner):
            return m.group(0)
        stash.append(inner)
        return "\n\n\x01CODE" + str(len(stash) - 1) + "\x01\n\n"

    return CODEY.sub(one, s)


# Typos in the live copy, corrected on the way in so a re-import cannot
# restore them. Keep this list short and only for things that are wrong on
# sendmsg.co.il by their own account — each entry should be justifiable by
# another sentence on the same page. Report them to the user; do not use this
# to rewrite copy you merely prefer.
LIVE_TYPOS = [
    # a menu path typed with "<" where every other path on the page, including
    # the page's own FAQ answer, writes "מערכת SMS > אוטומציה"
    ("ללשונית מערכת SMS&lt;SMS נכנס", "ללשונית מערכת SMS > SMS נכנס"),
]


def fix_live_typos(s: str) -> str:
    for wrong, right in LIVE_TYPOS:
        s = s.replace(wrong, right)
    return s


# ── image weight ────────────────────────────────────────────────────
# The screenshots arrive as PNG whatever they contain, and a photograph
# stored as PNG is the single heaviest thing on the site: 7 identical
# 1536x1024 cover photos were 1.1MB each, and one blog article shipped
# 4.8MB of images.
#
# Lossy WebP fixes that -- 94-98% off a photograph -- but it softens small
# text, and most of these files are UI screenshots whose Hebrew labels are
# the content. So an image is only re-encoded lossily when two independent
# signals agree that it is photographic:
#
#   lossless ratio  how well it packs with no loss. Flat UI regions pack
#                   well (0.26-0.65 here); continuous tone does not (0.68+).
#   flat fraction   share of pixels identical to the neighbour right and
#                   below. Screenshots 0.53-0.81, photographs 0.02-0.20.
#
# Either alone misfires: a vector diagram full of crisp Hebrew has almost
# no flat pixels because it is built from gradients (flat 0.11), and a
# newsletter mockup of dense small text packs only moderately (ratio 0.60).
# Requiring both means anything ambiguous keeps every pixel, which is the
# direction to be wrong in. Everything else is re-encoded losslessly, which
# still takes 20-55% off and cannot change a pixel.
OPTIMISE_MIN_BYTES = 100 * 1024   # below this the saving is not worth the churn
PHOTO_MIN_RATIO = 0.68
PHOTO_MAX_FLAT = 0.25
PHOTO_QUALITY = 82
PHOTO_MAX_WIDTH = 1600            # nothing on the site displays wider


def _signals(im):
    """(lossless ratio vs the file on disk, flat fraction)."""
    import numpy as np

    buf = io.BytesIO()
    im.save(buf, "WEBP", lossless=True, method=4)
    lossless = buf.tell()

    small = im.copy()
    small.thumbnail((700, 700))
    a = np.asarray(small.convert("RGB")).astype(np.int16)
    same_right = np.abs(a[:-1, :-1] - a[:-1, 1:]).sum(2) == 0
    same_below = np.abs(a[:-1, :-1] - a[1:, :-1]).sum(2) == 0
    return lossless, float((same_right & same_below).mean())


def optimise_image(path: str, verbose: bool = False):
    """Re-encode one image as WebP when that is smaller. Returns the path it
    ended up at, which may have a new extension, or the original path."""
    try:
        from PIL import Image
        import numpy  # noqa: F401  (used by _signals)
    except ImportError:
        return path

    original = os.path.getsize(path)
    if original < OPTIMISE_MIN_BYTES:
        return path

    try:
        im = Image.open(path)
        im.load()
    except Exception:
        return path

    if im.mode in ("P", "LA"):
        im = im.convert("RGBA")

    try:
        lossless, flat = _signals(im)
    except Exception:
        return path

    ratio = lossless / original
    photo = ratio >= PHOTO_MIN_RATIO and flat <= PHOTO_MAX_FLAT

    out = io.BytesIO()
    if photo:
        shrunk = im
        if im.width > PHOTO_MAX_WIDTH:
            shrunk = im.copy()
            shrunk.thumbnail((PHOTO_MAX_WIDTH, PHOTO_MAX_WIDTH))
        shrunk.convert("RGB").save(out, "WEBP", quality=PHOTO_QUALITY, method=4)
    else:
        im.save(out, "WEBP", lossless=True, method=4)

    # never make a file bigger, and never pay the rename for a rounding error
    if out.tell() >= original * 0.95:
        return path

    dest = os.path.splitext(path)[0] + ".webp"
    with open(dest, "wb") as f:
        f.write(out.getvalue())
    if dest != path:
        os.remove(path)

    if verbose:
        print(f"    {'photo   ' if photo else 'lossless'} "
              f"{original // 1024:5}K -> {out.tell() // 1024:5}K  "
              f"ratio={ratio:.2f} flat={flat:.2f}  {os.path.basename(dest)}")
    return dest


def optimise_existing(verbose=True):
    """Sweep the images already imported, then repoint the markdown at them."""
    renames = {}
    saved = 0
    for root in (OUT_IMG, BLOG_IMG):
        if not os.path.isdir(root):
            continue
        for d in sorted(os.listdir(root)):
            folder = os.path.join(root, d)
            if not os.path.isdir(folder):
                continue
            for name in sorted(os.listdir(folder)):
                path = os.path.join(folder, name)
                before = os.path.getsize(path)
                after_path = optimise_image(path, verbose)
                if after_path != path:
                    web_root = "/" + os.path.basename(root)
                    quoted = urllib.parse.quote(d)
                    renames[f"{web_root}/{quoted}/{name}"] = (
                        f"{web_root}/{quoted}/{os.path.basename(after_path)}")
                    saved += before - os.path.getsize(after_path)

    if not renames:
        print("nothing to optimise")
        return

    touched = 0
    for directory in (OUT_MD, BLOG_MD):
        if not os.path.isdir(directory):
            continue
        for name in sorted(os.listdir(directory)):
            if not name.endswith(".md"):
                continue
            f = os.path.join(directory, name)
            text = open(f, encoding="utf-8").read()
            out = text
            for old, new in renames.items():
                out = out.replace(old, new)
            if out != text:
                open(f, "w", encoding="utf-8").write(out)
                touched += 1

    print(f"optimised {len(renames)} images, saved "
          f"{saved / 1024 / 1024:.1f} MB, repointed {touched} markdown files")


def to_markdown(body: str, slug: str, img_map: dict) -> str:
    s = undo_cf_email(body)

    code: list = []
    s = fence_escaped_code(s, code)

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

    # Every real tag is gone by now, so any angle bracket still here came from
    # escaped source text and has to stay text. Left bare, the markdown renderer
    # parses it as a tag and swallows the rest of the sentence — which is how
    # "ללשונית מערכת SMS&lt;SMS נכנס" lost its second half on the page.
    s = s.replace("<", "&lt;")
    s = re.sub(r"(?m)^(\s*)>", r"\1&gt;", s)

    # tidy whitespace without eating the markdown structure
    lines = []
    for raw in s.split("\n"):
        line = re.sub(r"[ \t ]+", " ", raw).strip()
        lines.append(line)
    s = "\n".join(lines)
    s = re.sub(r"\n{3,}", "\n\n", s).strip()

    s = fix_live_typos(s)

    # code samples go back in last, so the tidy pass cannot touch them
    s = re.sub(r"\x01CODE(\d+)\x01",
               lambda m: "```html\n" + code[int(m.group(1))] + "\n```", s)
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
        webp = os.path.splitext(dest)[0] + ".webp"
        for have in (dest, webp):
            if os.path.exists(have) and os.path.getsize(have) > 0:
                img_map[u] = (f"/kb-images/{urllib.parse.quote(slug)}/"
                              f"{os.path.basename(have)}")
                break
        if u in img_map:
            continue
        if fetch_binary(u, dest):
            final = optimise_image(dest)
            img_map[u] = (f"/kb-images/{urllib.parse.quote(slug)}/"
                          f"{os.path.basename(final)}")

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


def _collection_map(directory, route):
    out = {}
    if not os.path.isdir(directory):
        return out
    for name in os.listdir(directory):
        if not name.endswith(".md"):
            continue
        text = open(os.path.join(directory, name), encoding="utf-8").read()
        src = re.search(r'^source: "([^"]+)"', text, re.M)
        slug = re.search(r'^slug: "([^"]+)"', text, re.M)
        if src and slug:
            out[norm_path(src.group(1))] = route + urllib.parse.quote(slug.group(1)) + "/"
    return out


def _slug_map(directory, route):
    """Fall back to matching the live path against a local slug.

    The hand-written blog posts carry no `source`, but their slugs are
    the live ones, so a link to /digital-course-guide/ still resolves.
    """
    out = {}
    if not os.path.isdir(directory):
        return out
    for name in os.listdir(directory):
        if not name.endswith(".md"):
            continue
        text = open(os.path.join(directory, name), encoding="utf-8").read()
        slug = re.search(r'^slug: "([^"]+)"', text, re.M)
        if slug:
            out[slug.group(1).strip().lower()] = route + urllib.parse.quote(slug.group(1)) + "/"
    return out


def guide_map():
    """source path -> the local route, for everything imported so far.

    Covers both collections: a guide often links to an article and the
    other way round, so relinking one without the other leaves half the
    cross-references pointing back at WordPress.
    """
    out = _slug_map(BLOG_MD, "/blog/")
    out.update(_slug_map(OUT_MD, "/kb/"))
    out.update(_collection_map(BLOG_MD, "/blog/"))
    out.update(_collection_map(OUT_MD, "/kb/"))
    return out


def relink_all(verbose=True):
    guides = guide_map()
    changed = 0
    rewritten = 0
    left = {}

    files = []
    for directory in (OUT_MD, BLOG_MD):
        if os.path.isdir(directory):
            files += [os.path.join(directory, n)
                      for n in sorted(os.listdir(directory)) if n.endswith(".md")]

    for path in files:
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



# ── articles ────────────────────────────────────────────────────
# The professional articles are the same WordPress pages as the guides,
# so they extract identically. They differ only in where they land and
# in carrying a date and a category, which the blog sorts and filters
# on. The three hand-written posts already in content/blog are matched
# by title and left alone rather than overwritten by the live version.

def take_date(page: str) -> str:
    for pat in (r'property="article:published_time" content="([^"]+)"',
                r'"datePublished"\s*:\s*"([^"]+)"'):
        m = re.search(pat, page)
        if m:
            return m.group(1)[:10]
    return ""


def existing_blog_titles():
    """Titles of the hand-written posts, which an import must never overwrite.

    A post is hand-written when it carries no `source:` — an imported one
    always records the live URL it came from. Matching on the title alone
    would protect the imported posts too, and so refuse every re-import."""
    out = {}
    if not os.path.isdir(BLOG_MD):
        return out
    for name in os.listdir(BLOG_MD):
        if not name.endswith(".md"):
            continue
        text = open(os.path.join(BLOG_MD, name), encoding="utf-8").read()
        if re.search(r'^source: "\S', text, re.M):
            continue
        m = re.search(r'^title: "((?:[^"\\]|\\.)*)"', text, re.M)
        if m:
            out[m.group(1).replace('\\"', '"').strip()] = name
    return out


def import_article(art, keep, verbose=True):
    slug = slug_of(art["url"])
    title = art["title"]

    if title in keep:
        if verbose:
            print(f"  kept hand-written: {title[:50]}")
        return None

    page = strip_dead(fetch(art["url"]))
    if not page or "<h1" not in page:
        print(f"  SKIP (no page): {title}", file=sys.stderr)
        return None

    body = isolate_body(page, title)
    if body is None:
        print(f"  SKIP (no body): {title}", file=sys.stderr)
        return None

    author = take_author(page)
    featured = take_featured(page)
    date = take_date(page)

    def wanted(u: str) -> bool:
        return u.startswith("http") and re.search(
            r"(sendmsg\.co\.il|comstar\.co\.il)/.*\.(png|jpe?g|webp|gif)", u, re.I
        ) is not None

    srcs = []
    if featured and wanted(featured):
        srcs.append(featured)
    for m in re.finditer(r'<img[^>]*?src="([^"]+)"', body):
        u = htmllib.unescape(m.group(1))
        if wanted(u) and u not in srcs:
            srcs.append(u)

    img_dir = os.path.join(BLOG_IMG, slug)
    img_map = {}
    if srcs:
        os.makedirs(img_dir, exist_ok=True)
    for i, u in enumerate(srcs, 1):
        ext = os.path.splitext(urllib.parse.urlparse(u).path)[1].lower()
        if ext not in (".png", ".jpg", ".jpeg", ".webp", ".gif"):
            ext = ".png"
        name = ("cover" if u == featured else f"{i:02d}") + ext
        dest = os.path.join(img_dir, name)
        webp = os.path.splitext(dest)[0] + ".webp"
        here = f"/blog-images/{urllib.parse.quote(slug)}/"
        have = next((h for h in (dest, webp)
                     if os.path.exists(h) and os.path.getsize(h) > 0), None)
        if have:
            img_map[u] = here + os.path.basename(have)
        elif fetch_binary(u, dest):
            img_map[u] = here + os.path.basename(optimise_image(dest))

    md = to_markdown(body, slug, img_map)
    if len(md) < 200:
        print(f"  SKIP (body too short, {len(md)}): {title}", file=sys.stderr)
        return None

    excerpt = first_paragraph(md)

    fm = [
        "---",
        f"title: {yaml_quote(title)}",
        f"slug: {yaml_quote(slug)}",
        f"date: {yaml_quote(date)}",
        f"category: {yaml_quote(BLOG_CATEGORY)}",
        f"excerpt: {yaml_quote(excerpt)}",
        f"author: {yaml_quote(author or '')}",
        f"featuredImage: {yaml_quote(img_map.get(featured, '') if featured else '')}",
        f"source: {yaml_quote(art['url'])}",
        "---",
    ]

    os.makedirs(BLOG_MD, exist_ok=True)
    fname = re.sub(r"[^A-Za-z0-9\u0590-\u05FF._-]", "-", slug) + ".md"
    with open(os.path.join(BLOG_MD, fname), "w", encoding="utf-8") as f:
        f.write("\n".join(fm) + "\n\n" + md + "\n")

    if verbose:
        print(f"  {title[:46]:48} {date}  {len(md):6} chars  {len(img_map)} imgs")
    return {"slug": slug, "images": len(img_map)}


def import_articles(catalogue, verbose=True):
    keep = existing_blog_titles()
    print(f"importing {len(catalogue)} articles ({len(keep)} hand-written posts will be kept)")
    done = [import_article(a, keep, verbose) for a in catalogue]
    ok = [d for d in done if d]
    print(f"\n{len(ok)} imported, {sum(d['images'] for d in ok)} images")
    return ok


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--slug")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--limit", type=int)
    ap.add_argument("--articles", metavar="JSON",
                    help="import professional articles into content/blog from a "
                         "JSON list of {url, title}")
    ap.add_argument("--excerpts", action="store_true",
                    help="only backfill excerpts, do not fetch")
    ap.add_argument("--relink", action="store_true",
                    help="only rewrite links in content/kb, do not fetch")
    ap.add_argument("--optimise", "--optimize", action="store_true",
                    dest="optimise",
                    help="re-encode the already-imported images as WebP and "
                         "repoint the markdown at them, do not fetch")
    args = ap.parse_args()

    if args.articles:
        import_articles(json.load(open(args.articles, encoding="utf-8")))
        return

    if args.optimise:
        optimise_existing()
        return

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
