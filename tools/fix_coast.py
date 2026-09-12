"""
Rellena el borde anti-aliased que el cubo de relleno de Paint deja sin pintar
en la costa (pixeles "mezcla" entre el color de tierra/mar y el color pintado).

Uso:
    python tools/fix_coast.py "assets/Imperio bizantino 976.bmp" "assets/Imperio bizantino 976.bmp" 63,72,204

El tercer argumento es el color de relleno (R,G,B) que usaste en Paint.
Sobrescribe el archivo de salida si coincide con el de entrada.
"""
import sys
import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation


def fix_coast(input_path, output_path, fill_color, pure_threshold=2000, max_iter=8):
    im = Image.open(input_path).convert("RGB")
    arr = np.array(im)
    h, w, _ = arr.shape

    flat = arr.reshape(-1, 3)
    colors, inverse, counts = np.unique(flat, axis=0, return_inverse=True, return_counts=True)
    count_per_pixel = counts[inverse].reshape(h, w)

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
    out = arr.copy()
    out[new_pixels] = fill
    print(f"{input_path}: recolored {new_pixels.sum()} fringe pixels")

    Image.fromarray(out).save(output_path)


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Uso: python fix_coast.py <entrada.bmp> <salida.bmp> <R,G,B>")
        sys.exit(1)
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    fill_color = tuple(int(c) for c in sys.argv[3].split(","))
    fix_coast(input_path, output_path, fill_color)
