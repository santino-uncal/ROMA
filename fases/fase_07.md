# Fase 7 — Buscador de cónsules + traductor de nombres al latín

**Fecha:** 2026-09-03
**Commits:** esta fase (2 commits)

## Punto de partida

La Fase 6 dejó los medallones hechos hasta el -400 a.C. y todo pusheado a `origin/master`
(`85b0cad` + `f0d4395` del fase_06.md). Esta fase NO tocó `js/datos.js` ni siguió con los
medallones: fue una tanda de features sobre el buscador.

## Qué se hizo

### 1. Buscador de cónsules (nuevo, debajo del "Ir al año")

- `index.html`: segunda fila en `.jumpbar` con `<input id="jumpConsul">` + `<div id="consulResults">`.
  Solo visible en la era República (igual que el buscador de año).
- `js/app.js`: se construye un índice de cónsules a partir de los `titulo` de `DATA.republica`.
  - Se saca el prefijo "Tribunos consulares" / "Primeros tribunos consulares:".
  - Se quitan los paréntesis (`(2º)`, `(4º, cónsul único)`, `(mueren en combate)`…) **antes**
    de partir por `,` / ` y ` / ` — ` (guiones em/en). Esto evitó el bug donde
    "Cayo Julio César (4º, cónsul único)" generaba un grupo fantasma "Cayo Julio César (4º".
  - Se descartan títulos sin nombres: "Segundo Decenvirato", "Ausencia de cónsules
    ordinarios", "Bloqueo de elecciones", "Última secesión de la plebe", "Cónsules
    inciertos", interregnos, dictaduras (regex `CONSUL_SKIP_RE` / `CONSUL_ROLE_RE`).
  - Cada nombre distinto (normalizado sin acentos/mayúsculas) es un grupo con: todos sus
    años, y el mejor retrato disponible (`imagenes[idx]` del año: foto si existe, si no el
    `abbr`, si no iniciales + color por hash).
- Resultado: medallón a la izquierda + nombre + los años como botones. Cada botón salta a
  la ficha de ese año (`jumpToYear` → `selectIndex`).
- **Criterio de agrupación** (confirmado con el usuario): se agrupa por el nombre EXACTO
  como aparece en el título. "Publio Cornelio Escipión" junta todos sus años; las ramas
  con cognomen propio ("Escipión Africano", "Escipión Asina"…) son grupos aparte. Homónimos
  distintos con el mismo nombre exacto caen juntos (aceptado: "todos los que se llamen así").
- Al salir de la era República se limpia `#consulResults`.

### 2. Traductor de nombres al latín (en cada resultado)

- Decisión del usuario: mostrar la forma latina **debajo** del nombre en español en cada
  resultado (no un segundo campo de búsqueda). Cursiva dorada, clase `.consul-result-latin`.
- `js/app.js`: `LAT_MAP` (~450 entradas: praenomina, gens, cognomina) + `latinizeToken` con
  heurística de terminaciones para lo que no esté en el diccionario
  (`-ón→-o`, `-ense→-ensis`, `-io→-ius`, `Es+consonante→S`, `j→i`, `-ano→-anus`, etc.).
  `latinizeName` une los tokens.
- Ejemplos: Cayo Julio César → *Gaius Iulius Caesar*; Lucio Cornelio Sila → *Lucius
  Cornelius Sulla*; Publio Cornelio Escipión Africano → *Publius Cornelius Scipio
  Africanus*; Marco Tulio Cicerón → *Marcus Tullius Cicero*; Cneo Pompeyo Magno →
  *Gnaeus Pompeius Magnus*; Publícola → Poplicola; Enobarbo → Ahenobarbus.
- El usuario aceptó que algún cognomen muy raro puede quedar aproximado.
- **Bonus:** el buscador también matchea contra la forma latina, así que escribir
  `Caesar` o `Scipio` encuentra los mismos resultados.
- El diccionario se generó y validó con un script Python (`scratchpad/latin.py`) contra
  los 585 nombres distintos de `DATA.republica`; solo ~2 tokens caían a heurística.

### Cache-busting

`index.html`: de `?v=75` a `?v=77` (v=76 fue el buscador, v=77 el latín).

## Verificación

Server local `roma` (`.claude/launch.json`, puerto 8777). Se probó:
- "Julio César" → 3 grupos (Sexto, Lucio, Cayo) con años y latín correctos.
- Clic en un botón de año → la ficha salta a ese año (p. ej. 218 a.C. → "Publio Cornelio
  Escipión y Tiberio Sempronio Longo").
- Decenas de nombres (Publícola, Escipión, Cicerón, Sila, Pompeyo, Catón, Graco, Cincinato,
  Torcuato, Camilo, Enobarbo, Escévola, Metelo…) → traducción correcta.
- Búsqueda en latín (`Caesar`, `Scipio`) → funciona.
- Sin errores de consola. Sin fila fantasma de títulos sin cónsules.

## Estado al cerrar

Trabajo commiteado. Falta `git push` a `origin/master` si no se hizo (verificar).

## Pendiente / próximos pasos

- **-399 a.C. en adelante**: seguir con los medallones (tribunos consulares, guerra de
  Veyes). Próximo archivo de imagen libre: `retrato-12.jpg`.
- Automatizar el `?v=N` de cache-busting (sigue a mano; va en 77). El usuario lo encuentra
  engorroso.
- Si aparece algún nombre latino mal traducido, se corrige agregando la entrada a `LAT_MAP`
  en `js/app.js`.
