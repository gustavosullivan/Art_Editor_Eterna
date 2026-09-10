"""Reconstrói decor do Sétimo Dia sem restos de texto do Modelo Principal."""
from collections import deque
from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "templates" / "convite-principal.png"
OUT = ROOT / "public" / "templates"

im = Image.open(SRC).convert("RGBA")
w, h = im.size
pr, pg, pb, _ = im.getpixel((20, 500))
px = im.load()
navy_fill = (1, 20, 47, 255)


def is_paper(r, g, b, tol=16):
    return max(abs(r - pr), abs(g - pg), abs(b - pb)) <= tol


def is_navy(r, g, b):
    return r < 70 and g < 80 and b < 120 and b > 28 and b >= g + 8 and g >= r


def is_gold(r, g, b):
    return r > 145 and g > 105 and b < 145 and r > b + 25 and (r + g) / 2 > b + 40


def is_flora(r, g, b):
    return r > 130 and g > 150 and b > 170 and not is_paper(r, g, b, tol=20)


def flood(seeds):
    mask = [[False] * w for _ in range(h)]
    q = deque()
    for sx, sy in seeds:
        r, g, b, _a = px[sx, sy]
        if is_navy(r, g, b):
            q.append((sx, sy))
            mask[sy][sx] = True
    while q:
        x, y = q.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not mask[ny][nx]:
                r, g, b, _a = px[nx, ny]
                if is_navy(r, g, b):
                    mask[ny][nx] = True
                    q.append((nx, ny))
    return mask


tr = flood([(w - 2, 2), (w - 20, 20), (w - 40, 5), (w - 10, 80)])
bl = flood([(2, h - 2), (20, h - 20), (5, h - 40), (80, h - 10)])

navy_img = Image.new("L", (w, h), 0)
npix = navy_img.load()
for y in range(h):
    for x in range(w):
        if tr[y][x] or bl[y][x]:
            npix[x, y] = 255

# Fecha mordidas do texto HOMENAGEM (closing)
closed = navy_img.filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.MinFilter(17))
cp = closed.load()

title_boost = Image.new("L", (w, h), 0)
tbp = title_boost.load()
for y in range(40, 200):
    for x in range(int(w * 0.48), int(w * 0.78)):
        if cp[x, y] > 0:
            tbp[x, y] = 255
title_boost = title_boost.filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.MinFilter(7))
tbp = title_boost.load()

# Suaviza degraus da borda
solid = Image.new("L", (w, h), 0)
sp0 = solid.load()
for y in range(h):
    for x in range(w):
        if cp[x, y] > 0 or tbp[x, y] > 0:
            sp0[x, y] = 255
solid = solid.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
sp = solid.load()

decor = Image.new("RGBA", (w, h), (0, 0, 0, 0))
dp = decor.load()

for y in range(h):
    for x in range(w):
        if sp[x, y] == 0:
            continue
        r, g, b, _a = px[x, y]
        if is_navy(r, g, b):
            dp[x, y] = (r, g, b, 255)
        elif is_flora(r, g, b) and npix[x, y] > 0:
            dp[x, y] = (r, g, b, 255)
        else:
            dp[x, y] = navy_fill

dil = solid.filter(ImageFilter.MaxFilter(3))
d2 = dil.load()
for y in range(h):
    for x in range(w):
        if sp[x, y] > 0 or d2[x, y] == 0:
            continue
        if 55 <= y <= 185 and x < int(w * 0.78):
            continue
        r, g, b, _a = px[x, y]
        if is_gold(r, g, b):
            dp[x, y] = (r, g, b, 255)

for y in range(h):
    for x in range(w):
        if sp[x, y] > 0:
            continue
        in_left = x <= int(w * 0.20) and int(h * 0.26) <= y <= int(h * 0.68)
        in_right = x >= int(w * 0.80) and int(h * 0.30) <= y <= int(h * 0.72)
        if not (in_left or in_right):
            continue
        r, g, b, _a = px[x, y]
        if is_paper(r, g, b, tol=10):
            continue
        dist = max(abs(r - pr), abs(g - pg), abs(b - pb))
        if 12 <= dist <= 55 and r > 170 and g > 170 and b > 170:
            dp[x, y] = (r, g, b, min(190, 30 + dist * 4))

decor.save(OUT / "setimo-decor-from-principal.png")
decor.crop((int(w * 0.42), 0, w, int(h * 0.40))).save(OUT / "setimo-corner-tr.png")
decor.crop((0, int(h * 0.58), int(w * 0.58), h)).save(OUT / "setimo-corner-bl.png")
decor.crop((0, int(h * 0.20), int(w * 0.28), int(h * 0.74))).save(OUT / "setimo-lily-left.png")
decor.crop((int(w * 0.72), int(h * 0.26), w, int(h * 0.80))).save(OUT / "setimo-lily-right.png")

for tmp in ("_preview-setimo-decor-on-paper.png", "_preview-setimo-tr-zoom.png"):
    p = OUT / tmp
    if p.exists():
        p.unlink()

print("setimo decor repaired")
