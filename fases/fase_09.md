# Fase 9 — Cierre de los medallones de la República + retratos en todas las eras

**Fecha:** 2026-09-09
**Commits (todos pusheados a `origin/master`):**
`f166f10`, `e2624f5`, `955e548`, `eaf012b`, `e05c1e9`, `e68cc94`, `38fe5af`, `21a5edb`, `34ea875`

## Punto de partida

La Fase 8 dejó los medallones de la era República hechos hasta el **-201 a.C.** y solo dos
retratos reales en toda esa era (Camilo `retrato-12`, Torcuato `retrato-13`). El Imperio,
Occidente y Bizancio no tenían ningún retrato. Cache-busting en `?v=81`.

## Qué se hizo

### 1. Medallones siglo II a.C. — `-200` a `-101` (`f166f10`, `?v=82`)

- Un medallón por los dos primeros nombres de cada año (100 años, sin omisiones: todos
  con dos cónsules nombrados). Todos con `abbr`, sin foto.
- Criterios nuevos: **"Cneo"** entero en pie y círculo; **"Mamerco"** entero en el pie e
  inicial en el círculo (-77); `-168` "Lucio Emilio Paulo (Macedónico)" → paréntesis de
  una palabra tratado como último apellido → `L. E. P. Macedónico`.
- Script `scratchpad/add_medallones_s2.py`.

### 2. Medallones siglo I a.C. — `-100` a `-27` (`e2624f5`, `?v=83`) — **cierra la era**

- 73 años. Medallón único para los cónsules únicos (`-52` Pompeyo, `-45` César, `-34`
  Antonio ausente). Omitido el `-47` ("Ausencia de cónsules ordinarios").
- `-82` "Cayo Mario el Joven" → `C. M. Joven` (criterio "el Ciego").
- Con esto **toda la era República (-509 a -27) tiene medallones.**
- Script `scratchpad/add_medallones_s1.py`.

### 3. Retratos de emperadores — era Imperio (`955e548`, `?v=84`)

- El usuario había empezado a poner `imagen` con URLs `commons.wikimedia.org/wiki/
  Special:FilePath/…`. **Wikimedia las corta con HTTP 429** al hotlinkear. Se cambió a
  archivos locales (convención del proyecto).
- 23 bustos bajados de Commons vía la API → **`retrato-14` a `retrato-36`**. Se agregó
  Joviano (no tenía imagen). Sin retrato: solo las 4 entradas colectivas.

### 4. Retratos de Occidente y Bizancio (`eaf012b`, `?v=85`)

- Las 91 entradas (12 + 79) reciben retrato local → **`retrato-37..48`** (Occidente) y
  **`retrato-49..127`** (Bizancio). Imagen de infobox de es.wikipedia vía API
  (`scratchpad/discover_bizocc.py` + `fetch_bizocc.py`).
- Fuentes: bustos/mosaicos donde hay; *solidi*/*histamena* para la Antigüedad tardía y el
  período medio; miniaturas del Skylitzes de Madrid y del Mutinensis gr. 122 para
  Comnenos/Ángelos/Láscaris/primeros Paleólogos.
- Matches malos de Wikipedia corregidos a mano: Constancio III, Marciano ("Mars colony"),
  Mauricio (¡la bandera de Mauricio!), Romano III Argiro.
- Todo reescalado a ≤560 px y recomprimido a JPEG (carpeta `retratos` total ≈ 14 MB).

### 5. Valentiniano I — Coloso de Barletta (`e05c1e9`, `?v=86`)

- `retrato-128.jpg` = cabeza del Coloso de Barletta para "Valentiniano I y Valente"
  (última entrada individual/doble de Imperio que quedaba sin imagen).

### 6. Retratos reales para figuras clave de la República (`e68cc94`, `?v=87`)

- El usuario notó que César, Mario, Sila, etc. tienen foto en Wikipedia. Se reemplazó
  `abbr` por `imagen` en el medallón correspondiente, en todos los años en que aparecen:
  - Mario `retrato-129`, Sila `130`, Pompeyo Magno `131`, M. Licinio Craso `132`,
    Julio César `133`, Cicerón `134`, Marco Antonio `135`, Agripa `136`, Escipión el
    Africano `137`, Catón el Censor `138`, M. Claudio Marcelo `139`.
  - Octavio (-33 a -27) reusa `retrato-14` (Augusto).
- Cuidado con homónimos: `-99` "Marco Antonio (el orador)" es el abuelo; `-30` "Marco
  Licinio Craso" es el nieto → esos NO llevan la foto.
- Descartados: Escipión Emiliano (sin busto fiable), Fabio Máximo (solo una estatua de
  jardín del XVIII). Scripts `scratchpad/rep_discover.py` + `rep_apply.py`.

### 7. Periodos colectivos → entrada por emperador (`38fe5af` → `21a5edb` → `34ea875`, `?v=90`)

- El usuario pidió que cada emperador de los 4 periodos colectivos sea su propia entrada
  de la línea de tiempo (`{periodo, nombre, texto, imagen}`).
  - "Año de los Cuatro Emperadores" → Galba, Otón, Vitelio.
  - "Año de los Cinco Emperadores" → Pértinax, Didio Juliano, Pescenio Níger, Clodio Albino.
  - "La Crisis del Siglo III" → 21 entradas, de Maximino el Tracio a Numeriano.
  - "Los hijos de Constantino" → Constantino II, Constante I, Constancio II.
  - (Vespasiano y Septimio Severo ya tenían entrada propia a continuación.)
- La era Imperio pasó de **28 a 55 entradas**. Los 24 `texto` nuevos los redactó Claude
  al estilo de la casa.
- Imágenes `retrato-140..170` (bustos donde hay, *aurei*/sestercios para el resto).
- **Feature `galeria` retirada**: en `38fe5af` se había agregado un campo `galeria` +
  `#cardPortraitGallery` + branch en `renderPortrait` + CSS para mostrar N retratos en una
  card; al desdoblar todo quedó sin uso y se quitó entera (`34ea875`). Queda en git.
- Scripts `scratchpad/split_periods.py` + `split_periods2.py` + `crisis_discover.py` +
  `crisis_fetch.py`.

### Cache-busting

`index.html`: `?v=81` → `?v=90` (82 s.II, 83 s.I, 84 imperio, 85 occ/biz, 86 Barletta,
87 figuras República, 88 galería, 89 desdoble parcial, 90 desdoble total + limpieza).

## Verificación

Server local `roma` (puerto 8777). En cada tanda: JSON de `datos.js` parsea OK, imágenes
sirven 200, render de los medallones/retratos comprobado por DOM (`naturalWidth > 0`) y
capturas puntuales, sin errores de consola. Las capturas del preview siguen fallando a
menudo por la ventana en segundo plano; la verificación principal es por DOM + red.

## Estado al cerrar

Todo commiteado y pusheado. Working tree limpio.
- **República:** medallones completos `-509` a `-27`; 11 figuras clave con retrato real.
- **Imperio:** 55 entradas, todas con retrato (ninguna con solo iniciales).
- **Occidente / Bizancio:** las 91 entradas con retrato.
- Carpeta `assets/img/retratos/`: 170 archivos, ≈14 MB. **Próximo libre: `retrato-171`.**

## Pendiente / próximos pasos

- Retratos reales para más cónsules de la República si el usuario quiere (Lúculo, los
  Metelos, Emilio Paulo Macedónico, etc. — varios tienen busto o moneda).
- Emperadores del **Imperio Galo** (Póstumo, Victorino, Tétrico…) y de **Palmira**
  (Zenobia, Vabalato) dentro de la Crisis del Siglo III, si se piden.
- Automatizar el `?v=N` de cache-busting (sigue a mano, va en 90).
- La memoria `roma-retratos-consules.md` quedó muy larga — candidata a consolidación.
