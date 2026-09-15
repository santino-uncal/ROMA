# Fase 22 — Cuatro minijuegos: Romandle, Guess the Imperator, Grid Imperial y Silueta Imperial

**Fecha:** 2026-09-14 / 2026-09-15

## Resumen

Sesión larga dedicada a agregar cuatro juegos nuevos, independientes de la línea de
tiempo pero linkeados desde el encabezado de `index.html` (fila `.romandle-links`, 4 pills)
y con cross-links entre sí en cada header. Todos comparten el patrón: modo "del día"
(semilla determinística por fecha, progreso en localStorage) + modo práctica al azar,
modal de resultado reutilizando `.romandle-result-box` / `.modal-*` de `css/romandle.css`
y `css/estilos.css`, y autocompletado con la misma estructura que el buscador de
cónsules (`.consul-result`) ya existente en `js/app.js`.

Antes de los juegos: **se sacó el fondo blanco de `assets/img/aquila.png`** (ícono de
paganismo en el encabezado, `#paganBtn`) con flood-fill + tolerancia de color (Pillow/numpy),
dejándolo transparente.

## 1. Romandle (`romandle.html`, `js/romandle.js`, `css/romandle.css`)

Wordle letra por letra, pero el secreto es siempre un emperador (`imperio` + `occidente` +
`bizantino` de `js/datos.js`, nunca reyes de la Monarquía ni cónsules de la República).
Se descartan como secreto los 3 reinados conjuntos ("Valentiniano I y Valente", etc.) por
no tener nombre único que adivinar. El nombre se normaliza (sin tildes/espacios/apodos
entre comillas) para armar la grilla; los intentos deben ser nombres reales de emperador
de la misma longitud, con autocompletado. 6 intentos, verde/dorado/piedra.

**Bug encontrado y corregido en la sesión:** el cálculo del ancho de casillero
(`computeTileSize`) usaba el `clientWidth` de `.romandle-wrap` en vez de `.romandle-grid`,
sin restar el padding del `.wrap` — en mobile los nombres de 8+ letras hacían wrap mal.

## 2. Guess the Imperator (`imperator.html`, `js/imperator.js`, `css/imperator.css`)

Estilo "Guess Who": grilla con los 146 emperadores (retrato + nombre). Un panel de
preguntas revela, para el emperador secreto, 6 atributos: era, dinastía (mapa a mano de
los 146 nombres a ~22 dinastías reales), siglo de inicio, duración del reinado (baldes),
cómo terminó su reinado (clasificador por palabras clave sobre la biografía existente:
asesinado/suicidio/combate/depuesto o abdicó/natural) e inicial del nombre. Cada respuesta
tacha en la grilla a los que no cumplen. Se puede arriesgar un nombre en cualquier momento
(foto o buscador); intentos ilimitados, se cuenta el score final.

**Modo difícil** (agregado a pedido explícito del usuario): mismo mecanismo de preguntas,
pero sin grilla visual ni contador de candidatos — hay que llevar la cuenta de memoria.
Semilla diaria distinta a la del modo fácil para que resolver uno no espoilee el otro.

## 3. Grid Imperial (`grid.html`, `js/grid.js`, `css/grid.css`)

Grilla 3x3 estilo "Immaculate Grid": 54 categorías posibles (era, dinastía, siglo,
duración, destino + 8 categorías de hechos históricos curadas a mano: Dacia como
provincia, Britania como provincia, persecución a cristianos, concilios ecuménicos,
epidemias, obras públicas, cesión voluntaria de territorio, emperador niño). Cada emperador
sólo se puede usar una vez en toda la grilla.

**Bug encontrado y corregido:** el generador original sorteaba 3 filas + 3 columnas al
azar puro y recién después chequeaba si la grilla cerraba (con matching de 9 celdas por
backtracking) — fallaba ~20% de las veces incluso con 400 reintentos. Se reemplazó por un
armado con backtracking que descarta categorías incompatibles apenas aparecen
(`tryBuildRowsCols`), bajando a <1ms con 100% de éxito en las pruebas.

## 4. Silueta Imperial (`silueta.html`, `js/silueta.js`, `css/silueta.css`, `js/provincias-data.js`)

Adivinar una provincia romana por su silueta en negro. Datos de 42 provincias (país
moderno + capital, idioma, moneda, continente, bandera; capital romana, tipo
senatorial/imperial, región, siglo de anexión, dato curioso) en `js/provincias-data.js`,
más `window.PAISES_INFO` con los datos de los 26 países modernos involucrados.

**El trabajo grande de esta fase fue generar las 42 siluetas**, que no existían como
recurso: se extrajeron del mapa `assets/img/provincias-imperio.webp` (que ya estaba en el
proyecto, con provincias coloreadas por tipo separadas por líneas de borde) con
flood-fill + `scipy.ndimage.label` (componentes conexas) + `binary_closing`/`binary_fill_holes`
para tapar agujeros de texto, recortadas y guardadas como PNG con fondo transparente en
`assets/img/provincias/`. Script Python no versionado (usaba
`C:\Users\munca\AppData\Local\Programs\Python\Python310\python.exe`, con Pillow/numpy/scipy).

- **Galatia se descartó** como provincia jugable: en el mapa fuente está fusionada con
  Asia sin ninguna línea de borde entre ambas (confirmado bajando la tolerancia de color
  hasta el mínimo, siguen unidas a nivel de píxel) — no se pudo separar sin inventar un
  límite arbitrario.
- **Bug encontrado a partir de feedback del usuario ("las de Anatolia y Levante se ven
  chicas, a Italia le falta Venecia/Rávena")**:
  - Italia: hay un cuello de botella de 1-2px en la costa del Adriático cerca de Aquileia
    donde el antialiasing del webp rompe la continuidad de color — el flood-fill dejaba
    afuera esa lengüeta (la actual Venecia/Rávena). Se agregó como semilla extra, igual
    que Córcega+Cerdeña.
  - Anatolia/Levante: las siluetas estaban completas (verificado 1 por 1), el problema era
    CSS — `.silueta-box img` tenía `max-width/max-height` pero nunca se agrandaba para
    LLENAR la caja, así que las provincias con menos píxeles reales en el mapa (aunque
    completas) se veían diminutas al lado de Tarraconensis. Se cambió a caja de alto fijo
    con `object-fit:contain` en la imagen, así todas se ven a tamaño consistente.

**Mecánica de adivinanza — probamos y descartamos un mecanismo estilo Worldle**: en un
momento se reemplazó el sistema de pistas por distancia en km + flecha de dirección +
% de cercanía (usando las coordenadas de cada provincia en el mapa como proxy geográfico,
calibrado con la distancia real Roma–Constantinopla). El usuario lo probó y pidió sacarlo
por ser demasiado difícil. **Quedó revertido**: 3 intentos, pista de región al primer
fallo, inicial del nombre al segundo. Las coordenadas `x`/`y` quedaron en
`provincias-data.js` sin usarse (inofensivas, no hace falta sacarlas si no se retoma esto).

**Preguntas finales — mínimo 6 por modo, a pedido del usuario** (antes había sólo 1 fija
por modo): se eligen al azar en cada ronda, con `questionTypeIdx` persistido en el
progreso del día para que no cambie si se recarga la página.
- Fácil: capital actual, país actual, idioma, moneda, continente, bandera (emoji).
- Difícil: senatorial/imperial, capital romana, región del Imperio, "¿a qué provincia
  corresponde este dato?" (reutiliza el campo `dato`), siglo de anexión, antes/después de
  Cristo.

## Notas técnicas

- Python para todo el procesamiento de imágenes de esta fase (mapa de provincias y
  águila): mismo intérprete que en fases anteriores
  (`AppData\Local\Programs\Python\Python310\python.exe`), con Pillow + numpy + scipy
  (scipy se usó por primera vez en este proyecto, para `ndimage.label`/`binary_closing`/
  `binary_fill_holes`).
- Otro chat/sesión compartía el servidor local en el puerto 8777 durante buena parte de
  esta fase (mismo navegador embebido) — dio falsos positivos varias veces (progreso ya
  resuelto al cargar, overlays que no abrían) por localStorage/DOM compartido, no por bugs
  reales. Si se repite esta confusión al depurar, verificar primero si hay otra sesión
  activa antes de asumir un bug de código.
- `window.PAISES_INFO` (en `provincias-data.js`) está separado de `PROVINCIAS_DATA` a
  propósito, para no repetir continente/idioma/moneda/bandera en las 42 entradas — se
  valida por `paisModerno` como clave.

## Estado al cerrar

Sin commitear todavía: los 4 juegos completos (html/css/js), `js/provincias-data.js`,
`assets/img/provincias/` (42 PNG), el fix de `assets/img/aquila.png` y los cambios en
`css/estilos.css` / `index.html` para linkearlos. Todo probado en navegador (desktop y
mobile) en esta sesión.

**Sin tocar / ajenos a esta sesión:** `assets/img/Instagram.html` y
`assets/img/Instagram_files/` siguen sin trackear, igual que en fases anteriores.

**Si se retoma:** el script Python de extracción de siluetas no quedó guardado como
archivo en el repo (se armó y iteró en el scratchpad de la sesión, que no persiste). Si
hace falta volver a generar o ajustar alguna provincia, hay que rehacer el flood-fill
desde cero contra `assets/img/provincias-imperio.webp` — las coordenadas de semilla de
cada provincia están documentadas en el historial de esta sesión, no en un archivo.
