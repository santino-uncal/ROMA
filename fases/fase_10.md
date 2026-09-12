# Fase 10 — Buscador de reyes/emperadores en todas las eras + mapas por emperador en Occidente

**Fecha:** 2026-09-11
**Commit (pusheado a `origin/master`):** `78f1a34`

## Punto de partida

La Fase 9 dejó todas las eras con retratos completos. El buscador por nombre (con
salto directo a la tarjeta) solo existía en República ("Buscar cónsul"), aprovechando
que cada año tiene `titulo`/`anio`. Las demás eras (Monarquía, Imperio, Occidente,
Bizantino) no tenían ningún buscador. En Occidente, todo el tramo 455–476 d.C.
compartía un único mapa genérico de Wikimedia (`OCCIDENTE_476`), sin distinción por
emperador. Cache-busting en `?v=91`.

## Qué se hizo

### 1. Buscador de reyes/emperadores en las 4 eras restantes

- `jumpbar` (antes exclusivo de República) ahora se muestra en las 5 eras. El bloque
  "Ir al año" sigue exclusivo de República (depende del campo `anio`, que solo existe ahí).
- Nueva función genérica `buildRulerIndex`/`renderRulerResults` en `js/app.js`: indexa
  por `nombre` de cada entrada (`monarquia`, `imperio`, `occidente`, `bizantino`) y al
  hacer click en un resultado salta directo con `selectIndex`. Distinto del buscador de
  cónsules (que agrupa por persona a través de varios años y latiniza nombres): acá cada
  entrada de la lista es ya una persona/reinado, un resultado por entrada.
- Label y placeholder del input cambian según la era (`SEARCH_LABELS`): "Buscar rey"
  (Monarquía), "Buscar emperador" (Imperio, Occidente, Bizantino), "Buscar cónsul"
  (República, sin cambios).
- CSS: clase `.consul-result.clickable` (cursor + hover) para los resultados de las
  nuevas 4 eras, reusando el resto de estilos ya existentes del buscador de cónsules.
- Probado en navegador (server local `roma`, puerto 8777) en las 4 eras nuevas: label
  correcto, búsqueda filtra bien (incluye coincidencias parciales como "Justiniano" →
  Justiniano I y II), click salta a la tarjeta correcta.

### 2. Mapas específicos por emperador — Imperio de Occidente (395–476 d.C.)

- El usuario fue subiendo mapas sueltos a `assets/` (no `assets/img/`) a lo largo de la
  sesión, uno o varios por vez, pidiendo cada vez "poné esto donde corresponde". Se
  movieron y renombraron a `assets/img/occidente-<año>.png`:
  `occidente-395-division.png`, `-423`, `-455`, `-456`, `-457`, `-461`, `-474`.
- El sistema de mapas por hito (`HITOS_OCCIDENTE` en `js/mapas.js`) solo mira el año de
  **inicio** del `periodo` de cada entrada, así que dos entradas que arrancan el mismo
  año (ej. Petronio Máximo y Avito, los dos en 455) no se pueden distinguir por rango de
  años. Se agregó un campo nuevo por entrada, `mapaEspecial` (`{url, credit, caption}`),
  que `getMapForEntry` (`js/app.js`) prioriza por sobre el cálculo por `HITOS_OCCIDENTE`
  cuando está presente.
- `mapaEspecial` quedó asignado en `js/datos.js` a:
  - **Honorio** (395–423) → `occidente-423.png` (fin de su reinado: Britania ya perdida,
    resto del territorio intacto).
  - **Constancio III** (421) y **Valentiniano III** (425–455) → `occidente-395-division.png`
    (división roja/azul de 395; se aclara en el caption que es una referencia, no un mapa
    exacto para esos años).
  - **Petronio Máximo** (455) → `occidente-455.png`.
  - **Avito** (455–456) → `occidente-456.png` (mismo territorio que 455 salvo Córcega,
    Cerdeña y Sicilia, que pasan a los vándalos — comparación píxel a píxel con `PIL`
    confirmó la diferencia exacta).
  - **Mayoriano** (457–461) → `occidente-457.png` (Hispania perdida).
  - **Libio Severo** (461–465) → `occidente-461.png` (Galia reducida a una franja,
    Hispania recuperada).
  - **Antemio, Olibrio, Glicerio** (467–474, sin mapa propio) → reusan `occidente-461.png`
    como referencia más cercana disponible, a pedido del usuario (antes usaban el genérico
    de 476, que ya mostraba solo Italia, algo prematuro para esos años).
  - **Julio Nepote** (474–475) y **Rómulo Augústulo** (475–476) → `occidente-474.png`
    (Italia + Dalmacia únicamente), a pedido explícito del usuario para que compartan mapa.
- Verificado cada caso en el navegador (texto del caption + `Fuente: Imagen provista por
  el usuario` + imagen carga bien).

### Cache-busting

`index.html`: `?v=91` → `?v=97` (92 buscador, 93 mapas 455/456/457/461/474, 94 división
395 + primeros 3 emperadores, 95 Antemio/Olibrio/Glicerio → mapa 461, 96 Honorio → mapa
423, 97 Rómulo Augústulo → mapa 474).

## Estado al cerrar

Todo commiteado (un solo commit, `78f1a34`) y pusheado a `origin/master`. Working tree
limpio.

- Buscador por nombre disponible en las 5 eras.
- Occidente: 9 de las 12 entradas tienen `mapaEspecial` propio o compartido a propósito
  (todas menos Honorio-genérico ya cubierto, Constancio III y Valentiniano III, que
  siguen con el mapa de referencia de 395 por falta de uno más específico).
- 7 mapas nuevos en `assets/img/`, todos con crédito "Imagen provista por el usuario".

## Pendiente / próximos pasos

- Si el usuario sube más mapas sueltos a `assets/` (fuera de `assets/img/`), revisar ahí
  primero — es el patrón que usó toda esta fase en vez de decir el nombre del archivo.
- Constancio III y Valentiniano III podrían recibir mapas propios más precisos si en
  algún momento aparecen (hoy comparten el genérico de la división de 395).
- Mismo tipo de mapas por gobernante podría extenderse a Bizantino si el usuario lo pide
  (hoy Bizantino solo tiene el buscador nuevo, no mapas por emperador).
