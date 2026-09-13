# Fase 14 — Corrimiento de mapaEspecial: atribuir el mapa al emperador que lo logró

**Fecha:** 2026-09-13

## Punto de partida

El usuario notó un problema de atribución: al ver el mapa especial de un emperador (ej.
Tiberio), el caption describía territorio conquistado por su predecesor (Augusto), pero
al estar bajo el nombre de Tiberio daba a entender que las conquistas eran suyas.

## Cambio

Se corrió el bloque `mapaEspecial` completo (`url` + `credit` + `caption`) una posición
hacia el emperador siguiente, en las tres listas de `js/datos.js` (`imperio`, `occidente`,
`bizantino`), procesadas cada una por separado:

- El caption ya nombra correctamente al emperador que logró/heredó ese territorio (ej.
  "El Imperio bajo Augusto..."), así que al aparecer bajo la ficha del sucesor queda claro
  que fue el antecesor quien lo alcanzó, sin reescribir texto.
- **Augusto** (primer emperador, sin antecesor en los datos) queda sin `mapaEspecial`;
  su ficha cae al fallback genérico por año de `getMapForEntry` en `js/app.js`.
- **Honorio** y **Arcadio** (primeras entradas de `occidente` y `bizantino` tras la
  división del 395) se dejaron intactos: su `mapaEspecial` ya describe el reparto
  administrativo del 395 de forma neutral (no atribuye conquistas), así que no
  correspondía corrérselo ni vaciarlo.
- **~40 entradas "disclaimer"** (captions que ya dicen "No hay un mapa específico para
  X..." o "Referencia: ...", detectadas con variantes como "verificado", "por falta de",
  "por no haber") quedaron **excluidas de la cadena de corrimiento**: no reciben ni donan
  mapa, porque ya son honestas sobre no tener mapa propio — correrlas producía captions
  sin sentido (ej. Manuel II Paleólogo terminando con el disclaimer de un usurpador
  distinto, Juan VII, de 35 años antes).

Implementado con un script Perl (`shift_maps_v3.pl`, en el scratchpad de la sesión, no
commiteado) que parsea las 3 listas por líneas, clasifica cada entrada en
"own"/"disclaimer" según el caption, y aplica el corrimiento solo dentro del grupo "own"
de cada lista.

Cache-busting: `datos.js` `?v=105` → `?v=106` en `index.html`.

## Verificación

- JSON válido tras el cambio (137 `mapaEspecial` activos, era 138; 96 captions corridas).
- Sin cambios en `periodo`/`nombre`/`texto`/`imagen` de ninguna entrada (verificado
  comparando original vs. resultado campo por campo).
- Servidor local `roma` (puerto 8777): Tiberio muestra el mapa y caption de Augusto
  ("El Imperio bajo Augusto...", imagen `SPQR Augusto.png` cargando 200 OK); Augusto
  muestra el fallback genérico de Trajano con aclaración; Juan VIII Paleólogo muestra
  el caption de Andrónico IV; Manuel II Paleólogo conserva su propio disclaimer intacto.

## Estado al cerrar

Cambios en `js/datos.js` e `index.html` sin commitear todavía.
