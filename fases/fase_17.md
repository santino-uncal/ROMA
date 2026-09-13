# Fase 17 — Cada mapa bizantino/occidente en la ficha de su propio nombre

**Fecha:** 2026-09-13

## Punto de partida

Tras la Fase 15 (renombrado de archivos agregando nombre de emperador), el usuario notó
que muchos de esos mapas no estaban en la ficha del emperador que llevan en el nombre.
Investigando se confirmó: es un patrón preexistente desde la Fase 11 (mucho antes de esta
sesión), no algo introducido por las fases anteriores de hoy. El diseño original mostraba,
en la ficha de cada emperador, el territorio **al asumir** (heredado del predecesor), y el
mapa real fechado al **final** de un reinado (ej. año de su muerte/deposición) terminaba
usado en la ficha del **sucesor**. Al ponerle nombre a los archivos (Fase 15), esa
asimetría quedó visible.

## Cambio

Se identificaron 28 emperadores cuyo nombre aparece en un archivo que no está en su propia
ficha. Para cada uno se **agregó** (sin tocar ni quitar nada de las fichas de los
sucesores, que ya tenían captions propios y correctos) un `mapaEspecial` con:
- `url`: el archivo que lleva su nombre.
- `caption`: nuevo, redactado a medida, describiendo el territorio **al morir/ser
  depuesto** ese emperador — reutilizando los hechos de su propio campo `texto` y la
  descripción territorial ya presente en el caption del sucesor (mismo año, misma
  fotografía del imperio, solo narrada desde el otro extremo del reinado).

Lista completa (26 reemplazaban un caption "disclaimer" que ya tenían, 2 no tenían
`mapaEspecial` en absoluto — Justino II y Constantino IX Monómaco):

Miguel VII Ducas, Alejo I Comneno, Isaac II Ángelo, Alejo III Ángelo, Juan III Ducas
Vatatzés, Juan IV Láscaris (el archivo dice "Juan VI Lascaris.png" por un typo del
usuario al nombrarlo, pero corresponde al año 1261 = Juan IV), Andrónico II Paleólogo,
Andrónico III Paleólogo, Manuel II Paleólogo, Justino II, Mauricio, Focas, Heraclio,
Leoncio, Justiniano II, Constantino V, León IV, Constantino VI, Irene de Atenas, Teófilo,
Miguel III, León VI, Constantino VII, Romano II, Constantino IX Monómaco (imperio); y en
`occidente`: Valentiniano III, Mayoriano, Glicerio.

**Nota:** el archivo `bizantino-1376-Andronico IV y Juan V .png` (nombre compuesto) YA
estaba correctamente en la ficha de Andrónico IV Paleólogo — no necesitó cambios, aunque
apareció como falso positivo en el chequeo automático por tener dos nombres en el archivo.

Cache-busting: `datos.js` `?v=109` → `?v=110` en `index.html`.

## Verificación

- JSON válido; 0 cambios en `periodo`/`nombre`/`texto`/`imagen` de ninguna entrada.
- Las rutas de imagen local en `datos.js` existen todas en disco.
- Servidor local `roma`: Justino II, Constantino IX Monómaco y Juan IV Láscaris cargan
  cada uno su propio mapa (200 OK); sin errores de consola.

## Estado al cerrar

`js/datos.js` e `index.html` modificados, sin commitear todavía.
