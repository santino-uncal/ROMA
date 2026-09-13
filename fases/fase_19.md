# Fase 19 — Buscador por año en todas las eras, navegación por teclado, apartado de rebeliones/guerras civiles y encabezado con estandarte y cruz

**Fecha:** 2026-09-13

## Punto de partida

Sesión de varios pedidos puntuales de UX/contenido sobre lo ya construido, sin retomar
trabajo de mapas pendiente.

## Cambios

**1. Buscador "Ir al año" en Reino, Imperio, Occidente y Bizantino** (antes solo en
República). Se generalizó `parsePeriodoRange()` (interpreta el campo `periodo`, ej.
"27 a.C. – 14 d.C.") y `jumpToYearGeneric()` en `js/app.js`. El input de año ahora tiene un
`<select>` de sufijo a.C./d.C. (`YEAR_JUMP_CFG`), con dos opciones solo en Imperio (cruza el
límite). Las flechas ↑/↓ del input respetan el sentido cronológico según el sufijo.

**2. Limpieza de 36 `.bmp` sin trackear en `assets/img/`** ("Imperio bizantino
`<año>`.bmp"). Comparación píxel a píxel (PIL) contra los `.png` ya integrados en
`mapaEspecial` desde la Fase 11 dio diferencias de 0.002%–0.018% (ruido de compresión): eran
las fuentes crudas ya usadas, no mapas nuevos. El usuario confirmó borrarlos. Detalle en
`roma-mapas-bizantino.md` (memoria actualizada con esta nota).

**3. Llave visual sobre "año de los N emperadores"** en el riel de Imperio: `RULER_GROUPS`
en `js/app.js` agrupa Galba–Vespasiano (69 d.C.), Pértinax–Severo (193 d.C.) y
Maximino–Gordiano III (238 d.C.) bajo una llave SVG curva (`makeCurlyBracePath`, fórmula
clásica de dos Q+T simétricas) con la etiqueta del período. Detalle en
`roma-llaves-emperadores-rivales.md`.

**4. Navegación por teclado en el buscador de nombre/cónsul**: ↓/↑ recorren los resultados
(`.consul-result.clickable` o `.consul-year-btn` según la era), Enter selecciona el
resaltado (o el primero si no se resaltó ninguno), Esc limpia. Al seleccionar (click o
Enter) el buscador se vacía solo (`clearSearch()`), sin que haya que borrar el texto a mano.

**5. Flechas ← → del teclado navegan Anterior/Siguiente gobernante** en cualquier era,
reusando los mismos botones (que ya se deshabilitan en los extremos). Se ignoran si el foco
está en un `<input>/<textarea>/<select>` para no romper la edición de texto.

**6. Apartado nuevo "Rebeliones y guerras civiles"** en las 5 etapas (antes solo existía
"Conflictos bélicos", con las guerras civiles mezcladas adentro marcadas "conflicto
interno"). Investigación histórica propia (no de una fuente externa) para compilar listas
de guerras civiles y rebeliones/conjuras/usurpaciones por etapa. A pedido del usuario, cada
apartado se separó en dos subtablas con encabezado `<h5>`: **Guerras civiles** (ejércitos
rivales organizados, choque sostenido) vs. **Rebeliones** (conjuras, motines, golpes más
breves) — Monarquía quedó solo con Rebeliones (nota aclaratoria: no hay guerras civiles
propiamente dichas en ese período).

**7. Separación por sub-era dentro de SPQR**: los dos apartados de Monarquía/República/
Imperio antes mostraban las 3 etapas juntas siempre (con `<h4>` por etapa) sin importar cuál
estuviera activa. Ahora cada bloque de etapa está envuelto en
`<div class="conflicts-era" data-era="...">` y `setEra()` en `js/app.js` muestra solo el que
coincide con `currentEra`, actualizando también el título del `<summary>` (`SPQR_CONFLICT_TITLES`)
para reflejar la etapa activa. Occidente/Bizantino no se tocaron (ya tenían su propio
recuadro exclusivo).

**8. Encabezado flanqueado por un estandarte legionario y una cruz cristiana**. Primero se
dibujaron dos SVG propios (águila de Júpiter sobre asta con faleras / cruz latina con
resplandor, mismo "cuerpo" para que combinen) ante la falta de un .png adecuado. El usuario
después subió sus propias imágenes (`assets/img/Estandarte.jfif`, `assets/img/cruz.jfif`,
un vexillum rojo con SPQR y una cruz de madera con sombra) y pidió reemplazar los SVG por
esas — se hizo, actualizando `index.html`. Ambas imágenes tenían fondo blanco sólido (jpg no
soporta alpha); a pedido del usuario se les quitó con `tools/remove_bg.py` (flood-fill desde
los bordes con tolerancia, para no tocar blancos internos como las letras "SPQR"), guardadas
como `assets/img/Estandarte.png` y `assets/img/cruz.png` (los `.jfif` originales quedaron
intactos, sin usar). CSS: `.header-flanked` con `overflow-x:auto` y
`justify-content: safe center` (evita que el recorte por desborde se coma contenido de los
dos lados a la vez; sin `safe`, en anchos intermedios recortaba ambos lados en vez de alinear
a la izquierda y dejar scrollear) — en mobile el usuario desliza para ver el símbolo que no
entra.

Cache-busting final: `css/estilos.css?v=107`, `js/app.js?v=108` (sin cambios en
`datos.js`/`mapas.js` esta sesión).

## Verificación

- Búsqueda por año probada en las 5 eras con casos reales (Trajano/117 d.C., Augusto/10
  a.C., Valentiniano III/450 d.C., Basilio II/1000 d.C., República sin regresión).
- Las 3 llaves de "año de los N emperadores" verificadas por posición real en el DOM
  (`offsetLeft`/`offsetWidth` de los `.tick` extremos), no solo visualmente.
- Navegación por teclado (flechas en resultados, Enter, Esc, ←/→ entre gobernantes)
  probada con eventos de teclado simulados y confirmando `cardTitulo`/`cardPeriodo`.
- Conteo de filas de las tablas de guerras civiles/rebeliones verificado por script
  (`[3,6,8,9,9]`, `[3,5]`, `[8,9]`) contra la clasificación pretendida.
- Header con estandarte/cruz probado en desktop (sin scroll), ancho intermedio (alineado a
  la izquierda, scrolleable) y mobile 375px (scroll lateral funcional). Confirmado que
  `cruz.png`/`Estandarte.png` tienen alpha=0 en las esquinas (antes blancas) y opaco en el
  centro.

## Estado al cerrar

Todo commiteado.
