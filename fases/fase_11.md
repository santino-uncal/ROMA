# Fase 11 — Mapas por emperador en el Imperio Bizantino

**Fecha:** 2026-09-12
**Commits:** (pendiente de commitear al cerrar esta fase)

## Punto de partida

La Fase 10 había dejado el mecanismo de `mapaEspecial` (mapa específico por entrada,
prioritario sobre `HITOS_BIZANTINO`) implementado para Occidente, con el pendiente
explícito de repetirlo en Bizantino (79 entradas, 395–1453 d.C.), que hasta ahora solo
tenía 4 rangos genéricos muy amplios (395–526, 527–716, 717–1203, 1204–1453).

El usuario subió 36 mapas sueltos a `assets/` (formato `.bmp`, nombre
`Imperio bizantino <año>.bmp`, algunos con espacio final antes de la extensión) a lo
largo de la sesión anterior, cubriendo años puntuales entre 578 y 1425. Pidió
explícitamente:
- Repetir con Bizantino el mismo trabajo hecho con Occidente.
- Para el tramo 565–578 (Justino II), donde no subió ningún mapa, dejar el mapa de
  Wikipedia que ya había (el hito genérico `BIZANCIO_JUSTINIANO`).
- Para todo el tramo hasta Justiniano I (395–518, es decir Arcadio a Justino I), usar el
  mapa de la división administrativa del 395 que el usuario había hecho en Paint —el mismo
  que ya se usaba para Honorio en Occidente (`assets/img/occidente-395-division.png`).

## Qué se hizo

1. Convertidos los 36 `.bmp` de `assets/` a `.png` en `assets/img/bizantino-<año>.png`
   (mismo patrón que `occidente-<año>.png`), con Python/PIL (`py`, no `python`/`node`).
2. Revisados visualmente varios mapas (especialmente los años con posible ambigüedad:
   641, compartido por dos emperadores que arrancan ese año; 685 vs. 705, los dos reinados
   de Justiniano II; 1261, el año exacto de la reconquista de Constantinopla bajo Miguel
   VIII) para decidir la asignación correcta.
3. Agregado el campo `mapaEspecial` en `js/datos.js` a 45 de las 79 entradas de
   `bizantino`, vía script Python que parsea el archivo como JSON (`window.ROMA_DATA = {...};`)
   y lo reserializa con `json.dumps(..., indent=2)` — verificado antes con un roundtrip que
   el reserializado es carácter por carácter idéntico al original antes de tocar nada, para
   no ensuciar el diff.
   - **Arcadio, Teodosio II, Marciano, León I, León II, Zenón, Anastasio I, Justino I**
     (395–527, hasta Justiniano): reusan `occidente-395-division.png`, con captions
     individualizados que aclaran que es el mismo mapa que Honorio en Occidente y que el
     territorio de Oriente se mantuvo estable en ese tramo.
   - **Justiniano I** (527–565) y **Justino II** (565–578): sin cambios, siguen con el
     hito genérico `BIZANCIO_JUSTINIANO` (mapa de Wikipedia, 555 d.C.) — a pedido explícito
     del usuario para el segundo caso, y porque para el propio Justiniano ese hito ya era
     el mapa correcto.
   - **37 entradas de 578 a 1425** reciben su propio `mapaEspecial` con el año exacto
     provisto por el usuario: Tiberio II Constantino (578), Focas (602), Heraclio (610),
     Constantino III y Heraclonas + Constante II (641, compartido), Justiniano II (685, su
     primer reinado), Tiberio III (698), Filípico Bardanes (711), Constantino V (741),
     León IV (775), Constantino VI (780), Irene de Atenas (797), Nicéforo I (802), Teófilo
     (829), Miguel III (842), Basilio I (867), Alejandro (912), Romano II (959), Nicéforo II
     Focas (963), Basilio II (976), Constantino VIII (1025), Teodora (1055), Miguel VII
     Ducas (1071), Nicéforo III Botaniates (1078), Juan II Comneno (1118), Isaac II Ángelo
     (1185, cubre también su restauración de 1203), Alejo III Ángelo (1195), Alejo IV
     Ángelo (1203), Alejo V Murzuflo (1204), Teodoro II Láscaris (1254), Miguel VIII
     Paleólogo (1261, año de la reconquista de Constantinopla, no el inicio de su reinado
     en 1259), Andrónico III Paleólogo (1328), Juan V Paleólogo (1341), Juan VI Cantacuceno
     (1347), Andrónico IV Paleólogo (1376), Juan VIII Paleólogo (1425).
   - **Constantino XI Paleólogo** (1449–1453, último emperador): sin mapa propio, reusa el
     de Juan VIII (1425) como referencia más cercana, aclarando en el caption que el
     territorio real para su reinado era aún menor (solo Constantinopla).
   - El mapa `705.bmp` (segundo reinado de Justiniano II) quedó convertido a
     `assets/img/bizantino-705.png` pero sin usar: el modelo de datos solo admite un
     `mapaEspecial` por entrada y se priorizó el mapa de 685 (coincide con el inicio del
     periodo mostrado en la ficha).
   - Quedan 34 entradas sin `mapaEspecial` (siguen con los hitos genéricos de
     `HITOS_BIZANTINO`) por no tener mapa provisto por el usuario para ese año exacto
     (ej. Mauricio, Constantino IV, Leoncio, León III, la mayoría de los Comnenos, etc.).
4. Probado en navegador (servidor local `roma`, puerto 8777): Arcadio muestra el mapa de
   división con caption correcto, Constante II y Constantino III y Heraclonas comparten el
   mapa de 641, Constantino XI reusa el mapa de 1425, y Justino II sigue cayendo al hito
   genérico de Wikipedia (confirmado por request 200 y texto de la ficha).

## Cache-busting

`index.html`: `?v=98` → `?v=99`.

## Estado al cerrar

Pendiente de commitear y pushear. Los `.bmp` originales quedan sin trackear en
`assets/` (mismo criterio que con los mapas de Occidente: solo se versionan los `.png`
procesados en `assets/img/`).
