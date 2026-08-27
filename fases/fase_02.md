# Fase 2 — Retratos de Bruto y Colatino solo en el 509 a.C.

**Fecha:** 2026-08-27
**Commit(s):** `a640c0a`

## Punto de partida

En la vista de la República, los retratos de Lucio Junio Bruto y Lucio Tarquinio
Colatino (con foto, nombre y círculo dorado) aparecían en **todos** los años una vez
que se visitaba el 509 a.C., en lugar de mostrarse únicamente en ese año.

## Diagnóstico

- Solo la entrada `-509` de `js/datos.js` tiene el array `imagenes` (los dos retratos
  con label). El resto de los años no.
- `renderPortrait()` en `js/app.js` ya ocultaba los grupos agregándoles la clase
  `hidden` (`leftGroup.classList.add('hidden')` / `rightGroup...`).
- Pero en `css/estilos.css` solo existía `.portrait-circle.hidden{ display:none; }`.
  Los dos retratos con nombre viven dentro de un `.portrait-mini-group`, que no tenía
  regla para `.hidden`, así que la clase no tenía efecto y `display:flex` los dejaba
  visibles.

## Qué se hizo

- Se agregó una sola línea a `css/estilos.css`:
  `.portrait-mini-group.hidden{ display:none; }`

## Verificación

Probado en navegador (servidor local, vista República):
- **509 a.C.** → se ven las dos fotos con "L. J. Bruto" y "L. T. Colatino".
- **508 a.C. / 507 a.C.** → foto, nombre y círculo desaparecen por completo
  (`display: none`).

## Estado al cerrar

Corregido y commiteado en `master`. Sin cambios pendientes en el working tree.

## Pendiente / próximos pasos

- Sin tareas abiertas. El usuario definirá la mejora de la Fase 3.
