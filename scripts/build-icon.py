"""Build the favicon and the square logo tile from the real Anton outlines.

The site header draws the logo as live text (`L<em>à</em>jà` in Anton). A
favicon is rendered without the page's webfont, so `font-family: Anton` inside
the SVG would silently fall back to Arial and ship a different mark. This
converts the four glyphs to paths instead, reproducing the header's
`letter-spacing: 0.02em` so the tile and the nav read as the same logo.

The Anton subset it reads is the one `next/font` already downloaded into
`.next/static/media`. Run `npm run dev` or `npm run build` first, then:

    python3 -m venv /tmp/fontenv && /tmp/fontenv/bin/pip install fonttools brotli Pillow
    /tmp/fontenv/bin/python scripts/build-icon.py

It writes app/icon.svg, public/laja-icon.svg and app/favicon.ico.
"""

import glob
import os
import re
import subprocess
import sys
import tempfile

from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TEXT = "LÀJÀ"
TRACK_EM = 0.02   # the header's letter-spacing
SIZE = 512
FILL = 0.82       # share of the tile the wordmark spans, width-constrained

INK = "#101a5c"
CORAL = "#fc6a4b"   # the accent the header paints on the first A-grave
CREAM = "#f5eee4"


def find_anton() -> str:
    """The next/font subset that actually carries L, J and A-grave."""
    need = {ord(c) for c in TEXT}
    for path in sorted(glob.glob(os.path.join(ROOT, ".next/static/media/*.woff2"))):
        try:
            font = TTFont(path, lazy=True)
        except Exception:
            continue
        with font:
            if font["name"].getDebugName(1) == "Anton" and need <= set(font.getBestCmap()):
                return path
    sys.exit("No Anton subset found. Run a build first so next/font downloads it.")


def build_svg() -> str:
    font = TTFont(find_anton())
    cmap, glyphs, hmtx = font.getBestCmap(), font.getGlyphSet(), font["hmtx"]
    track = TRACK_EM * font["head"].unitsPerEm

    # lay the word out in font units, y-up
    laid, x = [], 0.0
    for i, ch in enumerate(TEXT):
        name = cmap[ord(ch)]
        rec = RecordingPen()
        glyphs[name].draw(rec)
        laid.append((x, rec))
        x += hmtx[name][0] + (track if i < len(TEXT) - 1 else 0)

    # the inked bounds, not the advance: the tile is centred on the ink
    bounds = BoundsPen(glyphs)
    for ox, rec in laid:
        rec.replay(TransformPen(bounds, Transform().translate(ox, 0)))
    x0, y0, x1, y1 = bounds.bounds
    w, h = x1 - x0, y1 - y0

    scale = (SIZE * FILL) / w
    tx = (SIZE - w * scale) / 2 - x0 * scale
    ty = (SIZE - h * scale) / 2 + y1 * scale   # y-flip into SVG's y-down

    out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{SIZE}" height="{SIZE}" '
           f'viewBox="0 0 {SIZE} {SIZE}">',
           f'<rect width="{SIZE}" height="{SIZE}" fill="{CREAM}"/>']
    for i, (ox, rec) in enumerate(laid):
        pen = SVGPathPen(glyphs)
        rec.replay(TransformPen(pen, Transform(scale, 0, 0, -scale, tx, ty).translate(ox, 0)))
        out.append(f'<path fill="{CORAL if i == 1 else INK}" d="{pen.getCommands()}"/>')
    out.append("</svg>")

    svg = "\n".join(out) + "\n"
    return re.sub(r"-?\d+\.\d+", lambda m: f"{float(m.group()):.2f}".rstrip("0").rstrip("."), svg)


def write_ico(svg_path: str, dest: str) -> None:
    """Rasterise via Quick Look, then pack the standard sizes.

    Flattened onto the cream rather than left transparent: a browser tab paints
    the icon on its own chrome, and a transparent tile would pick that up
    instead of the brand ground. The alpha channel is kept, fully opaque,
    because Next refuses to decode an .ico whose PNG is not RGBA.
    """
    from PIL import Image

    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["qlmanage", "-t", "-s", "1024", "-o", tmp, svg_path],
                       check=True, capture_output=True)
        png = glob.glob(os.path.join(tmp, "*.png"))
        if not png:
            sys.exit("qlmanage produced no render")
        art = Image.open(png[0]).convert("RGBA")

    ground = Image.new("RGBA", art.size, (245, 238, 228, 255))
    ground.alpha_composite(art)
    # Stays RGBA, opaque everywhere. Next decodes the .ico to read its size and
    # rejects a non-RGBA payload outright ("The PNG is not in RGBA format"),
    # which fails the build rather than degrading.
    ground.save(dest, sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])


HEADER = """<!-- The site logo as a square tile: the LÀJÀ wordmark in Anton, ink with the
     first A-grave in coral, on the brand cream. Generated from the real Anton
     outlines rather than live text, because a favicon is rendered without the
     page's webfont and `font-family: Anton` in here would silently fall back
     to Arial. The header sets letter-spacing: 0.02em, which the layout below
     reproduces, so the tile and the nav read as the same mark.
     Regenerate with scripts/build-icon.py if the wordmark ever changes. -->
"""

if __name__ == "__main__":
    svg = HEADER + build_svg()
    for rel in ("app/icon.svg", "public/laja-icon.svg"):
        with open(os.path.join(ROOT, rel), "w") as fh:
            fh.write(svg)
        print("wrote", rel)
    write_ico(os.path.join(ROOT, "app/icon.svg"), os.path.join(ROOT, "app/favicon.ico"))
    print("wrote app/favicon.ico")
