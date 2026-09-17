# Fase 26 — Ocultar el águila pagana también en el Imperio de Occidente

**Fecha:** 2026-09-17

## Resumen

Sesión corta de un solo cambio, continuación directa de la fase 25 (contenido
diferenciado por era). En la fase 25 el ícono del águila pagana (`paganBtn`) ya se
ocultaba al entrar al Imperio Bizantino, pero se dejó visible para el Imperio de
Occidente porque en ese momento no había justificación clara para sacarlo. El usuario
pidió ahora ocultarlo también ahí.

## Cambio

En `js/app.js`, dentro de la rama `else if(era==='occidente')` de `setEra()`:
`paganBtn.style.display` pasa de `''` a `'none'`. El resto de esa rama (cruz sin
cambios, alt de admin/estandarte/economía/política mencionando "Imperio de Occidente",
imagen del estandarte-occidente) queda igual que en la fase 25.

Con esto, `paganBtn` queda oculto en **Bizantino y Occidente** por igual, y sólo visible
en Monarquía/República/Imperio.

## Estado al cerrar

Probado en el servidor local: el ícono desaparece al entrar a Occidente, reaparece al
volver a Imperio/Monarquía/República, y se mantiene oculto en Bizantino. Cambio mínimo,
commiteado en esta sesión.

**Sin tocar / ajenos a esta sesión:** `assets/img/Instagram.html` y
`assets/img/Instagram_files/` siguen sin trackear, igual que en fases anteriores.
