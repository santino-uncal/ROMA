# Fase 20 — Modal informativo del cristianismo al tocar la cruz del encabezado

**Fecha:** 2026-09-13

## Resumen

La cruz cristiana del encabezado (`assets/img/cruz.png`) ahora es interactiva: al tocarla
(click o Enter/Espacio con foco de teclado) abre un modal (`#cruzModalOverlay` /
`#cruzModalBox` en `index.html`) con un resumen histórico del cristianismo en Roma:

1. **Orígenes y persecuciones (s. I–III d.C.)** — con retrato de Diocleciano a la derecha
   del texto (`assets/img/diocleciano.jfif`).
2. **Tolerancia y legalización (s. IV d.C.)** — Edicto de Milán, con retrato de Constantino
   el Grande a la izquierda (`assets/img/Constantino el Grande.png`) y la traducción al
   castellano ("Con este signo vencerás") debajo de la frase en latín *"in hoc signo vinces"*.
3. **Concilios y unidad doctrinal** (sin imagen).
4. **Religión de Estado (380 d.C.)** — Edicto de Tesalónica, con retrato de Teodosio el
   Grande a la izquierda (`assets/img/Teodosio el Grande.jfif`).
5. **Legado en Oriente** — con la cruz ortodoxa a la derecha del texto
   (`assets/img/cruz ortodoxa.png`).

Cada retrato de emperador lleva su nombre en un `<figcaption>` debajo de la imagen
(clase `.modal-figure-group`); la cruz ortodoxa no lleva nombre por ser un símbolo, no un
retrato.

El modal se cierra con el botón ✕, con Escape, o clickeando fuera del cuadro
(`js/app.js`, sección "Modal informativo de la cruz cristiana"). Estilo en
`css/estilos.css`: `.modal-overlay`, `.modal-box`, `.modal-row`, `.modal-figure`,
`.modal-figure-group`, `.latin-trans`, siguiendo la paleta pergamino/bronce/dorado del
resto del sitio.

## Detalles técnicos

- Las imágenes que acompañan cada párrafo se maquetaron con `.modal-row` (flex): el orden
  del `<img>`/`<figure>` en el HTML define si queda a la izquierda o derecha del `<p>`.
- Cache-busting incrementado en `index.html`: `estilos.css?v=113`, `app.js?v=109`.
- Verificado en el navegador (servidor `roma` de `.claude/launch.json`, puerto 8777):
  apertura/cierre del modal, las cuatro imágenes cargan correctamente, y la traducción
  latina se lee en su propia línea sin quedar una coma huérfana.

## Estado al cerrar

Pendiente de commit: `css/estilos.css`, `index.html`, `js/app.js` y las nuevas imágenes
(`Constantino el Grande.png`, `Teodosio el Grande.jfif`, `cruz ortodoxa.png`,
`diocleciano.jfif`). Quedan sin trackear y sin tocar `assets/img/Instagram.html` y
`assets/img/Instagram_files/` (ajenos a esta sesión, no se commitearon).
