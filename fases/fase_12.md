# Fase 12 — Fix de costa jaspeada por anti-aliasing en mapas pintados

**Fecha:** 2026-09-12
**Commits:** `5e8797b`, `d784426`, `4b42ae8`, `60fe3f1`, `2d22095`

## Punto de partida

El usuario venía pintando a mano en Paint, con el cubo de relleno, el territorio de
distintos imperios sobre mapas base (tierra gris, mar blanco o negro según el archivo).
Reportó un problema visual: al hacer zoom se veía la costa "jaspeada" — una franja de
píxeles sin pintar justo en el borde entre tierra y mar (o entre el territorio pintado y
la tierra vecina no pintada).

## Causa

Los mapas base tienen anti-aliasing en los contornos (1-2 píxeles de color intermedio,
mezcla entre el gris de tierra y el blanco/negro de mar). El cubo de Paint solo rellena
píxeles de color exactamente igual al que se clickea, así que esos píxeles mezcla no
matchean ni con el color de tierra ni con el de relleno, y quedan sin pintar.

## Solución: `tools/fix_coast.py` y `tools/fix_coast_multi.py`

Script en Python (numpy + scipy) que:

1. Cuenta cuántas veces aparece cada color exacto en la imagen. Los colores "puros"
   (tierra, mar, relleno) aparecen millones de veces; los píxeles de anti-aliasing
   aparecen solo unas pocas decenas o cientos de veces cada uno (son parte de una línea
   fina de 1px).
2. Marca como "impuro" todo píxel por debajo de un umbral de frecuencia (2000 por
   defecto).
3. Hace crecer (dilatación morfológica, 8-conectividad) la máscara del color de relleno
   pisando únicamente píxeles impuros, iterando hasta que no quede nada más por
   consumir.

Esto limpia exactamente la franja de anti-aliasing pegada al territorio ya pintado, sin
tocar ninguna otra zona del mapa (tierra sin pintar, mar, u otro territorio no
adyacente). `fix_coast_multi.py` es la misma lógica pero admite varios colores de
relleno en la misma imagen (para mapas con más de un imperio, ej. secesiones).

Verificado visualmente antes/después sobre `Imperio bizantino 976.bmp`: la costa quedó
sin motas, tanto en el borde tierra/territorio como en el borde territorio/mar.

## Qué se corrigió esta sesión

- **36 mapas del Imperio Bizantino** (`Imperio bizantino <año>.bmp`, subidos sueltos a
  `assets/` por el usuario, años 578-1425): ~78.300 píxeles de costa corregidos en
  total. Commit `5e8797b`.
- Los `.bmp` originales se movieron después de `assets/` a `assets/img/` (mismo criterio
  que Fase 11: los `.bmp` crudos no se versionan, solo los `.png` procesados).
  Commit `d784426` saca del tracking los 36 archivos en su ubicación vieja.
- **10 mapas de emperadores romanos** (`SPQR <emperador>.png`, Augusto a Aureliano):
  ~407.600 píxeles corregidos. Dos de ellos (Valeriano y Claudio II el Gótico) tienen
  tres colores de territorio (rojo Roma, verde Imperio Galo, amarillo Imperio de
  Palmira) por la Crisis del Siglo III. Commit `4b42ae8`.

## Segunda parte: integración en `js/datos.js`

A pedido del usuario ("integrá los mapas SPQR en datos.js"), se agregó el campo
`mapaEspecial` a las 10 entradas de `imperio` correspondientes (mismo mecanismo que
`getMapForEntry` en `js/app.js` ya usa para Occidente y Bizantino desde la Fase 11), vía
el mismo patrón de script Python con roundtrip JSON verificado antes de tocar nada.

- **Augusto, Tiberio**: mapa sin Britania (recién sería conquistada por Claudio en el 43
  d.C.).
- **Claudio, Nerón, Adriano, Cómodo, Heliogábalo**: mapa con Britania ya incorporada,
  fronteras estables del Alto Imperio.
- **Valeriano, Claudio II el Gótico**: mapa de tres colores (rojo núcleo romano, verde
  Imperio Galo con Britania/Galia/Hispania, amarillo reino de Palmira de Zenobia con
  Siria/Egipto/Levante), reflejando la fragmentación de la Crisis del Siglo III.
- **Aureliano**: mapa reunificado (todo en rojo, Britania incluida), tras recuperar el
  Imperio Galo y vencer a Zenobia.

Se comprobó visualmente que las 10 imágenes comparten la misma silueta base del Alto
Imperio y que la única diferencia real entre ellas es la presencia/ausencia de Britania
y, en los dos casos de la Crisis del Siglo III, la partición en tres colores — no hay
diferencias en Dacia ni otras fronteras internas entre los mapas.

Probado en navegador (servidor local `roma`, puerto 8777): Augusto, Valeriano y
Aureliano cargan su mapa específico (200 OK) con el caption correcto.

Cache-busting: `?v=102` → `?v=103`.

Commit `2d22095`.

## Pendiente

Ninguna otra entrada del Imperio (Calígula, Trajano, Marco Aurelio, Diocleciano, etc.)
tiene mapa propio todavía — siguen con el hito genérico `HITOS_IMPERIO`. El usuario no
pidió esto todavía; queda como posible trabajo futuro si sube más mapas.

## Estado al cerrar

Todo commiteado (`5e8797b`, `d784426`, `4b42ae8`, `60fe3f1`, `2d22095`).
