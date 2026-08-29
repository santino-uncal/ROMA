# Fase 5 — Medallones de cónsules del -498 al -451 a.C.

**Fecha:** 2026-08-28 / 2026-08-29
**Commits:** `d705cd3` … `a6762d3` (48 commits, uno por año)

## Punto de partida

La Fase 3 dejó los retratos/medallones de cónsules hechos hasta el -499 a.C. La Fase 4
publicó en GitHub y arregló datos.js y los rótulos. Esta fase retomó el flujo del -498.

## Qué se hizo

Se agregó el array `imagenes` a las entradas de `js/datos.js` (era `republica`) para
**todos los años del -498 al -451 a.C.** (48 años, un commit por año).

- **Ninguno sumó foto nueva.** Todos los cónsules de este tramo fueron con círculo de
  abreviación (`abbr`), no hay retratos antiguos conocidos de ninguno.
- Próximo archivo de imagen libre sigue siendo `retrato-12.jpg`.
- Cada commit sube también el `?v=N` de cache-busting en las 4 líneas de `index.html`.
  Terminó en **`?v=50`** (empezó esta fase en `?v=2`).

## Convenciones nuevas / decididas con el usuario

- **Cónsul repetido:** si un cónsul ya salió en un año anterior, se reusa su `label`/`abbr`
  exacto (p. ej. Espurio Casio → `E. C. Vecelino` en -502, -493 y -486).
- **Hijo homónimo:** un cónsul hijo del mismo nombre que un cónsul anterior con retrato
  **no** reusa el retrato del padre; va con `abbr` (Publio Valerio Publícola hijo, -475).
- **Doble cognomen:** todo a inicial salvo el último apellido
  (`Publio Servilio Prisco Estructo` → `P. S. P. Estructo` / `P. S. P. E.`).
- **Praenomen "Tiberio":** se abrevia `T.` (inicial estricta, no `Ti.`).
- **"Aulo/Espurio Postumio Albo Regilense" (-464, -466):** se rinde
  `A./E. P. A. Regilense`. En el -496 el título no traía "Regilense" y quedó `A. P. Albo`.
- Se limpió de `memory/roma-retratos-consules.md` la lista larga de labels ya usados:
  ahora todos viven en `js/datos.js` y se buscan con grep.

## Verificación

Cada año se probó en el server local `roma` (`.claude/launch.json`, puerto 8777):
se navegó a la ficha del año, se comprobó que los dos medallones renderizan con el
`abbr` y el pie correctos, que las abreviaciones de 4 letras no desbordan el círculo
(44–45 px, entran justas), y cero errores de consola.

## Estado al cerrar

Todo commiteado en `master` local hasta `a6762d3`. **Falta `git push`** (no se hizo en
esta sesión). Working tree con este `fase_05.md` pendiente de commit.

## Pendiente / próximos pasos

- **`git push` a `origin/master`** para que los visitantes vean todo lo de esta fase.
- **-450 a.C.**: la entrada se titula "Segundo Decenvirato", sin nombres de cónsules.
  Decidir con el usuario si lleva un medallón único para Apio Claudio Craso (como el
  dictador Tito Larcio en el -501) o queda sin `imagenes`. Seguir desde ahí.
- Automatizar el `?v=N` (sigue a mano; ya va en 50).
- Mojibake preexistente en `index.html:6` (`<title>` con `â€"`). No tocado.
