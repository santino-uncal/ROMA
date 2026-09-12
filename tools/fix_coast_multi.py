"""
Como fix_coast.py pero soporta varios colores de territorio en la misma
imagen (por ejemplo Imperio Romano en rojo + Imperio Galo en verde +
Imperio de Palmira en amarillo).

Uso:
    python tools/fix_coast_multi.py "archivo.png" 237,28,36 34,177,76 255,242,0

Sobrescribe el archivo de entrada.
"""
import sys
import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation


def grow_color(arr, count_per_pixel, fill_color, pure_threshold=2000, max_iter=8):
    fill = np.array(fill_color, dtype=np.uint8)
    filled_mask = np.all(arr == fill, axis=-1)
    impure_mask = count_per_pixel < pure_threshold
    structure = np.ones((3, 3), dtype=bool)

    grown = filled_mask.copy()
    for _ in range(max_iter):
        dilated = binary_dilation(grown, structure=structure)
        candidate = dilated & impure_mask & ~grown
        if not candidate.any():
            break
        grown = grown | candidate

    new_pixels = grown & ~filled_mask
    arr[new_pixels] = fill
    return int(new_pixels.sum())


def fix_coast_multi(path, fill_colors):
    im = Image.open(path).convert("RGB")
    arr = np.array(im)
    h, w, _ = arr.shape

    flat = arr.reshape(-1, 3)
    colors, inverse, counts = np.unique(flat, axis=0, return_inverse=True, return_counts=True)
    count_per_pixel = counts[inverse].reshape(h, w)

    total = 0
    for fc in fill_colors:
        n = grow_color(arr, count_per_pixel, fc)
        total += n

    print(f"{path}: recolored {total} fringe pixels total across {len(fill_colors)} colores")
    Image.fromarray(arr).save(path)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python fix_coast_multi.py <archivo> <R,G,B> [<R,G,B> ...]")
        sys.exit(1)
    path = sys.argv[1]
    fill_colors = [tuple(int(c) for c in a.split(",")) for a in sys.argv[2:]]
    fix_coast_multi(path, fill_colors)
