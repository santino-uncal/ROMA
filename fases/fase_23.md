# Fase 23 — Menú JUEGOS y seis minijuegos nuevos: Silueta Oculta, Secuencia Imperial, Órbita Romana, La Legión, Más o Menos Años y La Guerra

**Fecha:** 2026-09-15 / 2026-09-16

## Resumen

Sesión larga dedicada a: (1) agregar un header "JUEGOS" arriba de los botones
SPQR/Imperio de Occidente/Imperio Bizantino que despliega un menú con los enlaces a
todos los minijuegos, y (2) sumar seis minijuegos nuevos a los cuatro que ya existían
(Romandle, Guess the Imperator, Grid Imperial, Silueta Imperial — fase 22), más una
pasada final agregando un "dato curioso" al resultado de los 10 juegos.

Todos los juegos nuevos siguen el mismo patrón ya establecido: modo "del día" (semilla
determinística por fecha, progreso en `localStorage`) + modo práctica al azar, modal de
resultado reutilizando `.romandle-result-box`/`.modal-*` y autocompletado o MCQ con
`.consul-result`/`.silueta-question-options` según el juego.

## 0. Header "JUEGOS" (`index.html`, `css/estilos.css`)

Botón con ícono 🎮 (emoji, no imagen) arriba de la fila SPQR/Occidente/Bizancio, mismo
estilo visual que esos tres (`.top-btn`). Al click despliega/colapsa (clase `.open`,
transición `max-height`) la fila `.romandle-links` con los enlaces a todos los
minijuegos, que antes estaba siempre visible arriba del todo.

## 1. Silueta Oculta (`silueta-oculta.html`, `js/silueta-oculta.js`, `css/silueta-oculta.css`)

Adivinar un emperador (imperio/occidente/bizantino) por su retrato oculto. Tiene
**modo fácil** y **modo difícil** (botón toggle, a pedido explícito del usuario tras
probar la primera versión):

- **Difícil:** el retrato real, pero con `filter: brightness()/blur()/grayscale()` muy
  fuerte que se va aclarando con cada intento fallido (5 intentos). Este era el
  comportamiento original de la fase, que el usuario pidió mantener tal cual pero mover
  a "modo difícil" en vez de ser el único modo.
- **Fácil:** silueta negra real generada en el navegador con Canvas — flood-fill desde
  el borde con tolerancia de color + limpieza de ruido "sal y pimienta" (mayoría de
  vecinos), procesado en baja resolución (~160px) para difuminar detalle fino. Si la
  segmentación no es confiable (ratio de fondo <5% o >95%), cae de vuelta al filtro
  difuminado del modo difícil en vez de arriesgarse a mostrar la foto sin querer.
  **Probado contra los 170 retratos: funciona en 169, solo 1 cae al fallback.**

Tras resolver: 3 preguntas (período, duración, elección entre 2 mapas de territorio si
hay `mapaEspecial`) + dato curioso (`secret.texto`) en el resultado.

## 2. Secuencia Imperial (`secuencia.html`, `js/secuencia.js`, `css/secuencia.css`)

Ordenar 7 hechos históricos (banco curado de 29, de la fundación de Roma a la caída de
Constantinopla) del más temprano al más tardío con flechas ▲▼. 6 intentos de
"Verificar orden" (marca cada fila en verde/rojo), + botón "Pista" (hasta 3, fija una
fila en su lugar correcto).

**Bug encontrado y corregido:** las flechas solo intercambiaban con el vecino
inmediato: si una pista fijaba una fila del medio, un hecho podía quedar "atrapado" del
lado equivocado y la partida se volvía imposible de ganar. Se corrigió para que las
flechas salten por encima de las filas bloqueadas (`findTarget` avanza hasta la próxima
fila libre en esa dirección) — verificado que cualquier permutación es alcanzable.

Cada uno de los 29 hechos tiene además un **dato curioso propio** (`dato`, agregado en
la pasada final de la sesión) distinto de su descripción base, mostrado en el resultado.

## 3. Órbita Romana (`orbita.html`, `js/orbita.js`, `css/orbita.css`)

Concepto pedido por el usuario a partir de un ejemplo de otro sitio (círculos que
"orbitan" alrededor de una categoría central). **Se rediseñó dos veces en vivo según
feedback:**

1. Primer diseño: un emperador secreto en el centro + círculos con pistas sobre ÉL
   (período, duración, vecinos en el grupo). El usuario aclaró que la idea era que
   **fueran varios gobernantes distintos**, no pistas de uno solo.
2. Rediseño: el centro muestra solo la categoría (18 categorías curadas: dinastías +
   años de emperadores rivales, ej. "Año de los cuatro emperadores"), y cada círculo
   orbitante es un integrante real de esa categoría (mostrando su período, nombre
   oculto) que hay que identificar uno por uno, con un ícono SPQR genérico en el centro.
   Ganás cuando identificás a todos.

Ajustes adicionales pedidos por el usuario tras probar:
- Sacar el período del desplegable de autocompletado (era la pista que había que
  adivinar).
- Que no haya un orden obligatorio: escribir cualquier nombre lo busca entre TODOS los
  integrantes sin resolver de la categoría, no solo contra uno "activo" — así se puede
  saltear el que no te acuerdes.
- Que los círculos giren de verdad: animación CSS de 3 capas (capa que rota 360°
  infinito + capa de offset al radio + capa interna que rota al revés a la misma
  velocidad para que el texto quede siempre derecho), con `animation-delay` negativo
  distinto por integrante para repartirlos parejo en la órbita. Respeta
  `prefers-reduced-motion`.

Resultado final: lista de integrantes con período + dato curioso completo de cada uno.

## 4. La Legión (`legion.html`, `js/legion.js`, `css/legion.css`)

Adivinar una legión romana por su emblema (número + animal/figura) con el cognomen
tapado. El trabajo grande fue **generar el recorte automático del cognomen** sobre las
34 imágenes de emblemas que el usuario ya tenía en `emblemas Legiones/`:

- Máscara de color "dorado" contra el fondo, banda de texto detectada por presencia de
  dorado en la franja central (30%-70% del ancho) buscando desde el 55% de la altura
  hacia abajo, con umbral de fusión de huecos chico (≤2px) para no pegar el texto con
  las patas del animal.
- Zona segura en X: se mide el ancho real del brazo vertical del corchete en una fila
  un poco arriba del inicio del texto (no en el pie del corchete, que es más ancho y
  daba falsos positivos), y se enmascara fila por fila todo tramo dorado que no esté
  *enteramente* dentro de esa franja — así funciona con cognomen de 1 o 2 palabras sin
  comerse los corchetes.
- Salidas: `assets/img/legiones-oculto/*.png` (nombre tapado, para jugar) y
  `assets/img/legiones/*.png` (original, para revelar al acertar). Contact sheets de
  verificación armados con Pillow antes de aceptar el resultado.
- **Legio XXII Deiotariana se excluyó**: su emblema real es un monograma abstracto, no
  un animal ni figura reconocible — quedaron **33 legiones jugables**.

Datos por legión (investigados con un agente de research vía WebSearch, con flags
explícitos de incertidumbre donde la historia es discutida, ej. XXI Rapax, IX Hispana):
animal, apodo (solo IX Hispana tiene uno: "La Legión Perdida"), batalla + resultado
(ganó/perdió, desde la perspectiva de ESA legión puntual, no de la guerra en general) +
nota, y (agregado en la pasada final) un **dato curioso** distinto de la nota de
batalla.

5 intentos + botón "Ayuda" (hasta 3, pistas progresivas: inicial → cantidad de palabras
→ forma enmascarada tipo "F________"). **Sin autocompletado** (pedido explícito del
usuario: "no te aparece los nombres posibles de la legión", coherencia con Órbita
Romana). Tras resolver: 3 preguntas (apodo sí/no, batalla MCQ, resultado sí/no).

## 5. Más o Menos Años (`mas-o-menos.html`, `js/mas-o-menos.js`, `css/mas-o-menos.css`)

"Higher/lower" con emperadores: dos cartas, la de la izquierda muestra sus años de
reinado, hay que adivinar si la de la derecha reinó más o menos. Acertar promueve el
challenger a referencia y saca uno nuevo (racha); fallar corta. Empate cuenta como
acierto. Es el único juego de la sesión que **no resetea el récord cada día** — el
"Récord" es personal y persiste indefinidamente en `localStorage`, separado de la racha
del día (que sí es una secuencia semillada por fecha, igual para todos, con progreso
persistido si se recarga a mitad de racha).

**Bug encontrado y corregido:** al reconstruir el estado desde `localStorage` tras una
derrota, se calculaba mal quién era la referencia y quién el challenger que causó la
pérdida (`pos - 1` vs `pos - 2`) — se corrigió la aritmética de índices y se verificó
recargando la página a mitad de partida.

Resultado final: comparación de años + (agregado en la pasada final) dato curioso del
emperador que cortó la racha.

## 6. La Guerra (`guerra.html`, `js/guerra.js`, `css/guerra.css`)

Adivinar una guerra romana a partir de sus participantes (dato fijo, siempre visible,
no se adivina). 18 guerras curadas (investigadas con el mismo agente de research que
las legiones) desde la Primera Guerra Judeo-Romana (66-73 d.C.) hasta la Caída de
Constantinopla (1453), con 1 a 5 emperadores por guerra a propósito para que tenga
sentido la pregunta de "identificalos a todos".

5 intentos de nombre (sin autocompletado, matching por palabras significativas —
`checkNameGuess` ignora tildes/mayúsculas y palabras de relleno/cortas, así "guerra
civil de constantino" matchea sin tener que escribir el nombre exacto) + botón "Ayuda"
(3 usos). Tras resolver: pregunta de **selección múltiple con retratos** para marcar
todos los emperadores correspondientes (con distractores de otros emperadores; se
marca en verde el acierto, "missed" en dorado el que faltó marcar, rojo el que sobró),
más año de inicio y de fin (MCQ). Dato curioso = la descripción de cada guerra, ahora
en su propia tarjeta separada del listado de emperadores.

## 7. Pasada final: "dato curioso" en los 10 juegos

A pedido del usuario ("en cada juego pone un dato curioso de cada cosa"), se revisó
juego por juego:

- **Romandle / Guess the Imperator:** ya mostraban `secret.texto` completo, sin cambios.
- **Silueta Imperial:** ya tenía `secret.dato`; solo se renombró la etiqueta a "Dato
  curioso" por consistencia.
- **Grid Imperial:** `cellAnswers` no guardaba `texto` — se agregó, y el resultado final
  muestra un fragmento (~90 caracteres) del dato de cada uno de los 9 emperadores de la
  grilla.
- **Silueta Oculta, Órbita Romana, Más o Menos Años:** no mostraban ningún dato
  extra en el resultado — se conectó `secret.texto`/`m.texto`/`challenger.texto` (ya
  existía en `datos.js`, cero investigación nueva).
- **Secuencia Imperial, La Legión:** no tenían un campo de dato distinto de lo que ya
  se mostraba — se escribieron **29 + 33 = 62 datos curiosos nuevos**, uno por cada
  hecho histórico y cada legión respectivamente.
- **La Guerra:** ya tenía `descripcion`; se separó en su propia tarjeta con etiqueta
  "Dato curioso" en vez de ir pegada al listado de emperadores.

`mas-o-menos.html` no cargaba `css/silueta.css` (de donde viene `.silueta-info-card`) —
se agregó el link, si no la tarjeta de dato curioso quedaba sin estilo.

## Notas técnicas

- El recorte de emblemas de legiones y la segmentación de siluetas ocultas se hicieron
  con Pillow/numpy en Python
  (`C:\Users\munca\AppData\Local\Programs\Python\Python310\python.exe`), igual que en
  fases anteriores. Los scripts de recorte de legiones no quedaron guardados como
  archivo en el repo (se iteraron en el scratchpad de la sesión); si hace falta
  retocar el recorte de alguna legión puntual, hay que rehacer el algoritmo descrito
  arriba (banda de texto por franja central + zona segura por brazo del corchete)
  contra los originales en `emblemas Legiones/`.
- Para los datos de legiones y guerras se usó un agente de research (`Agent` con
  `WebSearch`) en vez de confiar solo en conocimiento previo, dado el riesgo de
  inexactitud histórica en contenido educativo — devolvió flags explícitos de
  incertidumbre que se respetaron en el texto final (ej. destino de la IX Hispana,
  emblema de la XXII Deiotariana).
- Convención de nombres de archivo para los juegos nuevos: `silueta-oculta`,
  `mas-o-menos` (con guiones, multi-palabra) vs. `secuencia`, `orbita`, `legion`,
  `guerra` (una palabra). Sin un criterio único más allá de "lo que se sintió natural
  en el momento" — si se agregan más juegos, no hay una regla estricta que seguir.

## Estado al cerrar

Sin commitear todavía: los 6 juegos nuevos completos (html/css/js), el header JUEGOS
en `index.html`/`css/estilos.css`, `assets/img/legiones/` y `assets/img/legiones-oculto/`
(33 PNG cada una), y los cambios de "dato curioso" en `js/grid.js`/`css/grid.css` y
`js/silueta.js` de la fase anterior. Todo probado en el navegador embebido durante la
sesión (flujos completos de cada juego, casos de borde como recargar a mitad de
partida, agotar intentos, selección múltiple incompleta).

**Sin tocar / ajenos a esta sesión:** `assets/img/Instagram.html` y
`assets/img/Instagram_files/` siguen sin trackear, igual que en fases anteriores.

**Si se retoma:** quedan 10 minijuegos en total. Si se agrega un 11º, mantener el
mismo patrón (modo día + práctica, `localStorage` por juego con su propio prefijo,
modal de resultado con `.romandle-result-box`, dato curioso en el resultado) y sumar el
link cruzado en el header de los otros 10 + el menú JUEGOS de `index.html`.
