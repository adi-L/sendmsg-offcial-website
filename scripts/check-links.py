#!/usr/bin/env python3
"""Walk the built site and report anything that would break for a reader.

Run it against a --prefix-paths build, never a plain one: the deploy serves
under a pathPrefix, and a plain build hides a whole class of breakage.

    npx gatsby build --prefix-paths && python3 scripts/check-links.py

It checks four things over every page in public/:

  dead     an internal href or img src with nothing behind it on disk
  prefix   a root-relative URL that forgot withPrefix(), so it 404s on deploy
  nul      a NUL byte in the HTML (see stripNulBytes in gatsby-node.ts)
  markup   raw "<" in body text, from markdown that escaped its own angle
           brackets -- the renderer reads it as a tag and eats the sentence

Exits non-zero if anything is found, so it can gate a deploy.
"""

import os
import re
import sys
from collections import defaultdict
from urllib.parse import unquote, urlparse

ROOT = "public"
PREFIX = "/sendmsg-offcial-website"  # keep in step with gatsby-config.ts

TAGS = re.compile(r"""<(a|img|source)\b[^>]*?\b(href|src|srcset)=("|')(.*?)\3""", re.I | re.S)
SKIP = ("#", "mailto:", "tel:", "javascript:", "data:", "whatsapp:")


def resolves(path: str) -> bool:
    local = os.path.join(ROOT, path.lstrip("/"))
    return (
        os.path.isfile(local)
        or os.path.isfile(local.rstrip("/") + ".html")
        or os.path.isfile(os.path.join(local, "index.html"))
    )


def targets(attr: str, value: str):
    if attr.lower() == "srcset":
        return [c.strip().split(" ")[0] for c in value.split(",") if c.strip()]
    return [value.strip()]


def main() -> int:
    problems: dict[str, list[tuple[str, str]]] = defaultdict(list)
    pages = 0

    for dirpath, _dirs, files in os.walk(ROOT):
        for name in sorted(files):
            if not name.endswith(".html"):
                continue
            full = os.path.join(dirpath, name)
            page = "/" + os.path.relpath(full, ROOT)
            pages += 1

            raw = open(full, "rb").read()
            if b"\x00" in raw:
                problems["nul"].append((page, f"{raw.count(b'\x00')} NUL byte(s)"))

            html = raw.decode("utf-8", "replace")

            body = re.search(r"(?is)<main\b.*?</main>", html)
            if body:
                # React writes <!-- --> between adjacent text nodes, so a
                # comment opener is not a stray bracket
                stray_bracket = r"<(?!/?[a-zA-Z]|!--|!DOCTYPE)"
                for stray in re.finditer(stray_bracket, body.group(0)):
                    around = body.group(0)[stray.start() : stray.start() + 40]
                    problems["markup"].append((page, around.replace("\n", " ")))

            for tag, attr, _quote, value in (m.groups() for m in TAGS.finditer(html)):
                for target in targets(attr, value):
                    if not target or target.startswith(SKIP):
                        continue
                    parsed = urlparse(target)
                    if parsed.scheme or parsed.netloc:
                        continue  # off-site, not ours to verify here
                    path = unquote(parsed.path)
                    if not path:
                        continue
                    if not path.startswith("/"):
                        path = os.path.normpath(os.path.join(os.path.dirname(page), path))
                    if path.startswith(PREFIX):
                        path = path[len(PREFIX) :] or "/"
                    else:
                        problems["prefix"].append((page, target))
                    if not resolves(path):
                        problems["dead"].append((page, f"<{tag.lower()}> {target}"))

    print(f"checked {pages} pages in {ROOT}/\n")
    total = 0
    for kind in ("dead", "prefix", "nul", "markup"):
        found = problems.get(kind, [])
        total += len(found)
        print(f"{kind:8} {len(found)}")
        for page, detail in found[:25]:
            print(f"         {page}\n             {detail}")
        if len(found) > 25:
            print(f"         ... and {len(found) - 25} more")

    print("\nclean" if total == 0 else f"\n{total} problem(s)")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
