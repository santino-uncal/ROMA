# Fase 21 — Estandarte interactivo: historia del águila legionaria y cuadro de emblemas

**Fecha:** 2026-09-13 / 2026-09-14

## Resumen

El Estandarte.png del encabezado (`assets/img/Estandarte.png`, lado izquierdo) ahora es
interactivo igual que la cruz: al tocarlo (click o Enter/Espacio con foco de teclado) abre
un modal (`#estandarteModalOverlay` / `#estandarteModalBox` en `index.html`) con la historia
del águila legionaria:

1. **Antes de Mario (s. IV–II a.C.)** — los cinco signa que menciona Plinio: lobo, minotauro,
   caballo, jabalí y águila.
2. **La reforma de Mario (104 a.C.)** — unificación del águila de plata como estandarte único,
   con retrato de Cayo Mario (`assets/img/retratos/retrato-129.jpg`).
3. **Carrhae (53 a.C.) y Teutoburgo (9 d.C.)** — pérdida de águilas, con retrato de Craso
   (`retrato-132.jpg`).
4. **La recuperación (20 a.C.–41 d.C.)** — Augusto y Germánico, con retrato de Augusto
   (`retrato-14.jpg`).
5. **Un símbolo que perdura** — legado del águila romana, con el ícono `spqr-aguila.png`.
6. **El emblema propio de cada legión** — cuadro final con el emblema de cada legión imperial.

Mismo patrón de apertura/cierre que el modal de la cruz (botón ✕, Escape, click afuera),
agregado en `js/app.js` (sección "Modal informativo del águila legionaria"). CSS en
`css/estilos.css`: se extendió el selector `.cruz-icon` a `.cruz-icon, .estandarte-icon`
para compartir el hover dorado.

## El cuadro de emblemas de las legiones

Iteración larga con el usuario:

1. Primer intento: grilla HTML propia con 18 símbolos genéricos (emoji + lista de legiones)
   — **descartada**.
2. El usuario pasó una infografía de Instagram (`@roma_spqr753`) con estandartes, fechas y
   provincias — se usó un tiempo, con upscale Lanczos + unsharp mask (Pillow) y lightbox de
   zoom al tocar la imagen.
3. El usuario creó la carpeta `emblemas Legiones/` en la raíz del proyecto y fue subiendo
   imágenes individuales (una por legión, estilo consistente: fondo rojo, toro/animal dorado,
   marco con corchetes dorados, "LEG · N" arriba y cognomen abajo). Se **reemplazó** la imagen
   de Instagram por un cuadro propio armado con estas imágenes (`ImageOps.fit` a celdas
   cuadradas de 320px, grilla de 6 columnas, fondo pergamino `#ede4d3` entre celdas),
   guardado en `assets/img/legiones-emblemas.jpg`.
4. Se fue ampliando de 19 → 33 → 34 legiones a medida que el usuario agregaba archivos a la
   carpeta. **Detectado un error del usuario:** `Legio XVII Claudia.jfif` contenía en realidad
   la imagen de la Legio VII duplicada (mal nombrada) — se excluyó del cuadro en su momento
   (la XVII, aniquilada en Teutoburgo, no tiene emblema propio documentado, así que la
   ausencia es coherente con el texto del modal). El usuario después sacó ese archivo de la
   carpeta.
5. **Corrección de color a pedido del usuario** sobre 4 emblemas específicos (procesamiento
   HSV con Pillow/numpy, script ad-hoc no guardado en el repo):
   - `Legio I Germanica.jfif` y `Legio VIII Augusta.jfif`: toro muy oscuro/mate → se aclaró
     brillo y saturación solo en los píxeles dorados (máscara por tono), sin tocar el fondo.
   - `Legio VI Victrix.jfif`: bordes (margen antes del corchete) el doble de grandes que el
     resto → se recortó el margen sobrante arriba/abajo y se reescaló 1.5x con Lanczos.
   - `Legio X Gemina`: toro amarillo pálido sobre fondo violáceo → primer intento con shift de
     tono tuvo un bug de wraparound (generó un fleco cian alrededor del toro/texto), detectado
     al revisar antes de aplicar y corregido con blend circular de tono antes de guardar.
     Finalmente el usuario subió `Legio X Gemina.png`, una versión ya con los colores
     correctos, y se usó esa en vez de seguir retocando la `.jfif` (que se borró).
6. Se agregó por último `Legio XXX Ulpia Victrix.jfif` (emblema: capricornio).

**Estado final:** `assets/img/legiones-emblemas.jpg` es un cuadro de **34 legiones**
(6 columnas x 6 filas, última fila con 4 celdas y 2 vacías), reconstruido con un script
Python (Pillow, no versionado) cada vez que se agregó o corrigió una imagen en
`emblemas Legiones/`. La imagen tiene su propio lightbox de zoom (click/tap la agranda a
pantalla casi completa, `#legionesLightboxOverlay`).

## Notas técnicas

- Cache-busting: `estilos.css` llegó a `?v=117`, `app.js` a `?v=111` en `index.html`. La
  imagen `legiones-emblemas.jpg` usa su propio querystring incremental (`?v=5` al cerrar)
  porque el nombre de archivo no cambia entre versiones.
- Python usado para todo el procesamiento de imágenes:
  `C:\Users\munca\AppData\Local\Programs\Python\Python310\python.exe` (el `python`/`python3`
  del PATH de git-bash son el stub de Microsoft Store, no sirven). Librería: Pillow 12.3.0 +
  numpy.
- Se limpiaron archivos temporales `_check_*.png` en `assets/img/` que habían quedado de las
  pasadas de verificación visual (no deben commitearse; si aparecen en `git status` al
  retomar, son basura de sesión, borrar).
- `assets/Legiones-emblemas.png` (captura original de Instagram, en la raíz de `assets/`, NO
  en `assets/img/`) se borró tras el reemplazo por el cuadro propio.

## Estado al cerrar

Commiteado en esta sesión: `css/estilos.css`, `index.html`, `js/app.js`,
`assets/img/legiones-emblemas.jpg`, la carpeta `emblemas Legiones/` completa (34 imágenes) y
este archivo de fase.

**Sin tocar / ajenos a esta sesión:** `assets/img/Instagram.html` y
`assets/img/Instagram_files/` siguen sin trackear (no se commitearon, igual que en fases
anteriores).

**Si se retoma el cuadro de legiones:** el script de montaje (lista `order` con los 34
nombres de archivo, celda 320px, grilla 6 cols) no quedó guardado como archivo — hay que
rehacerlo desde cero o pedir el historial de esta fase. Legiones imperiales conocidas que
podrían faltar si el usuario sigue agregando: XIV Gemina Martia Victrix (con agnomen
completo), II Adiutrix, IV Scythica, VII Gemina, entre otras del listado de Wikipedia
"List of Roman legions" citado en la Fase 20/21.
