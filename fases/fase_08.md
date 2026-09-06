# Fase 8 — Medallones siglos IV y III a.C. + retratos de Camilo y Torcuato

**Fecha:** 2026-09-06
**Commits:** `86a1829`, `318a54d`, `abff22c`, `b4c771e` (todos pusheados a `origin/master`)

## Punto de partida

La Fase 7 dejó el buscador de cónsules y el traductor al latín. Los medallones de la era
República estaban hechos hasta el **-400 a.C.**. Próximo archivo de imagen libre:
`retrato-12.jpg`. Cache-busting en `?v=77`.

## Qué se hizo

### 1. Medallones del siglo IV a.C. — `-399` a `-301` (`86a1829`)

- Se agregó el array `imagenes` a cada año de `js/datos.js` (era `republica`) en ese rango,
  con un medallón por los **dos primeros nombres** del título (o único para los años de
  dictador: `-333`, `-324`, `-309`, `-301`).
- Se **omitieron** (sin `imagenes`) los años sin magistrados nombrados: `-375`/`-374`/`-373`
  y `-371` (bloqueo de elecciones), `-370`/`-369`/`-368` (tribunos "diversos"). → 92 años.
- Todos con abreviatura (`abbr`), sin foto nueva.
- Praenómenes nuevos decididos: **"Cesón"** entero en pie y círculo (`Cesón Duilio` /
  `Cesón D.`); **"Décimo" → `D.`**; "Apio Claudio el Ciego" → `A. C. Ciego` / `A. C. C.`;
  "Licinio" (praenomen del -376) → `L.`. Los apodos entre paréntesis se tratan como el
  último apellido: `E. P. A. Caudino` (-334/-321), `C. V. P. Flaco` (-331).
- Hecho con un script (`scratchpad/add_medallones_s4.py`): saca los nombres del campo
  `titulo` y hace regex-replace sobre el `.js`.

### 2. Retratos de Furio Camilo y Manlio Torcuato (`318a54d`, reencuadre `abff22c`)

- El usuario pidió revisar **los 218 cónsules/tribunos distintos** de `-509` a `-301` en
  Wikipedia (español; si no hay, inglés) y poner foto donde exista.
- Resultado: de toda esa era, **solo dos** tienen una imagen usable como retrato de perfil:
  - **`retrato-12.jpg`** = Marco Furio Camilo (grabado del *Promptuarii Iconum Insigniorum*,
    Rouillé 1553; misma serie que Bruto/Colatino/Publícola). Años `-394`, `-386`, `-381`.
  - **`retrato-13.jpg`** = Tito Manlio Imperioso Torcuato (cabeza recortada de un grabado de
    H. Goltzius, serie "héroes romanos"). Años `-347`, `-344`, `-340`. Reencuadrado un poco
    más arriba en `abff22c` (menos cuello, casco completo).
- **Marco Valerio Corvo se quedó con abreviatura**: los grabados de Goltzius que existen lo
  muestran de espaldas. El resto de la era no tiene retrato disponible (los "hits" eran
  mapas, portadas de libro, monedas mal enlazadas o pinturas de escenas).
- Sondeo hecho con la MediaWiki API (`prop=pageimages|langlinks`) en lotes; scripts en
  `scratchpad/` (`wiki_lookup.py`, `build_contactsheet.py`). **No repetir este barrido**
  salvo pedido explícito.
- Próximo archivo de imagen libre: **`retrato-14.jpg`**.

### 3. Medallones del siglo III a.C. — `-300` a `-201` (`b4c771e`)

- Mismo criterio: un medallón por los dos primeros nombres; único para el `-287` (dictador
  Quinto Hortensio, "Última secesión de la plebe"). Se omitió el `-286` ("Cónsules
  inciertos"). El `-288` no existe como entrada en `datos.js` (ya faltaba). → 98 años.
- Todos con abbr, sin foto nueva. Praenomen "Ser" (así en el título del -255) → `S.`.
- Script: `scratchpad/add_medallones_s3.py`.

### Cache-busting

`index.html`: `?v=77` → `?v=81` (78 = siglo IV, 79 = retratos, 80 = reencuadre Torcuato,
81 = siglo III).

## Verificación

Server local `roma` (puerto 8777). Probado: `-347` y `-333` (siglo IV), `-218` (Escipión y
Sempronio Longo) y `-287` (dictador único, medallón izquierdo solo) del siglo III, y el
render de `retrato-12`/`retrato-13` dentro del círculo. JSON de `datos.js` parsea OK, sin
errores de consola. (La captura de pantalla del preview falló varias veces por la ventana
minimizada; la verificación se hizo por DOM + red.)

## Fuera del proyecto (no commiteado)

El usuario pidió un mapa SVG de Europa (base "Blank map europe no borders.svg" de Wikimedia)
extendido al sur hasta la frontera Egipto-Sudán (paralelo 22°N) y al este hasta Bakú. Como
el original es un trazado a mano sin proyección conocida, se **reconstruyó** desde Natural
Earth 1:50m (equirectangular, paralelo estándar 50°N, extensión lon -25→52, lat 22→75),
mismo estilo (gris `#b3b3b3`, sin fronteras, mar transparente). Se entregó SVG + PNG en
`C:\Users\munca\Downloads\` y **el usuario pidió explícitamente NO incluirlo en el proyecto**
(se borró la copia que se había puesto en `assets/img/`). Scripts en `scratchpad/`
(`build_extended_map.py`, `render_check.py`). El proyecto usa mapas por URL de Wikimedia en
`js/mapas.js`, no archivos locales.

## Estado al cerrar

Todo commiteado y pusheado. Working tree limpio. Medallones de la República hechos hasta
el **-201 a.C.**

## Pendiente / próximos pasos

- **-200 a.C. en adelante** (siglo II): seguir con los medallones si el usuario quiere.
  Próximo archivo de imagen libre: `retrato-14.jpg`.
- Automatizar el `?v=N` de cache-busting (sigue a mano; va en 81).
