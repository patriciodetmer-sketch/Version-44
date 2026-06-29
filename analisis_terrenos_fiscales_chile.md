# Análisis: terrenos fiscales del Estado chileno y plan de venta 2026

Informe consolidado · fecha de análisis: 2026-06-29

## 1. Contexto del plan

- El **gobierno de Kast** (desde 11-03-2026), vía **Ministerio de Hacienda**
  (Jorge Quiroz) + **Bienes Nacionales** (Catalina Parot), impulsa la venta de
  inmuebles fiscales para restituir los fondos soberanos (FEES). Revierte la
  línea de Bachelet II / Boric (que preservaban suelo fiscal para vivienda y
  energía).
- Magnitud: **~1.200 propiedades** objetivo; primer paquete **~350** en 16
  regiones (foco RM, Antofagasta, Biobío, Tarapacá), a licitar fines de 2026.
  Estimado: **US$200-300 millones**. 634 activos ya identificados.
- Marco legal: DL 1.939/1977; 65% de los ingresos va a gobiernos regionales.

## 2. Fuente de datos para la estimación

Catastro georreferenciado "Propiedad Fiscal Administrada" (Ministerio de Bienes
Nacionales), accedido vía servicios ArcGIS REST públicos:

- Capa **nacional** (3 regiones centrales: RM, Valparaíso, Biobío): 1.253
  predios, con campo categórico `MODO` (tenencia) — services2/mQ0T5ijzGExuCc9o.
- Capa **Tarapacá** (visor PGIOT): 315 predios — services3/cTnMkBRk4HWkUCRo.
- Capa **Antofagasta**: 2.940 predios (esquema propio, pendiente de clasificar).

Caveat: el Ministerio declara estos datos **referenciales** y no necesariamente
actualizados. NO son la nómina oficial del plan de venta (esa se obtiene por
solicitud de Transparencia — ver archivo solicitud_transparencia_*.md).

## 3. Cartera por tipo de tenencia (capa nacional, 1.253)

| MODO (tenencia)                  |   N | %   | Vendible        |
|----------------------------------|----:|-----|-----------------|
| Concesión gratuita corto plazo   | 398 | 32% | 🟡 Recuperable  |
| Destinación                      | 297 | 24% | 🔴 En uso       |
| Concesión gratuita largo plazo   | 164 | 13% | 🟡 Difícil      |
| Arrendamiento                    | 161 | 13% | 🟡 Posible      |
| ".." (sin acto / disponible)     | 102 |  8% | 🟢🟢 Vendible   |
| Radicación                       |  82 |  7% | 🔴 Social       |
| Afectación                       |  34 |  3% | 🔴 Obra pública |
| Permiso ocupación                |  14 |  1% | 🟡 Precario     |
| Concesión onerosa                |   1 |  0% | 🟡              |

CLASIFICA: 1.246 URBANO, 4 RURAL, 3 AMBOS.

## 4. Vendibilidad (3 niveles)

- 🟢 Tier 1 (directo): disponibles (102) + concesión gratuita corto (398) = **500 (40%)**
- 🟡 Tier 2 (posible): concesión largo + arriendo + permiso + onerosa = **340 (27%)**
- 🔴 Tier 3 (no vendible): destinación + radicación + afectación = **413 (33%)**

Matiz político: las 398 concesiones gratuitas de corto plazo son lotes chicos
entregados a municipios/juntas de vecinos/clubes — recuperarlos para vender es
sensible (caso La Parva). El núcleo limpio son los ~102 disponibles.

## 5. Por región

| Región         | Total | 🔴 No vend. | 🟡 Posible | 🟢 Tier 1 | Fuente      |
|----------------|------:|------------:|-----------:|----------:|-------------|
| Metropolitana  |   678 |         249 |        166 |       263 | nacional    |
| Biobío         |   233 |          64 |        112 |        57 | nacional    |
| Valparaíso     |   335 |         100 |         55 |       180 | nacional    |
| Tarapacá       |   315 |         240 |          — |        56 | Tarapacá*   |
| Antofagasta    | 2.940 |           — |          — |       TBD | Antofagasta*|

\* Esquema distinto (sin campo MODO); clasificación por texto. Antofagasta pendiente.

## 6. Top "disponibles" (las joyas, MODO = "..")

| Predio                                | Comuna         | Región | Superficie  |
|---------------------------------------|----------------|--------|-------------|
| Hijuela La Obra de Chena (4590-1)     | San Bernardo   | RM     | 449,75 ha   |
| Fundo Cerro Negro                     | San Bernardo   | RM     | 96.200 m²   |
| Pedro Montt 1606 / Isabel Riquelme    | Santiago/PAC   | RM     | 94.259 m²   |
| Vicuña Mackenna 5065 (5110-1)         | San Joaquín    | RM     | 84.834 m²   |
| Carlos Valdovinos 279 (1010-3)        | San Joaquín    | RM     | 73.000 m²   |
| Ruta G-98-F interior lote B (1099-9)  | Cartagena      | Valpo  | 61.399 m²   |
| Camino a Melipilla 641                | Padre Hurtado  | RM     | 58.111 m²   |
| San José 1053 / Belisario Prats       | Independencia  | RM     | 56.148 m²   |
| Armando Celis lotes 1-7 (670-264/265) | El Tabo        | Valpo  | 52.816 m²   |
| Santa Amalia 1022 (2516-39)           | La Florida     | RM     | 42.728 m²   |
| Teatinos 120 (84-1)                   | Santiago       | RM     | 40.445 m²   |
| Ignacio Vicuña (1530-1)               | San Antonio    | Valpo  | 25.926 m²   |

Nota: excluir falsos disponibles que son fajas de camino/FFCC (p.ej. Chiguayante
"camino público a Concepción", 127.400 m²).

## 7. Tarapacá (capa propia)

315 predios; 47% afectación/destinación (en uso, sobre todo fajas viales MOP),
1% enajenados, ~56 candidatos urbanos. Concentración: Alto Hospicio (33),
Pozo Almonte (12), Iquique/Pica/Huara. Lote mayor: 25.881 m² en Alto Hospicio.

## 8. Limitaciones

- Datos referenciales del catastro MBN, no la nómina oficial del plan.
- "Vendible" = situación que *permite* vender, no que el predio esté en el plan.
- Antofagasta (2.940) usa otro esquema; falta clasificar.
- Las cifras del plan (US$, 350, 1.200) son de prensa abril-junio 2026, en evolución.

## 9. Próximos pasos

- Adaptar y clasificar Antofagasta (2.940 predios, región foco).
- Cruzar roles SII con avalúos/transacciones para estimar valor de mercado.
- Ingresar la solicitud de Transparencia para obtener la nómina oficial.
