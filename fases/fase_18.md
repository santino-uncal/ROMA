# Fase 18 — Constantino VIII a Zoe y Teodora heredan el mapa de Basilio II

**Fecha:** 2026-09-13

## Punto de partida

De los 6 emperadores sin `mapaEspecial` propio que quedaron tras la Fase 17, el usuario
pidió darles el mismo mapa que Basilio II "el Matabúlgaros". Se le hizo notar que
Justiniano I (527–565) queda ~450 años antes de Basilio II (976–1025): ponerle ese mapa
sería un anacronismo, a diferencia de los otros 5 (1025–1042), que son sus sucesores
inmediatos. El usuario confirmó: solo esos 5, Justiniano I queda aparte.

## Cambio

Se agregó `mapaEspecial` (antes ausente) a Constantino VIII, Romano III Argiro, Miguel IV
"el Paflagonio", Miguel V "Calafates" y Zoe y Teodora, todos con:
- `url`: `assets/img/bizantino-1025-Basilio II.png` (mismo archivo que Basilio II).
- `caption`: redactado a medida para cada uno, "heredado de Basilio II, sin cambios",
  incorporando el hecho puntual de su propio reinado (revuelta en Bulgaria sofocada por
  Miguel IV, derrota en Siria de Romano III, etc.), en el mismo estilo que el resto del
  sitio.

Justiniano I queda sin `mapaEspecial` (fallback genérico), sin resolver por ahora.

Cache-busting: `datos.js` `?v=110` → `?v=111` en `index.html`.

## Verificación

- JSON válido; sin cambios fuera de los 5 `mapaEspecial` agregados.
- Rutas de imagen local en `datos.js` existen todas en disco.
- Servidor local `roma`: Miguel V carga `bizantino-1025-Basilio II.png` con su caption
  propio; sin errores de consola (los `ERR_CONNECTION_REFUSED` iniciales fueron del
  instante de transición entre servidores, resueltos con el reintento).

## Estado al cerrar

Todo commiteado.
