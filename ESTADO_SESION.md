# Estado del proyecto — Análisis venta de terrenos fiscales Chile 2026

> Handoff para retomar la sesión. Rama de trabajo: `claude/chile-land-sale-analysis-05b9mh`.
> Última actualización: 2026-07-04.

## Qué es esto
Investigación + análisis de la venta masiva de inmuebles fiscales anunciada por el
gobierno de Kast (Hacienda: J. Quiroz; Bienes Nacionales: C. Parot). Plan: ~1.200
propiedades, primer paquete ~350 a licitar fines de 2026, meta US$200-300 MM (FEES).
Reconstruimos la cartera candidata desde el catastro público (ArcGIS de Bienes
Nacionales), la valorizamos, la rankeamos y cruzamos con Planes Reguladores (MINVU).

## Entregables (todos en la raíz del repo, committeados)
| Archivo | Contenido |
|---|---|
| `potencial_sitios.xlsx` | Potencial por sitio: altura / comercial / industrial + norte energía-minería |
| `predios_score_PRC_top250.xlsx` | Top 250: score + UF/US$ + zona PRC + link Google Maps |
| `predios_fiscales_score.xlsx` | 1.612 predios rankeados por probabilidad de venta (0-100) |
| `predios_fiscales_vendibles.xlsx` | Maestro 5 regiones (RM, Valpo, Biobío, Tarapacá, Antofagasta) |
| `predios_disponibles.xlsx` | 184 "disponibles sin acto" (máxima convicción) |
| `cartera_fiscal_web.html` | Explorador web (artifact: https://claude.ai/code/artifact/471c365a-6a62-4475-8f1e-b730a97ccd5d ) |
| `mapa_top250_PRC.html` | Mapa: predios + zonificación PRC; popup con norma completa en vivo |
| `mapa_top100/250_predios.html/.png` | Mapas de probabilidad |
| `Informe_inversionista_predios_fiscales.docx` | Tesis + metodología + limitaciones |
| `Informe_terrenos_fiscales_Chile.docx` / `analisis_terrenos_fiscales_chile.md` | Informe técnico |
| `solicitud_transparencia_inmuebles_fiscales.md` | Solicitud Ley 20.285 lista para ingresar |
| CSVs: `predios_fiscales_vendibles_TODO/limpio`, `predios_norte`, `centroides_centro`, `zonas_prc_top250` | Datos crudos |
| `capturar_norma_completa.js` / `enriquecer_prc_top250.js` | Scripts de consola (el usuario los corre en su navegador) |

## Fuentes de datos (mi red bloquea .gob.cl y arcgis.com; el usuario corre scripts en SU navegador y sube los CSV)
- Catastro nacional (RM/Valpo/Biobío, 1.253, campo MODO): `services2.arcgis.com/mQ0T5ijzGExuCc9o/.../Propiedad_Fiscal_Administrada/FeatureServer/0`
- Tarapacá (315): `services3.arcgis.com/cTnMkBRk4HWkUCRo/.../Visor_PGIOT_Región_de_Tarapacá/FeatureServer/39`
- Antofagasta (1.470): `services6.arcgis.com/9yX8xdylSYIPqL3X/.../Base_de_Datos_Antofagasta_WFL1/FeatureServer`
- PRC MINVU: `geoide.minvu.cl/server/rest/services/IPT/` → `PRC_RM_Norte`, `PRC_RM_Sur`, `PRC_Valparaíso`, `PRC_Biobio` (¡NO existe PRC_Metropolitana!)

## Metodología clave (resumen)
- Tenencia (MODO): ".."=disponible (94 centro) > concesión gratuita corto plazo (recuperable,
  caso La Parva) > arriendo/onerosa > destinación/afectación/radicación = NO vendible.
- Score 0-100: tenencia (55) + región foco (15) + tamaño (10) + rol asignado (10) + confianza dato (10).
  Bandas por percentiles. Valores: UF/m² de referencia por comuna; avalúo fiscal ≈ 50% mercado.
- Filtro falsos positivos: cerros, parques, fajas viales/FFCC, >10 ha.
- Norte sin campo de tenencia limpio → clasificación por texto (marcada "gruesa").

## Pendientes / próximos pasos posibles
1. El usuario tiene pendiente correr `capturar_norma_completa.js` (captura TODOS los campos
   de la norma PRC → `zonas_prc_full_top250.csv`); al subirlo, fusionar en la planilla final.
2. Completar zona PRC de los ~91 predios top-250 sin norma (reintentar identify MINVU).
3. Ingresar la solicitud de Transparencia y contrastar con la nómina oficial cuando llegue.
4. Afinar valores con avalúos SII reales por rol (Data Inmobiliaria agotó cupo demo).
5. Vigilar licitaciones.bienes.cl y Mercado Público desde Q4 2026 (primer paquete ~350).

## Reglas de trabajo acordadas con el usuario
- Trabajar autónomo, sin pedir permiso para pasos reversibles.
- Todo entregable se commitea y pushea a `claude/chile-land-sale-analysis-05b9mh`.
- Los datos de ArcGIS/MINVU los captura el usuario en su navegador (scripts de consola) y
  sube los CSV; verificar siempre estructura antes de fusionar.
- Ser explícito sobre limitaciones: datos referenciales, no nómina oficial, valores de
  referencia (no tasaciones).
