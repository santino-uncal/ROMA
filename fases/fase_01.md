# Fase 1 — Ordenar el proyecto

**Fecha:** 2026-08-27
**Commit(s):** `586fa7a`

## Punto de partida

Un único archivo `roma_linea_de_tiempo_con_mapas (4).html` (~1 MB) con todo mezclado:
estilos, datos históricos, lógica y 14 imágenes embebidas en base64. Cada cambio obligaba
a mover el HTML completo por el chat.

## Qué se hizo

- Se separó el HTML monolítico en una estructura de archivos:
  - `index.html` — solo el marcado
  - `css/estilos.css` — estilos y paleta
  - `js/datos.js` — `window.ROMA_DATA` (contenido histórico por era)
  - `js/mapas.js` — hitos territoriales / mapas por rango de años
  - `js/app.js` — lógica de la línea de tiempo
- Se extrajeron las 14 imágenes base64 a archivos reales en `assets/img/` y `assets/img/retratos/`.
- Se inicializó **git** con un primer commit.
- Se agregaron `README.md`, `.gitignore` y `.claude/launch.json` (servidor local con Python).
- Se guardó `_original_monolitico.html` como copia de referencia del archivo de partida.
- Se verificó en navegador que la página funciona igual que antes (línea de tiempo, fichas,
  mapas, retratos, tema bizantino), sin errores de consola.

## Acuerdos de trabajo

- Una sesión nueva por cada mejora o tema; no una sesión eterna.
- No se intercambian archivos `.html` por el chat: se trabaja sobre los archivos del repo.
- Al cerrar cada sesión se escribe un `fases/fase_N.md` con el resumen y se hace commit.

## Estado al cerrar

Proyecto funcional y versionado. Listo para empezar a agregar mejoras.

## Pendiente / próximos pasos

- Sin tareas abiertas. El usuario definirá la mejora de la Fase 2.
- (Opcional) borrar de `Downloads` las versiones viejas `roma_linea_de_tiempo*.html`
  cuando haya confianza en la nueva estructura.
