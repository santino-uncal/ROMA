# Fase 4 — Publicación en GitHub, formato de datos.js y arreglo de rótulos

**Fecha:** 2026-08-28
**Commit(s):** `96f7e71`, `d316a5c` (+ push inicial de todo el historial a GitHub)

## Punto de partida

El proyecto estaba solo en local (repo git con historial hasta `1afc45f`, sin remoto).
El usuario creó un repo vacío en GitHub y pidió subirlo. Después surgieron dos temas de
estructura/calidad en el código.

## Qué se hizo

### 1. Publicación en GitHub

- Se agregó el remoto `origin` → `https://github.com/santino-uncal/ROMA.git`.
- `git push -u origin master` — se subió todo el historial. Las credenciales las resolvió
  Git Credential Manager (`credential.helper=manager-core`).
- La rama en GitHub quedó como **`master`** (no `main`). Se le comentó al usuario cómo
  renombrarla si quiere, no se hizo.
- `user.name`/`user.email` locales del repo = `santinouncal2` (correcto). El global de la
  máquina es otro (`chanchino`), pero no afecta.

### 2. Reformateo de `js/datos.js` (commit `96f7e71`)

- El archivo estaba **minificado en una sola línea de ~141.000 caracteres**
  (`window.ROMA_DATA = {...}`). Estructura de datos OK, pero diffs de git inservibles al
  agregar retratos.
- Se re-serializó con `json.dumps(data, ensure_ascii=False, indent=2)` vía `py` (Python
  3.10; `python`/`node` no están, `py` sí).
- Pasó de 2 líneas → 3.173 líneas, un registro por bloque.
- **Verificado idéntico**: `json.loads` del original (desde `git show HEAD:`) vs el nuevo,
  comparación registro por registro → 0 diferencias. Conteos: monarquia 7, republica 482,
  imperio 28, occidente 12, bizantino 79.
- Script usado: `scratchpad/reformat.py` + `verify.py` (fuera del repo).

### 3. Arreglo de rótulos de la línea de tiempo (commit `d316a5c`)

Bug preexistente en `renderRail()` (`js/app.js`): el separador entre nombre y fecha era el
literal `'\\n'` (barra + n), que se mostraba tal cual en pantalla
(`"Rómulo\n753–716 a.C."`). Además, aunque fuera `'\n'` real, el CSS `white-space:normal`
lo colapsaría.

- `js/app.js`: para ticks `wide` (todas las eras menos república), el rótulo ahora se arma
  con `<span>nombre</span><br><span class="label-fecha">fecha</span>`. República sigue
  usando solo el año (rama `else`).
- `css/estilos.css`: regla nueva `.tick.wide .label .label-fecha` — fecha más chica
  (11px), sin negrita, color `--tinta-suave`, `margin-top:2px`.
- `index.html`: se agregó `?v=2` a los 3 `<script>` y al `<link>` del CSS.

### Cache-busting `?v=N`

Se explicó al usuario (varias vueltas): el navegador cachea fuerte los `.js`/`.css`. Para
que los **visitantes** de la página publicada vean cambios hay que subir el número:
`?v=2` → `?v=3` → `?v=4`, igual en las 4 líneas de `index.html`, cada vez que se edita un
asset. Para desarrollo local basta con **Ctrl+F5** (hard refresh) y no hace falta tocarlo.
El usuario lo encontró engorroso; **pendiente: automatizarlo** para no tener que tocar el
número a mano.

Nota de proceso: el navegador embebido de verificación cacheó `app.js` con mucha fuerza;
recién se vio el cambio nuevo navegando a `http://localhost:8777/index.html?bust=99999`
con `force:true`.

## Verificación

- `datos.js`: comparación estructural automática (ver arriba).
- Rótulos: servidor local `roma` (`.claude/launch.json`, `python -m http.server 8777`),
  probado en Monarquía, Imperio, Occidente y Bizantino → nombre y fecha en dos líneas,
  sin `\n`. República sin cambios (`509 a.C.`). Cero errores de consola. Screenshot OK.

## Estado al cerrar

Todo commiteado y pusheado a `origin/master` (`d316a5c`). Working tree limpio.

## Pendiente / próximos pasos

- **Retratos de cónsules: continuar desde el -498 a.C.** (flujo de la Fase 3). Próximo
  archivo de imagen libre: `retrato-12.jpg`.
- Automatizar el `?v=N` (o reemplazarlo por otra estrategia de cache-busting) para no
  editarlo a mano en cada cambio.
- Mojibake preexistente en `index.html:6`: el `<title>` dice `SPQR â€" Historia de Roma`
  en vez de `SPQR — Historia de Roma` (raya larga mal codificada). No se tocó; ofrecido
  al usuario.
- Opcional: renombrar la rama `master` → `main` en local y GitHub.
- Pregunta abierta de Fase 3 sigue abierta: `P. V. Gémino Cicurino` vs `P. V. G. Cicurino`
  para el -499.
