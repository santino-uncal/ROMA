"""Quita el fondo blanco de una imagen mediante flood-fill desde los bordes,
para no tocar blancos internos (letras, brillos). Guarda como PNG con alpha."""
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

def remove_white_background(path_in, path_out, thresh=235, tol=18):
    im = Image.open(path_in).convert("RGBA")
    arr = np.array(im)
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(int)

    # "Cercano a blanco": todos los canales altos y poca diferencia entre ellos
    maxc = rgb.max(axis=2)
    minc = rgb.min(axis=2)
    is_whiteish = (minc >= thresh - tol) & (maxc - minc <= tol)

    visited = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if is_whiteish[y, x] and not visited[y, x]:
                visited[y, x] = True
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_whiteish[y, x] and not visited[y, x]:
                visited[y, x] = True
                q.append((x, y))

    while q:
        x, y = q.popleft()
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx, ny = x+dx, y+dy
            if 0 <= nx < w and 0 <= ny < h and not visited[ny, nx] and is_whiteish[ny, nx]:
                visited[ny, nx] = True
                q.append((nx, ny))

    alpha = arr[:, :, 3].copy()
    alpha[visited] = 0
    alpha_img = Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(radius=0.6))
    arr[:, :, 3] = np.array(alpha_img)
    Image.fromarray(arr, mode="RGBA").save(path_out)
    print(f"{path_in} -> {path_out} ({visited.sum()} px de fondo removidos de {h*w})")

if __name__ == "__main__":
    remove_white_background(sys.argv[1], sys.argv[2])
