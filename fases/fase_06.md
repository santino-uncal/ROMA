# Fase 6 — Medallones de cónsules del -450 al -400 a.C. + título de la página

**Fecha:** 2026-08-30
**Commits:** `52f89a6` … `85b0cad` (26 commits)

## Punto de partida

La Fase 5 dejó los medallones hechos hasta el -451 a.C. y quedaba pendiente el `git push`
(no se había hecho desde `a6762d3`). Esta fase empezó pusheando todo lo de la Fase 5 y
siguió el flujo desde el -450 ("Segundo Decenvirato").

## Qué se hizo

### Medallones de `js/datos.js` (era `republica`), del -450 al -400 a.C.

- **-450 "Segundo Decenvirato"** (sin nombres en el título): medallón único para
  Apio Claudio Craso (`A. C. Craso` / `A. C. C.`, reusado del -451), como el dictador
  Tito Larcio del -501.
- **-449 a -427**: un año por commit (23 commits), con verificación en el server local
  cada uno.
- **-426 a -400**: un solo commit (`e783285`) a pedido del usuario ("hacé lo mismo desde
  el -426 hasta el -400"). 27 años.
- **Años de tribunos consulares con 3+ nombres**: medallones solo para los **dos primeros**
  de la lista (decisión del usuario en el -444).
- **Ninguno sumó foto nueva.** Todos con círculo de abreviación. Próximo archivo de imagen
  libre sigue siendo `retrato-12.jpg`.
- Cache-busting de `index.html`: de `?v=50` a `?v=75`.

### Praenómenes raros — regla nueva del usuario (2026-08-30)

No se abrevian: van **enteros en el `label` (pie)** siempre; en el `abbr` (círculo) van
enteros salvo que toquen/pasen el borde, y ahí caen a inicial.

| Praenomen | Pie | Círculo |
|-----------|-----|---------|
| Lars (-448) | `Lars H. Coritinesano` | `Lars H. C.` (entra) |
| Postumo (-442) | `Postumo E. H. Cornicén` | `P. E. H. C.` (no entra) |
| Mamerco (-438, -403…) | `Mamerco E. Mamercino` | `M. E. M.` (no entra) |
| Hosto (-429) | `Hosto L. Tricipitino` | `H. L. T.` (rozaba el borde; el usuario lo pidió) |
| Numerio (-421, -415, -407) | `Numerio F. Vibulano` | `N. F. V.` (no entra) |
| Cneo (-414, -409, -406, -404, -401) | `Cneo C. Coso` | `Cneo C. C.` (entra, 4 letras como Lars) |

Los praenómenes comunes se siguen abreviando a inicial en todos lados
(incl. "Tiberio" → `T.`, "Agripa" → `A.`, "Próculo" → `P.`, "Manio" → `M.`).

### Otros criterios aplicados

- **Cónsul repetido**: se reusa su `label`/`abbr` exacto.
- **Homónimo descendiente**: aunque el ancestro tenga retrato (p. ej. Agripa Menenio
  Lanato del -503 = retrato-11), el descendiente va con abbr (`A. M. Lanato` / `A. M. L.`
  en -439, -419, -417).
- **Título sin un cognomen que sí lleva el personaje** (-412 "Cayo Furio Pacilo" sin
  "Fuso"): se sigue el título → `C. F. Pacilo` / `C. F. P.` (mismo criterio que el -496).
- **Doble cognomen**: todo a inicial salvo el último apellido.

### Título de la página (`index.html:6`)

`<title>` cambiado de `SPQR â€” Historia de Roma` (con mojibake en el guion) a
**`La historia de Roma`**. El botón "SPQR" de la cabecera no se tocó.

## Verificación

Cada año (o lote) se probó en el server local `roma` (`.claude/launch.json`, puerto 8777):
se navegó a la ficha con el buscador "Ir al año", se comprobaron los pies y las
abreviaciones de los dos medallones, que el `abbr` no desborde el círculo (~44 px) y cero
errores de consola. El -426..-400 se validó además parseando `js/datos.js` con `py` (482
entradas de `republica`, JSON OK) y revisando 27 años uno por uno en el navegador.

## Estado al cerrar

Todo commiteado y **pusheado a `origin/master`** hasta `85b0cad`. Working tree limpio
salvo este `fase_06.md`.

## Pendiente / próximos pasos

- **-399 a.C. en adelante**: seguir con los medallones (tramo de tribunos consulares y
  guerra de Veyes). El -399 es "Tribunos consulares Cneo Genucio Augurino, Cayo Duilio
  Longo, …" → dos primeros.
- Automatizar el `?v=N` de cache-busting (sigue a mano; ya va en 75).
