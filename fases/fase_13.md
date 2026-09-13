# Fase 13 — Integración de 25 mapas propios de la República en `HITOS_REPUBLICA`

**Fecha:** 2026-09-12

## Punto de partida

El usuario subió a `assets/` (no `assets/img/`) 25 mapas propios de la República Romana,
nombrados con el rango de años que cubre cada uno (numeración a.C., ej. `31-27.png` =
años -31 a -27). Uno de ellos originalmente era un archivo suelto `338.png`; el usuario lo
corrigió a mitad de sesión, reemplazándolo por `434 - 341.png` y `341-335.png` (el año 338
a.C., disolución de la Liga Latina, quedó como límite entre esas dos franjas en vez de
mapa propio de un solo año).

## Cambio

`HITOS_REPUBLICA` en `js/mapas.js` usaba hasta ahora 10 franjas con mapas genéricos de
Wikimedia Commons (`CONQUISTA_ITALIA`, `REPUBLICA_60AC`, `REPUBLICA_44AC`) — el mismo
mecanismo de fallback por rango de años que ya usa `getMapForEntry` en `js/app.js` para
todas las eras cuando una entrada no tiene `mapaEspecial` propio.

Se reemplazaron esas 3 constantes y las 10 franjas por:

- 25 constantes `REP_<desde>_<hasta>` apuntando a los archivos del usuario en `assets/`
  (`credit: 'Imagen provista por el usuario'`).
- 25 franjas en `HITOS_REPUBLICA`, cubriendo sin huecos desde -509 (fundación de la
  República) hasta -27 (Augusto), con un caption redactado a medida por franja explicando
  el evento histórico relevante (guerras samnitas, guerras púnicas, guerras civiles,
  etc.), en el mismo estilo que las eras Imperio/Occidente/Bizantino.

No se tocó `HITOS_MONARQUIA` (previa a -509) ni ninguna entrada de `js/datos.js` — a
diferencia de la integración de mapas SPQR del Imperio (Fase 12), acá el nivel de
mapaEspecial por entrada no aplicaba: los mapas del usuario ya vienen definidos por rango
de años, que es exactamente el nivel de `HITOS_REPUBLICA`.

Cache-busting: `mapas.js` `?v=102` → `?v=103` en `index.html`.

## Verificación

Servidor local `roma` (puerto 8777): año -509 carga `509 - 500.png` (200 OK), año -340
carga `341-335.png`, año -30 carga `31-27.png` — los tres límites de franja probados
resuelven al mapa correcto.

## Estado al cerrar

Todo commiteado (`b1a69e6`).
