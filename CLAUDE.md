# CLAUDE.md

Contexto del repositorio para Claude Code. Se lee al inicio de cada sesión.

## Qué hay en este repo

Un único sistema, en un solo archivo autocontenido:

**`Leasit-v44-POPUP-FINAL.html`** — Leasit, plataforma de evaluación de crédito
para operaciones de **leasing** en Chile. ~960 líneas, sin build ni backend:
se abre directo en el navegador.

## Stack

- React 18 + ReactDOM por CDN (jsdelivr). **Sin JSX**: todo se escribe con
  `h(...)` (`React.createElement`). Si agregas UI, mantén ese estilo.
- jsPDF + jspdf-autotable → exportación de expedientes a PDF A4.
- SheetJS (`xlsx`) → importación de balances/scoring desde Excel.
- Fuentes DM Sans / DM Mono. Estilos en un `<style>` inline con variables CSS
  (`--navy`, `--blue`, `--green`, `--amber`, `--red`, …). Sidebar navy fija de
  220px + topbar.
- Estado global = `useState` en el componente `App`. No hay router ni store:
  la navegación es `page` (`dashboard` / `expedientes` / `nueva` / `detail`).

## Modelo de negocio (lo importante)

### Scoring por pilares — `PILARES`
Cinco pilares ponderados que suman 100:

| Pilar | Peso | Criterios |
|---|---|---|
| P1 Capacidad de pago | 30 | dscr, df_ebitda, fcl, estac |
| P2 Solidez financiera | 25 | cdt, de, liq, marg |
| P3 Calidad del activo | 20 | vr, mkt, vu, esp |
| P4 Perfil del cliente | 15 | ant, dicom, bco, conc |
| P5 Entorno y sector | 10 | ind, comp, ciclo |

Cada criterio tiene `max` y, o bien `auto:true` (lo calcula el motor), o bien
`options` (lo elige el analista). `calcScore()` normaliza cada pilar
(`raw/maxRaw * peso`) y suma.

### Funciones núcleo
- `calcCuota(valor, pie, plazo, tasa)` — cuota francesa mensual/anual sobre el
  monto financiado (`valor * (1 - pie/100)`).
- `autoScores(fin, op, redec)` — deriva DSCR, DF/EBITDA, FCL, capital de
  trabajo, D/E, liquidez corriente y ácida, y castigo por mora REDEC. Devuelve
  también los valores crudos con prefijo `_` (`_dscr`, `_liqC`, …) para mostrar.
- `classify(total)` — nota y decisión: **A+** ≥85 · **A** ≥75 · **B+** ≥65 ·
  **B** ≥55 · **C** ≥40 · **D** <40 (rechazo).
- `getAlerts(scores, op)` — **vetos**: protestos vigentes en DICOM
  (`dicom === 0`) y capital de trabajo crónicamente negativo (`cdt === 0`).
  Advertencias: DSCR insuficiente (`< 4`) y pie menor a 20%.
- `analizarPortafolio(expedientes)` — resumen de cartera (se muestra con
  `window.alert` desde la sidebar).
- `fetchREDEC(rut)` — **mock** con `setTimeout(800)` y tres RUTs hardcodeados.
  No hay integración real con REDEC.

## Pantallas

1. **Login** — usuarios demo en `DEMO_USERS` (password `demo123`), con una
   pestaña aparte para pegar la API key de Anthropic.
2. **Dashboard** — tarjetas de estadísticas + últimos expedientes.
3. **Expedientes** — tabla completa con ID, empresa, RUT, activo, UF, score,
   estado y analista.
4. **Nueva evaluación** — wizard de 4 pasos (`STEPS`): Identificación → Datos
   financieros → Scoring cualitativo → Resultado. Incluye carga de PDF y de
   Excel para autocompletar.
5. **Detalle de expediente** — desglose por pilar, alertas, cambio de estado y
   exportación a PDF.

Estados de expediente: `aprobado`, `comite`, `rechazado`, `en_revision`.

## Integración con la API de Anthropic

En `NuevaEval` se sube un PDF (estado financiero o carpeta de crédito), se
codifica en base64 y se manda a `https://api.anthropic.com/v1/messages` con
`anthropic-dangerous-direct-browser-access: true`, pidiendo un JSON plano con
los datos extraídos para prellenar el formulario.

Dos cosas a tener presentes al tocar esta parte:
- El modelo está fijo en `claude-sonnet-4-20250514`, que ya quedó atrasado;
  conviene migrar a `claude-sonnet-5`.
- La API key se guarda en `localStorage` (`le_apikey`) y viaja desde el
  navegador del usuario. Aceptable para una demo, no para producción: ahí
  correspondería un proxy en el servidor.

## Datos

Todo es demo en memoria: `DEMO_USERS` y `DEMO_EXP` (5 expedientes,
`EXP-2026-0038` a `EXP-2026-0042`). No hay persistencia — al recargar se pierde
lo creado. Los IDs nuevos se generan como `EXP-2026-00NN` a partir del largo
del arreglo.

## Convenciones al trabajar acá

- Todo vive en el mismo HTML: estilos, lógica y componentes. No lo separes en
  módulos salvo que se pida explícitamente.
- La UI está en español chileno; los montos van en UF (`uf()`), los ratios con
  sufijo `x` (`fmt2()`).
- Al cambiar el modelo de scoring, actualiza a la vez `PILARES`, `autoScores()`,
  `classify()` y los `scores` de `DEMO_EXP`, o los expedientes demo quedan
  inconsistentes con el total mostrado.

## Git

Rama de trabajo asignada: `claude/your-systems-nhv9ga`. Rama base: `main`.
