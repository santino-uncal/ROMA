# Fase 16 — Deshacer el corrimiento de mapaEspecial (Fase 14)

**Fecha:** 2026-09-13

## Punto de partida

El usuario pidió primero "a Augusto ponele el mismo mapa que Tiberio" (restaurarle su
propio mapa, perdido en la Fase 14 por ser el primer emperador sin antecesor), y a los
pocos minutos generalizó: "mover todos los mapas un emperador para atrás". Confirmado con
una pregunta explícita: quería deshacer por completo el corrimiento de la Fase 14, volviendo
a que cada ficha muestre su propio logro (no el del antecesor).

## Cambio

Se restauró, para las tres listas (`imperio`, `occidente`, `bizantino`), el `mapaEspecial`
original de cada entrada tal como estaba **antes** de la Fase 14 (commit `58403de`, el
padre de `eeb16b1`), pero traduciendo las URLs a los nombres de archivo actuales (los
renombrados por el usuario en la Fase 15). Implementado con un script Perl
(`undo_fase14.pl`, scratchpad, no commiteado) que:

1. Parsea el `datos.js` de antes de la Fase 14 (extraído de git) y el actual, entrada por
   entrada, en las tres listas.
2. Para cada entrada, toma el `mapaEspecial` original (url/credit/caption) y traduce la
   URL con el mismo mapa de renames de la Fase 15.
3. Sobrescribe el `mapaEspecial` actual con el original traducido.

**Dos excepciones al calco directo:**
- **Tito**: en vez de su URL original (`SPQR Neron.png`, heredada), se le asignó
  `SPQR Tito.png` — el mapa nuevo que el usuario agregó en la Fase 15. Con la Fase 14
  deshecha, el criterio de "cada ficha muestra su propio logro" vuelve a aplicar, así que
  el mapa dedicado de Tito corresponde a su propia ficha (no a la de Domiciano, como se
  había decidido en la Fase 15 para mantener consistencia con la Fase 14).
- **Domiciano**: recuperó su propio caption original ("El Imperio bajo Domiciano..."),
  perdiendo la asignación de `SPQR Tito.png` que se le había dado en la Fase 15 (por la
  razón anterior).

Todo lo demás (Honorio/Arcadio, las ~40 entradas "disclaimer", las 8 sin mapa) no cambió,
porque la Fase 14 nunca las había tocado — restaurar el original ahí es una operación nula.

Cache-busting: `datos.js` `?v=107` → `?v=109` en `index.html` (pasando por el fix puntual
de Augusto en `?v=108`).

## Verificación

- JSON válido; 0 diferencias en campos fuera de `mapaEspecial` (`periodo`/`nombre`/`texto`/
  `imagen` idénticos comparando antes/después de esta fase).
- Las rutas de imagen local en `datos.js` existen todas en disco.
- Servidor local `roma`: Augusto carga `SPQR Augusto.png` con su propio caption; Tito carga
  `SPQR Tito.png`; sin errores de consola.

## Estado al cerrar

`js/datos.js` e `index.html` modificados, sin commitear todavía.
