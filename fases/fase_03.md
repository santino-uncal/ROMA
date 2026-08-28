# Fase 3 — Retratos de cónsules: -508 a -499 a.C.

**Fecha:** 2026-08-28
**Commit(s):** `d4f92e5`, `eafd008`, `8e2966f`, `dc8b8de`, `94297fd`, `4d87bcd`,
`209707b`, `609ce7d`, `fe6bf82`, `b5e0d38`

## Punto de partida

Solo el -509 a.C. tenía retratos (Bruto y Colatino, hecho en Fase 1/2). El objetivo de
esta fase fue seguir agregando los retratos de los cónsules año por año, empezando por
el -508, con el mismo formato que el -509.

## Qué se hizo

### Mecánica nueva (commit `d4f92e5`)

Se agregó soporte para cónsules **sin retrato conocido**. Antes cada objeto de `imagenes`
requería una imagen; ahora puede llevar solo `label` (+ `abbr` opcional):

- `js/app.js`: nueva función `fillMiniGroup(group, img, caption, data)` que reemplaza el
  bloque duplicado left/right de `renderPortrait()`. Si `data.imagen` falta, oculta el
  `<img>`, pinta el círculo con `hashColor(label)` y escribe dentro la abreviación
  (`data.abbr` o, si no hay, `getInitials(label)`).
- `css/estilos.css`: regla `.portrait-mini-group .portrait-circle .portrait-abbr`
  (font-size 13px) para que entre el texto tipo `T. L. T.` en el círculo de 48px.

### Convención de nombres (normalizada por el usuario)

- **Pie del retrato (`label`):** nombres de pila con inicial + punto; apellido completo.
  Ej: `P. V. Publícola`, `T. H. Aquilino`, `E. Larcio`.
- **Círculo (`abbr`, solo sin foto):** todo con inicial + punto, apellido incluido.
  Ej: `T. L. T.`, `M. H. P.`, `T. H. A.`.

### Entradas cargadas en `js/datos.js` (era "republica")

| Año   | Izquierda                     | Derecha                          |
|-------|-------------------------------|----------------------------------|
| -508  | P. V. Publícola (retrato-10)  | T. L. Tricipitino (abbr)         |
| -507  | P. V. Publícola (retrato-10)  | M. H. Pulvilo (abbr)             |
| -506  | E. Larcio (abbr)              | T. H. Aquilino (abbr)            |
| -505  | M. V. Voluso (abbr)           | P. P. Tuberto (abbr)             |
| -504  | P. V. Publícola (retrato-10)  | T. L. Tricipitino (abbr)         |
| -503  | A. M. Lanato (retrato-11)     | P. P. Tuberto (abbr)             |
| -502  | E. C. Vecelino (abbr)         | Ó. V. Tricosto (abbr)            |
| -501  | T. Larcio (abbr, único)       | — (grupo oculto)                 |
| -500  | M. T. Longo (abbr)            | S. S. Camerino (abbr)            |
| -499  | T. E. Helva (abbr)            | P. V. G. Cicurino (abbr)         |

Notas:
- Imágenes nuevas: `assets/img/retratos/retrato-11.jpg` (Agripa Menenio Lanato, grabado
  "MEMNIVS AGRIPPA"). `retrato-10.jpg` (Publícola) ya existía y se reutiliza.
- -501: la entrada está centrada en el dictador Tito Larcio, no en los dos cónsules →
  un solo medallón (izquierdo); el grupo derecho queda `hidden`.
- -503: para Tito Herminio Aquilino había una lámina de batalla; se decidió NO usarla
  (no es un busto, ilegible a 48px) y dejar la abreviación.

## Verificación

Cada año probado en el navegador (servidor local `python -m http.server 8777`, vista
República): título, período, pies y abreviaciones / carga de fotos correctos. El -509
sigue funcionando sin regresión.

## Estado al cerrar

Todo commiteado en `master`. Working tree limpio.

## Pendiente / próximos pasos

- Continuar desde el **-498 a.C.** en adelante con el mismo flujo.
- Próximo archivo de imagen libre: `retrato-12.jpg`.
- Pregunta abierta menor: si el usuario prefiere `P. V. Gémino Cicurino` (apellido
  compuesto) en lugar de `P. V. G. Cicurino` para el -499.
