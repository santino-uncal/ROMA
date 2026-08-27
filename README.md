# SPQR — Historia de Roma

Línea de tiempo interactiva, de Rómulo a la caída de Constantinopla.

## Cómo verlo

- **Rápido:** doble clic en `index.html`.
- **Con servidor local** (recomendado si algo no carga bien):
  ```bash
  python -m http.server 8777
  ```
  y abrir http://localhost:8777

## Estructura del proyecto

| Archivo | Qué contiene | Cuándo tocarlo |
|---|---|---|
| `index.html` | El esqueleto de la página: encabezado, tablas de conflictos, contenedores. | Cambios de maquetación / estructura. |
| `css/estilos.css` | Todos los estilos y la paleta de colores (`:root` y `body.byz-theme`). | Colores, tipografías, espaciados, responsive. |
| `js/datos.js` | `window.ROMA_DATA`: el contenido histórico de cada era (monarquía, república, imperio, occidente, bizantino). | Agregar/corregir personajes, años o textos. |
| `js/mapas.js` | Hitos territoriales: qué mapa se muestra en cada rango de años y su epígrafe. | Cambiar mapas o los tramos de años que cubren. |
| `js/app.js` | La lógica: arma la línea de tiempo, la ficha, los botones y la navegación. | Comportamiento e interacción. |
| `assets/img/` | Imágenes de la interfaz y los mapas propios. | — |
| `assets/img/retratos/` | Retratos de los reyes y cónsules (`retrato-01.jpg` … `retrato-09.jpg`). | Reemplazar un retrato = pisar el archivo con el mismo nombre. |

Orden de carga en `index.html`: `datos.js` → `mapas.js` → `app.js` (no cambiarlo).

## Historial de versiones

Este proyecto usa **git**. Cada cambio importante queda guardado y se puede volver atrás.
No hace falta guardar copias `roma_v2.html`, `roma_final.html`, etc.

```bash
git log --oneline        # ver la historia
git add -A && git commit -m "descripción del cambio"
git restore .            # descartar cambios no guardados
```
