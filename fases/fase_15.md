# Fase 15 — Actualizar `datos.js` tras el renombrado de mapas del usuario

**Fecha:** 2026-09-13

## Punto de partida

El usuario renombró, fuera de esta sesión, varios archivos en `assets/img/`. `js/datos.js`
seguía apuntando a los nombres viejos, así que había que actualizar las referencias.

## Cambios detectados y aplicados

Usando `git status`/hash-matching sobre `assets/img/` (staging temporal con `git add -A`
solo para que git detectara los renames, sin commitear) se identificaron 4 tipos de cambio:

1. **43 renames limpios** (mismo contenido, verificado por hash): 36 mapas bizantinos y 6
   de occidente ganaron el nombre del emperador (`bizantino-1025.png` →
   `bizantino-1025-Basilio II.png`, etc.), más `SPQR Comodo.png` → `SPQR Marco Aurelio.png`.
   Se actualizaron las 89 referencias correspondientes en `js/datos.js` con un script Perl
   de reemplazo literal (`apply_renames.pl`, scratchpad, no commiteado).
2. **`SPQR Tiberio.png` borrado**, pero su contenido (mismo hash) ahora vive en
   `SPQR Augusto.png`. Las 3 entradas que referenciaban el nombre viejo (Tiberio, Calígula,
   Claudio — resultado del corrimiento de la Fase 14) se corrigieron a `SPQR Augusto.png`.
3. **`SPQR Tito.png` es un archivo nuevo**, sin correspondencia previa (mapa que muestra el
   Imperio con Britania incluida, distinto de cualquier mapa existente). El usuario confirmó
   asignárselo a Tito. Seguí la convención de la Fase 14 (cada ficha muestra el logro del
   *antecesor*, no el propio): la ficha de **Domiciano** pasó a mostrar
   `SPQR Tito.png` con un caption nuevo sobre el reinado de Tito (sin cambios territoriales
   respecto a Vespasiano, erupción del Vesubio, Coliseo). La ficha de Tito no se tocó —
   sigue mostrando el logro de Vespasiano, igual que antes.
4. Los 25 mapas de la República en `assets/` (raíz) y los 34 `.bmp` sueltos en
   `assets/img/` (`Imperio bizantino <año>.bmp`, sin trackear desde antes de esta sesión)
   no fueron tocados — no correspondían a este pedido.

Cache-busting: `datos.js` `?v=106` → `?v=107` en `index.html`.

## Verificación

- JSON válido tras cada cambio.
- Las 50 rutas de imagen local referenciadas en `datos.js` existen en disco (0 rotas).
- Servidor local `roma`: Domiciano carga `SPQR Tito.png` (200 OK) con el caption nuevo;
  Basilio II carga `bizantino-963-Romano II.png` (200 OK); sin errores de consola.

## Estado al cerrar

Cambios en `js/datos.js`, `index.html` y los renames/`SPQR Tito.png`/`SPQR Augusto.png` en
`assets/img/` sin commitear todavía.
