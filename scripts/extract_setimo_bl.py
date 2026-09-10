"""Canto inferior esquerdo — mesmo pipeline do setimo-corner-tr-full (sem branco)."""
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

SRC = Path(
    r"C:\Users\dev3\.cursor\projects\c-Users-dev3-Desktop-relatorios-tarefas-reuni-es-realizadas-saicon-api-test-api-Art-Editor\assets\c__Users_dev3_AppData_Roaming_Cursor_User_workspaceStorage_5a2ea8d732caf709c937aa9a2ce714a2_images_39974613-2253-4b7d-af1b-75ce92f5e393-57d294a9-f2b7-445a-b2d8-efe06d79e19c.png"
)
OUT = Path(__file__).resolve().parents[1] / "public" / "templates"

im = Image.open(SRC).convert("RGBA")
w, h = im.size
px = im.load()
pr, pg, pb, _ = im.getpixel((w // 2, h // 2))
navy_fill = (1, 20, 48, 255)


def is_navy(r, g, b):
    return r < 55 and g < 70 and b < 110 and b > 25 and b >= r + 12


def is_paper(r, g, b, tol=18):
    return max(abs(r - pr), abs(g - pg), abs(b - pb)) <= tol


mask = [[False] * w for _ in range(h)]
q = deque()
for s in [
    (2, h - 2),
    (15, h - 15),
    (40, h - 8),
    (8, h - 80),
    (25, h - 50),
    (5, h - 150),
    (40, h - 120),
    (80, h - 40),
    (20, h - 220),
]:
    x, y = s
    if 0 <= x < w and 0 <= y < h and is_navy(*px[x, y][:3]):
        mask[y][x] = True
        q.append((x, y))

while q:
    x, y = q.popleft()
    for nx, ny in (
        (x - 1, y),
        (x + 1, y),
        (x, y - 1),
        (x, y + 1),
        (x - 1, y - 1),
        (x + 1, y + 1),
        (x - 1, y + 1),
        (x + 1, y - 1),
    ):
        if 0 <= nx < w and 0 <= ny < h and not mask[ny][nx] and is_navy(*px[nx, ny][:3]):
            mask[ny][nx] = True
            q.append((nx, ny))

nimg = Image.new("L", (w, h), 0)
for y in range(h):
    for x in range(w):
        if mask[y][x]:
            nimg.putpixel((x, y), 255)

# mesmo fechamento do TR
closed = nimg.filter(ImageFilter.MaxFilter(13)).filter(ImageFilter.MinFilter(9))
closed = closed.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(3))
closed = closed.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
sp = closed.load()

out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
op = out.load()

for y in range(h):
    for x in range(w):
        if sp[x, y] == 0:
            continue
        r, g, b, _a = px[x, y]
        if is_navy(r, g, b):
            op[x, y] = (r, g, b, 255)
        elif is_paper(r, g, b):
            op[x, y] = navy_fill
        elif r > 100 or g > 110:
            # flora / filete — mesma regra do TR
            # mata só branco puro (papel/compressão), mantém traço claro azulado
            if r >= 230 and g >= 230 and b >= 230:
                # remapeia branco → azul claro do lírio (nunca branco)
                op[x, y] = (155, 175, 205, 255)
            elif r >= 215 and g >= 215 and b >= 205 and abs(r - b) < 25:
                # quase-branco → azul suave
                t = 0.55
                op[x, y] = (
                    int(r * (1 - t) + 150 * t),
                    int(g * (1 - t) + 170 * t),
                    int(b * (1 - t) + 205 * t),
                    255,
                )
            else:
                op[x, y] = (r, g, b, 255)
        else:
            op[x, y] = navy_fill

# preenche ilhas transparentes no interior (igual TR)
for _ in range(3):
    adds = []
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            if op[x, y][3] > 0:
                continue
            n = 0
            for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                rr, gg, bb, aa = op[x + dx, y + dy]
                if aa > 200 and is_navy(rr, gg, bb):
                    n += 1
            if n >= 3:
                adds.append((x, y))
    for x, y in adds:
        op[x, y] = navy_fill

# filete dourado na borda interna (direita do shape BL)
gold = (196, 164, 106, 255)
for y in range(h):
    for x in range(w):
        if op[x, y][3] == 0:
            continue
        if x + 1 < w and op[x + 1, y][3] == 0:
            for k in range(2):
                xx = x - k
                if xx >= 0 and op[xx, y][3] > 0:
                    rr, gg, bb, _aa = op[xx, y]
                    if rr + gg + bb < 240:
                        op[xx, y] = gold

ys = [y for y in range(h) for x in range(w) if op[x, y][3] > 0]
y0 = max(0, min(ys) - 4)
full = out.crop((0, y0, w, h))
full.save(OUT / "setimo-corner-bl-full.png", optimize=True)
full.save(OUT / "setimo-corner-bl-full-v3.png", optimize=True)

xs = [x for y in range(full.height) for x in range(full.width) if full.getpixel((x, y))[3] > 0]
tight = full.crop((0, 0, min(full.width, max(xs) + 6), full.height))
tight.save(OUT / "setimo-corner-bl.png", optimize=True)

white = 0
flora = 0
tot = 0
fp = full.load()
for y in range(full.height):
    for x in range(full.width):
        r, g, b, a = fp[x, y]
        if a < 20:
            continue
        tot += 1
        lum = (r + g + b) / 3
        if r > 220 and g > 220 and b > 220:
            white += 1
        elif lum > 110 and not (r > 150 and g > 110 and b < 160 and r > b + 20):
            flora += 1
print("BL", full.size, "opaque", tot, "white", white, "flora-ish", flora)
