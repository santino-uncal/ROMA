# Fase 24 — Modales de Economía y Política, y pantalla de inicio con Rómulo y Remo

**Fecha:** 2026-09-16

## Resumen

Sesión corta con tres partes: (1) dos modales nuevos en el encabezado —Economía y
Política—, siguiendo el patrón ya establecido por Administración/Paganismo/Cristianismo/
Estandarte, y (2) una pantalla de inicio nueva que se muestra antes de entrar a la línea
de tiempo, con el mito fundacional de Rómulo y Remo y botones para elegir la era de
arranque, a la que además se le movió el menú JUEGOS (fase 23) desde el encabezado de la
línea de tiempo.

## 1. Modal de Economía (`index.html`, `css/estilos.css`, `js/app.js`)

Ícono nuevo `economiaBtn` (`assets/img/Economia.png`, imagen provista por el usuario, ya
transparente) junto al del estandarte. Modal "💰 La economía romana": agricultura y
*annona*, comercio y moneda (denario/sestercio, Ostia, *collegia*), impuestos
(*tributum*, *portoria*, *publicani*), y una sección "Las rutas del Imperio" (*cursus
publicus*, *mansiones*/*mutationes*, Miliario de Oro) con el mapa
`assets/img/Carreteras.webp` (provisto por el usuario) como figura ampliable en
lightbox, mismo patrón que el mapa de provincias/tetrarquía del modal de Administración.

## 2. Modal de Política (`index.html`, `css/estilos.css`, `js/app.js`)

Ícono nuevo `politicaBtn` (`assets/img/Politica.png`, provista por el usuario). **A
diferencia de las imágenes anteriores, esta venía con fondo blanco opaco** (modo `P`
sin transparencia) en vez de transparente como el resto de los íconos del encabezado —
se le quitó el fondo con el mismo flood-fill + `scipy.ndimage.label` desde los bordes
usado en la fase 22 para el águila del paganismo (Pillow/numpy, intérprete de Python en
`AppData\Local\Programs\Python\Python310\python.exe`), y se sobrescribió el PNG in situ.

Contenido del modal "👑 La política romana" (el emoji 🗳️ se descartó por no renderizar
bien en el navegador embebido, se usó 👑 en su lugar): conflicto de los órdenes
(tribunado de la plebe, Doce Tablas, *lex Hortensia*), populares vs. optimates (los
Gracos), de Sila a César (primer triunvirato, Rubicón, Idus de Marzo), segundo
triunvirato y fin de la República (Accio), el juego político del Imperio (Año de los
Cuatro Emperadores, subasta del trono en el 193), y política de palacio en Bizancio
(eunucos, "nacida en púrpura", ceguera en vez de ejecución). Pensado para no pisar el
contenido ya cubierto por el modal de Administración (que es estructura del Estado, no
la disputa por el poder).

## 3. Pantalla de inicio (`index.html`, `css/estilos.css`, `js/app.js`)

A pedido del usuario, la web ya no arranca directo en Rómulo: ahora hay una pantalla de
inicio (`#startScreen`) que tapa todo el contenido de la línea de tiempo
(`#mainWrap`, con `display:none` hasta elegir) y cuenta el mito fundacional —Rea Silvia,
la loba y el Lupercal, la disputa Rómulo/Remo por el Palatino vs. el Aventino, la
fundación del 753 a.C.— seguido de 5 botones (`.start-choice`) para elegir por dónde
arrancar: Monarquía, República, Imperio, Imperio de Occidente o Imperio Bizantino. Cada
botón llama a `setEra()` (la misma función que ya usaban los botones SPQR/Occidente/
Bizantino) y recién ahí revela `#mainWrap`.

**Iteraciones a pedido del usuario tras la primera versión:**
- Se sacó el mapa del Septimontium (`assets/img/septimontium-romulo.png`) que
  acompañaba el texto como figura lateral — el usuario pidió directamente sacarlo, sin
  reemplazo.
- El menú **JUEGOS** (botón 🎮 + `.romandle-links`, agregado en la fase 23 arriba del
  todo en el encabezado de la línea de tiempo) **se movió a la pantalla de inicio** y se
  sacó por completo del encabezado de `#mainWrap`: ahora sólo se puede abrir desde el
  inicio, no desde la línea de tiempo. Se duplicó el bloque con IDs propios
  (`startJuegosBtn`/`startJuegosMenu`) y su propio toggle en `app.js`, ya que los juegos
  son páginas HTML separadas (links `<a>`, no modales) y no dependían de estado de la
  línea de tiempo.
- El texto **"Ab urbe condita"** del encabezado de la línea de tiempo (`.eyebrow`, ahora
  con `id="backToStartBtn"`) es clickeable (cursor pointer, hover dorado, accesible con
  Enter/Espacio) y vuelve a la pantalla de inicio (oculta `#mainWrap`, muestra
  `#startScreen`) — es la única forma de volver a abrir el menú de juegos una vez
  adentro de la línea de tiempo.

## Notas técnicas

- `Politica.png` es, hasta ahora, la única imagen de ícono de encabezado provista por el
  usuario que vino con fondo opaco en vez de transparente — si se agregan más íconos así
  en el futuro, primero chequear el canal alfa (`im.convert('RGBA').getchannel('A').getextrema()`)
  antes de usarla directamente.
- El emoji 🗳️ (urna de votación, con variation selector) no renderiza como ícono en el
  navegador embebido de esta sesión (aparece como glifo de caja) — evitarlo si se
  agregan más títulos con emoji; 👑, 💰, 🏛, ⚡, ✝ sí funcionan.
- Verificado con servidor local (`roma`, puerto 8777) en vez de abrir el `index.html`
  como `file://`: los scripts (`datos.js`/`mapas.js`/`app.js`) no se ejecutan al abrir
  el archivo directo en el navegador embebido de esta sesión (se renderiza como
  snapshot estático, sin JS vivo) — para probar cualquier interacción hay que usar el
  preview del servidor.

## Estado al cerrar

Sin commitear todavía al momento de escribir esta fase: modales de Economía/Política,
`assets/img/Economia.png`, `assets/img/Politica.png` (ya sin fondo) y
`assets/img/Carreteras.webp` (las tres provistas por el usuario), la pantalla de inicio
completa y el reordenamiento del menú JUEGOS. Todo probado en el servidor local
(desktop y mobile): los 5 caminos de arranque, el modal de economía con su mapa
ampliable, el modal de política, y el ciclo inicio → línea de tiempo → "Ab urbe condita"
→ inicio de nuevo.

**Sin tocar / ajenos a esta sesión:** `assets/img/Instagram.html` y
`assets/img/Instagram_files/` siguen sin trackear, igual que en fases anteriores.

**Si se retoma:** si se agrega un modal de encabezado nuevo (siguiendo el patrón de
Administración/Paganismo/Cristianismo/Estandarte/Economía/Política), recordar sumar el
ícono a los selectores CSS compartidos (`.cruz-icon, .estandarte-icon, ...`) y no asumir
que la imagen provista ya viene transparente.
