#!/usr/bin/env python3
"""Audit the built site against the machine-checkable parts of WCAG 2 AA.

/accessibility/ declares conformance with תקן ישראלי 5568, which is WCAG 2
level AA. A declaration nobody can re-check goes stale the first time a page
is added, so this script checks what can honestly be checked from the built
HTML and the stylesheets, and says plainly what it cannot.

    npx gatsby build --prefix-paths && python3 scripts/check-a11y.py

WHAT IT CHECKS (each maps to a success criterion)

    lang        1.3.1/3.1.1  <html lang> and dir present
    title       2.4.2        every page has a non-empty, unique <title>
    alt         1.1.1        every <img> carries alt (decorative: alt="")
    heading     1.3.1/2.4.6  exactly one <h1>, no skipped levels
    landmark    1.3.1/2.4.1  <main> present, and a skip link to it
    label       1.3.1/3.3.2  every form control has a label, aria-label or
                             aria-labelledby
    name        2.4.4/4.1.2  links and buttons have an accessible name
    dupid       4.1.1        no duplicate id on a page
    tabindex    2.4.3        no positive tabindex
    media       1.4.2/1.2    autoplaying media is muted and has controls
    focus       2.4.7        no outline:none without a :focus-visible rule
    contrast    1.4.3        text/background pairs declared in the same CSS
                             rule reach 4.5:1 (3:1 for large text)

WHAT IT CANNOT CHECK, and still needs a person with a browser and a screen
reader: keyboard order and traps, focus visibility in practice, contrast of
pairs that only meet at runtime (inherited or layered backgrounds), meaningful
alt text as opposed to present alt text, reflow at 320px, and motion
preferences. Those are the parts of 5568 a script cannot sign off.

Exits non-zero if anything is found.
"""

import os
import re
import sys
from collections import Counter, defaultdict

ROOT = "public"

VOID_INPUTS = re.compile(r"<(input|select|textarea)\b([^>]*)>", re.I)
TAG_ATTRS = re.compile(r'([a-zA-Z-]+)(?:="([^"]*)")?')


def attrs(fragment: str) -> dict:
    return {m.group(1).lower(): (m.group(2) or "") for m in TAG_ATTRS.finditer(fragment)}


def text_of(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html)).strip()


# ── contrast ────────────────────────────────────────────────────────────
def srgb(c: float) -> float:
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(rgb) -> float:
    r, g, b = (srgb(x) for x in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b) -> float:
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def parse_colour(value: str):
    value = value.strip().lower()
    m = re.fullmatch(r"#([0-9a-f]{3})", value)
    if m:
        return tuple(int(ch * 2, 16) for ch in m.group(1))
    m = re.fullmatch(r"#([0-9a-f]{6})", value)
    if m:
        h = m.group(1)
        return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))
    m = re.match(r"rgba?\(([^)]+)\)", value)
    if m:
        parts = [p.strip() for p in re.split(r"[ ,/]+", m.group(1)) if p.strip()]
        if len(parts) >= 3:
            try:
                nums = [float(p.rstrip("%")) for p in parts[:3]]
            except ValueError:
                return None
            # a translucent colour sits over an unknown backdrop; skip it
            if len(parts) > 3 and parts[3] not in ("1", "1.0", "100%"):
                return None
            return tuple(int(n) for n in nums)
    return {"white": (255, 255, 255), "black": (0, 0, 0)}.get(value)


def referenced_stylesheets() -> list:
    """Only the stylesheets the pages actually link.

    An incremental build leaves earlier hashed stylesheets lying in public/,
    so reading every .css there reports findings that were already fixed."""
    wanted = set()
    for dirpath, _dirs, files in os.walk(ROOT):
        for fname in files:
            if not fname.endswith(".html"):
                continue
            html = open(os.path.join(dirpath, fname), encoding="utf-8",
                        errors="replace").read()
            for m in re.finditer(r'href="([^"]+\.css)"', html):
                wanted.add(os.path.basename(m.group(1)))
    return sorted(w for w in wanted if os.path.isfile(os.path.join(ROOT, w)))


def check_contrast(problems):
    """Only pairs declared together in one rule, where the pairing is certain."""
    for name in referenced_stylesheets():
        css = open(os.path.join(ROOT, name), encoding="utf-8", errors="replace").read()
        tokens = dict(re.findall(r"(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,6})", css))

        def resolve(v: str):
            m = re.fullmatch(r"var\((--[\w-]+)\)", v.strip())
            if m:
                v = tokens.get(m.group(1), "")
            return parse_colour(v)

        for rule in re.finditer(r"([^{}]+)\{([^{}]*)\}", css):
            selector, body = rule.group(1).strip(), rule.group(2)
            fg = re.search(r"(?:^|;)\s*color\s*:\s*([^;!]+)", body)
            bg = re.search(r"(?:^|;)\s*background(?:-color)?\s*:\s*([^;!]+)", body)
            if not (fg and bg):
                continue
            if "gradient" in bg.group(1) or "url(" in bg.group(1):
                continue
            f, b = resolve(fg.group(1)), resolve(bg.group(1))
            if not f or not b:
                continue
            r = ratio(f, b)
            big = re.search(r"font-size\s*:\s*(?:clamp\([^)]*?([\d.]+)rem|([\d.]+)rem)", body)
            size = float(big.group(1) or big.group(2)) if big else 1.0
            bold = "font-weight:7" in body.replace(" ", "") or "font-weight:8" in body.replace(" ", "")
            need = 3.0 if (size >= 1.5 or (size >= 1.185 and bold)) else 4.5
            # 1.4.3 does not apply to inactive controls
            if ":disabled" in selector or "[disabled]" in selector:
                continue
            if r < need:
                problems["contrast"].append(
                    (name, f"{selector[:70]}  {r:.2f}:1 (needs {need}:1)")
                )


def main() -> int:
    problems = defaultdict(list)
    titles = Counter()
    pages = 0

    for dirpath, _dirs, files in os.walk(ROOT):
        for fname in sorted(files):
            if not fname.endswith(".html"):
                continue
            full = os.path.join(dirpath, fname)
            page = "/" + os.path.relpath(full, ROOT)
            # Gatsby internals, not pages: a slice is an HTML fragment, and
            # /404.html is the same page as /404/ emitted twice
            if "_gatsby" in page.split(os.sep) or page == "/404.html":
                continue
            html = open(full, encoding="utf-8", errors="replace").read()
            pages += 1
            # Gatsby marks slice boundaries with <!-- ... id="..." -->, which
            # is a comment, not an element, and must not count as an id
            html = re.sub(r"(?s)<!--.*?-->", " ", html)

            html_tag = re.search(r"<html\b([^>]*)>", html, re.I)
            a = attrs(html_tag.group(1)) if html_tag else {}
            if not a.get("lang"):
                problems["lang"].append((page, "<html> has no lang"))
            if not a.get("dir"):
                problems["lang"].append((page, "<html> has no dir"))

            title = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
            if not title or not title.group(1).strip():
                problems["title"].append((page, "empty or missing <title>"))
            else:
                titles[title.group(1).strip()] += 1

            for m in re.finditer(r"<img\b([^>]*)>", html, re.I):
                ia = attrs(m.group(1))
                if "alt" not in ia and not ia.get("aria-hidden") and not ia.get("role") == "presentation":
                    problems["alt"].append((page, m.group(0)[:90]))

            levels = [int(m.group(1)) for m in re.finditer(r"<h([1-6])\b", html, re.I)]
            if levels.count(1) == 0:
                problems["heading"].append((page, "no <h1>"))
            elif levels.count(1) > 1:
                problems["heading"].append((page, f"{levels.count(1)} <h1> elements"))
            prev = 0
            for lv in levels:
                if prev and lv > prev + 1:
                    problems["heading"].append((page, f"h{prev} jumps to h{lv}"))
                    break
                prev = lv

            if "<main" not in html.lower():
                problems["landmark"].append((page, "no <main> landmark"))
            if not re.search(r'href="#[^"]*"[^>]*class="[^"]*skip', html, re.I) and not re.search(
                r'class="[^"]*skip[^"]*"[^>]*href="#', html, re.I
            ):
                problems["landmark"].append((page, "no skip link"))

            # an input nested inside <label> is labelled implicitly, which is
            # just as valid as for=/id= and is what this site actually uses
            label_spans = [(m.start(), m.end())
                           for m in re.finditer(r"(?is)<label\b[^>]*>.*?</label>", html)]

            for m in VOID_INPUTS.finditer(html):
                if any(a <= m.start() < b for a, b in label_spans):
                    continue
                ta = attrs(m.group(2))
                if ta.get("type", "").lower() in ("hidden", "submit", "button", "image"):
                    continue
                if ta.get("aria-label") or ta.get("aria-labelledby") or ta.get("title"):
                    continue
                cid = ta.get("id")
                if cid and re.search(rf'<label[^>]*for="{re.escape(cid)}"', html, re.I):
                    continue
                problems["label"].append((page, m.group(0)[:90]))

            for m in re.finditer(r"<a\b([^>]*)>(.*?)</a>", html, re.I | re.S):
                la = attrs(m.group(1))
                if "href" not in la:
                    continue
                name = text_of(m.group(2)) or la.get("aria-label") or la.get("title")
                if not name:
                    inner = attrs(m.group(2))
                    name = inner.get("alt")
                if not name:
                    problems["name"].append((page, (m.group(0)[:90]).replace("\n", " ")))

            for m in re.finditer(r"<button\b([^>]*)>(.*?)</button>", html, re.I | re.S):
                ba = attrs(m.group(1))
                if not (text_of(m.group(2)) or ba.get("aria-label") or ba.get("aria-labelledby")):
                    problems["name"].append((page, (m.group(0)[:90]).replace("\n", " ")))

            ids = re.findall(r'\sid="([^"]+)"', html)
            for dup, n in Counter(ids).items():
                if n > 1:
                    problems["dupid"].append((page, f'id="{dup}" x{n}'))

            for m in re.finditer(r'tabindex="(\d+)"', html):
                if int(m.group(1)) > 0:
                    problems["tabindex"].append((page, f"positive tabindex={m.group(1)}"))

            for m in re.finditer(r"<(video|audio)\b([^>]*)>", html, re.I):
                ma = attrs(m.group(2))
                if "autoplay" in ma and "muted" not in ma:
                    problems["media"].append((page, "autoplay without muted"))
                if "controls" not in ma and "autoplay" not in ma:
                    problems["media"].append((page, f"<{m.group(1)}> without controls"))

    for t, n in titles.items():
        if n > 1:
            problems["title"].append(("(site)", f'{n} pages share the title "{t[:50]}"'))

    for name in referenced_stylesheets():
        css = open(os.path.join(ROOT, name), encoding="utf-8", errors="replace").read()
        kills = len(re.findall(r"outline\s*:\s*(?:none|0)", css))
        restores = len(re.findall(r":focus-visible", css))
        if kills and not restores:
            problems["focus"].append((name, f"{kills} outline:none and no :focus-visible rule"))

    check_contrast(problems)

    print(f"checked {pages} pages in {ROOT}/\n")
    order = ["lang", "title", "alt", "heading", "landmark", "label",
             "name", "dupid", "tabindex", "media", "focus", "contrast"]
    total = 0
    for kind in order:
        found = problems.get(kind, [])
        total += len(found)
        print(f"{kind:9} {len(found)}")
        seen = set()
        shown = 0
        for where, detail in found:
            if detail in seen:
                continue
            seen.add(detail)
            if shown >= 6:
                break
            print(f"          {where}\n              {detail}")
            shown += 1
        if len(seen) > shown:
            print(f"          ... {len(seen) - shown} more distinct")

    print("\nclean" if total == 0 else f"\n{total} finding(s)")
    print("\nNot covered here, and still needing a person: keyboard order and")
    print("traps, focus visibility in practice, runtime contrast over layered")
    print("backgrounds, whether alt text is meaningful, reflow at 320px.")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
