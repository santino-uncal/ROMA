# Fase 25 — Contenido diferenciado por era: Imperio Bizantino e Imperio de Occidente

**Fecha:** 2026-09-17

## Resumen

Sesión dedicada a hacer que los 5 modales de encabezado (ejército/estandarte, administración,
economía, política, cristianismo) muestren **contenido distinto según la era activa**, en vez
de mostrar siempre el mismo texto centrado en la República/Alto Imperio. Se construyó primero
para el **Imperio Bizantino** y después se replicó el mismo patrón para el **Imperio de
Occidente**, cada uno con investigación e íconos propios.

## 1. Mecanismo genérico (`js/app.js`, dentro de `setEra()`)

Cada párrafo/fila/figura de los modales quedó marcado con una clase:
- `.roman-only`: contenido de la República o el Alto Imperio (visible salvo en
  Bizantino/Occidente).
- `.byz-only`: contenido exclusivo del Imperio Bizantino.
- `.occ-only`: contenido exclusivo del Imperio de Occidente.

`setEra(era)` recorre las tres clases con `querySelectorAll` y hace
`el.style.display = '' o 'none'` según corresponda — sin tocar el layout de cada elemento
(flex/block se resuelve solo al volver a `''`, no hace falta hardcodear el valor). Esto
reutiliza el mismo patrón que ya usaba `conflictsBoxBizantino` en fases anteriores.

También en `setEra()`: swap de ícono + `alt` de `estandarteBtn`/`cruzBtn`/`adminBtn`/
`economiaBtn`/`politicaBtn`, y del `textContent` de `estandarteModalTitle`, según la era.

## 2. Imperio Bizantino

- **Iconografía**: `paganBtn` (águila de Júpiter) se oculta por completo — el paganismo ya
  terminó para el 395. `cruzBtn` cambia a `assets/img/cruz ortodoxa.png` (venía con fondo
  blanco opaco, se le sacó con el mismo flood-fill + `scipy.ndimage.label` desde los bordes
  usado en fases anteriores para el águila del paganismo). `estandarteBtn` cambia a
  `assets/img/Ejercito Bizantino.png` (bandera tetragrámica de los Paleólogos, también
  provista con fondo blanco y corregida igual).
- **Modal del ejército**: título pasa a "🦅 El ejército de Bizancio"; se oculta todo lo
  anterior a Diocleciano (antes de Mario, reforma de Mario, Carrhae/Teutoburgo, la
  recuperación de Augusto, el cuadro de emblemas de legiones) y sólo queda el bloque
  "El fin de la legión y el ejército bizantino" (limitanei/comitatenses → sistema de
  temas, tagmata, catafractos, Guardia Varega, lábaro) con la bandera bizantina como
  figura grande. **Iteración pedida por el usuario**: al principio este párrafo convivía
  con todo el resto y con un cierre genérico ("Un símbolo que perdura", con la imagen
  águila+SPQR hablando del Sacro Imperio Germánico/Napoleón) — el usuario pidió sacar ese
  cierre "de SPQR" y agrandar el texto bizantino, y después pidió directamente ocultar
  todo lo anterior a Mario cuando se está en esa era.
- **Modal de administración**: se agregó y quedó como `byz-only` un párrafo sobre el
  sistema de temas + el *Corpus Iuris Civilis* de Justiniano + el origen de "bizantino"
  como sinónimo de trámite complicado (esto último agregado a pedido explícito del
  usuario de que el texto no quedara corto al ser el único contenido visible).
- **Modal de economía**: párrafo `byz-only` sobre el sólido de oro, el contrabando de la
  seda bajo Justiniano, el eparca de Constantinopla, y el quiebre del dominio comercial
  tras la Cuarta Cruzada (1204).
- **Modal de política**: párrafo `byz-only` sobre eunucos, matrimonios dinásticos,
  "nacida en púrpura", ceguera política, más el motín de Nika (532) y la conjura de
  Basilio I (867) agregados en la misma pasada de expansión.
- **Modal de cristianismo**: párrafo `byz-only` "Legado en Oriente" expandido con
  Iconoclasmo (726–843), Cisma de Oriente-Occidente (1054), y la misión de Cirilo y
  Metodio a los eslavos.

## 3. Imperio de Occidente

Mismo patrón que Bizancio, pero **sin ocultar el paganismo ni cambiar la cruz** (el
usuario no lo pidió, y no hay justificación histórica: en 395–476 el cristianismo
occidental sigue siendo el mismo credo niceno, sin cisma todavía).

- **Iconografía**: `estandarteBtn` cambia a `assets/img/estandarte-occidente.jpg`
  (bandera del chi-rho, la misma imagen ya usada en el botón "Imperio de Occidente" del
  title-row) — esta imagen no necesitó corrección de transparencia, es un JPG con fondo
  rojo sólido que ya se veía bien.
- **Modal del ejército**: título "🦅 El ejército de Occidente"; contenido nuevo
  (`occ-only`) sobre la barbarización del ejército (*foederati* visigodos/vándalos/
  ostrogodos/suevos, Estilicón y Ricimero como generales-reyes en las sombras) y el fin
  administrativo (no una batalla) con Odoacro deponiendo a Rómulo Augústulo en el 476.
- **Modal de administración**: párrafo `occ-only` sobre la mudanza de la corte a Rávena
  (402), los tratados de *foederati* cediendo territorio, y la disolución en reinos
  bárbaros para el 476.
- **Modal de economía**: párrafo `occ-only` sobre el colapso fiscal, la pérdida del
  grano africano tras la toma vándala de Cartago (439), y el repliegue a villas
  fortificadas autosuficientes como preludio del feudalismo.
- **Modal de política**: párrafo `occ-only` sobre Estilicón/Aecio ("el último de los
  romanos", Campos Cataláunicos 451)/Ricimero como poder real detrás de emperadores
  títere, y el mismo cierre con Odoacro y Rómulo Augústulo.
- **Modal de cristianismo**: párrafo `occ-only` sobre el arrianismo de los pueblos
  bárbaros asentados, *La Ciudad de Dios* de Agustín de Hipona (413–426, escrita en
  respuesta al saqueo de Alarico), y el papa León I ante Atila (452) y Genserico (455).

## Notas técnicas

- Investigación histórica de esta fase basada en conocimiento del modelo, sin agente de
  research dedicado (a diferencia de legiones/guerras en la fase 23) — son eventos y
  personajes de alta notoriedad (Estilicón, Aecio, Ricimero, Odoacro, Agustín, León I,
  Corpus Iuris Civilis, Cisma de 1054) donde el riesgo de error factual es bajo.
- `assets/img/Politica.png` en la fase 23, `assets/img/cruz ortodoxa.png` y
  `assets/img/Ejercito Bizantino.png` en esta fase: **tercera y cuarta vez** que una
  imagen provista por el usuario viene con fondo blanco opaco en vez de transparente —
  ya es el patrón más común, no la excepción. Conviene chequear el canal alfa de entrada
  como primer paso antes de usar cualquier imagen nueva de ícono/bandera.
- El emoji del título del modal de ejército no se probó con variation selectors nuevos en
  esta fase (se reusó 🦅 para ambas eras); si se agrega una cuarta era con ícono de
  título nuevo, recordar el problema ya documentado con 🗳️ (fase 23) que no renderiza
  bien en el navegador embebido.
- El screenshot del navegador embebido de esta sesión quedó "pegado" varias veces
  después de hacer cambios de estado por JS (mismo problema ya visto en fases
  anteriores) — un scroll de 1 tick o volver a tomar la captura lo resuelve; no es un
  bug real de la página, sólo de la herramienta de captura.

## Estado al cerrar

Commiteado en esta sesión: los cambios de `index.html` y `js/app.js` de toda la fase, más
`assets/img/cruz ortodoxa.png` (corregida) y `assets/img/Ejercito Bizantino.png` (nueva,
corregida). Todo probado en el servidor local (`roma`, puerto 8777): los 5 modales en
Imperio, Bizantino y Occidente, en ambas direcciones de cambio de era.

**Sin tocar / ajenos a esta sesión:** `assets/img/Instagram.html` y
`assets/img/Instagram_files/` siguen sin trackear, igual que en fases anteriores.

**Si se retoma:** el mismo mecanismo (`roman-only`/`byz-only`/`occ-only` + swap de
íconos/alt/título en `setEra()`) queda listo para extenderse a Monarquía o República si
se pidiera contenido específico de esas eras — hoy `roman-only` cubre indistintamente
Monarquía, República e Imperio como un solo bloque "romano genérico".
