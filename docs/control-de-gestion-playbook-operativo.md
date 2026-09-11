# Playbook operativo — Control de Gestión / Chief of Staff (NEO)

Cómo se ejecuta, en concreto, cada responsabilidad del cargo: con qué fuente de dato,
con qué rutina, con qué artefacto de salida y con qué criterio de "bien hecho".

Documento complementario a [`control-de-gestion-chief-of-staff.md`](./control-de-gestion-chief-of-staff.md),
que define el rol. Este define el **cómo**.

---

## 0. Punto de partida: qué hay hoy

Levantamiento sobre la base operativa de Leasit (Supabase, proyecto `Leasit Project`)
al **11 de septiembre de 2026**:

| Etapa del negocio | Volumen real | Fuente |
|---|---|---|
| Leads captados | 17.220 | `leads` |
| Leads en semáforo verde | 366 (2,1% de los captados) | `leads.semaforo` |
| Leads marcados accionables | 46 | `leads.accionable` |
| Leads efectivamente contactados | **8** | `leads.contactado` |
| Clientes | 3 | `clientes` |
| Evaluaciones de crédito | 17, de las cuales 13 son demo → **4 reales** | `evaluaciones` |
| Operaciones cerradas | 12, de las cuales 11 son demo → **1 real cursada** | `cierres` |
| Líneas de crédito aprobadas | 1 | `lineas_credito` |
| Facturas de comisión emitidas | 1 | `facturas_comisiones` |
| Empleados registrados | **0** | `empleados` |
| Corridas de agentes automáticos | 29.211 | `agente_corridas` |

Productos modelados en la base pero **sin una sola operación**: confirming
(`confirming_lotes`), ordering (`ordering_solicitudes`), créditos de consumo
(`creditos_consumo`), líneas revolventes (`lineas_revolventes`), boletas de garantía
(`boletas_garantia`), garantías (`garantias`), contratos generados
(`contratos_generados`), NPS (`nps_encuestas`).

**Lectura honesta de estos números:** NEO no está en etapa de *controlar* la gestión.
Está en etapa de *conseguir* que exista gestión que controlar. La máquina de originación
funciona (17 mil leads captados y scoreados automáticamente); el embudo muere en el
contacto comercial: de 46 leads accionables solo 8 fueron contactados, y de ahí salió
1 operación cursada.

Esto no invalida el cargo, pero **sí cambia su contenido en los primeros meses**.
Ver sección 6.

---

## 1. Bloque A — Control de gestión

### A1. Construir el presupuesto

**Qué es en concreto.** No es una planilla de gastos. Es un modelo de drivers que, dado
un plan comercial, produce P&L, balance y flujo mes a mes. En una financiera la cadena es:

```
Leads accionables
  × tasa de conversión            → clientes nuevos
  × operaciones por cliente/mes   → N.º de operaciones
  × ticket promedio               → COLOCACIONES del mes
  × plazo promedio / 30           → STOCK PROMEDIO de cartera
     × tasa mensual               → ingresos por intereses
     + comisión por operación     → ingresos por comisiones
     − stock × costo de fondeo    → margen financiero bruto
     − pérdida esperada           → margen financiero neto
     − OPEX (dotación + gastos)   → EBITDA
     − depreciación − impuestos   → RESULTADO
```

**Cómo se hace.**
1. Fijar con Comercial el plan de colocaciones mensual (monto, no cantidad de reuniones).
2. Fijar con Riesgo la pérdida esperada por producto (% sobre colocación).
3. Fijar con Tesorería el costo de fondeo y el calendario de disponibilidad de líneas.
4. Fijar con el CEO la dotación mes a mes (esta es la variable de OPEX que manda).
5. Cerrar el modelo con flujo de caja: en una financiera el resultado y la caja se
   divorcian, porque la colocación consume caja hoy y el ingreso llega después.

**Artefacto.** Un modelo único, con supuestos en una hoja separada y visible, versionado
y **congelado** al aprobarse. Todo cambio posterior va a una hoja de reforecast, nunca
sobre el presupuesto original; si el presupuesto se edita, se pierde la capacidad de medir
desviación.

**Bien hecho si:** cualquier gerente puede ver de qué supuesto depende su número, y el
presupuesto reproduce el flujo de caja, no solo el resultado.

### A2. Seguimiento real vs. presupuesto

**Rutina de cierre mensual — 5 días hábiles.**

| Día hábil | Acción | Responsable |
|---|---|---|
| 1 | Corte de datos operativos: colocaciones, stock, recaudación, mora | Control de Gestión |
| 2 | Recepción de contabilidad y conciliación con datos operativos | Contabilidad → CdG |
| 3 | Cálculo de KPIs, márgenes y rentabilidad por dimensión | Control de Gestión |
| 4 | Explicación de desviaciones con cada gerente (uno a uno, 30 min) | CdG + gerentes |
| 5 | Informe de gestión emitido y reunión de cierre | Control de Gestión |

**Lo que distingue un buen seguimiento de uno malo:** el mal seguimiento reporta que
las colocaciones estuvieron 18% bajo presupuesto. El bueno descompone el 18% en un
puente de desviaciones:

```
Colocaciones presupuestadas            100
  efecto volumen (menos operaciones)   −22
  efecto ticket (operaciones menores)   +6
  efecto mix de producto                −2
Colocaciones reales                     82
```

Y luego responde: el efecto volumen viene de que el equipo comercial contactó 40% de los
leads accionables comprometidos. Eso es un compromiso incumplido con nombre y fecha, no
una desviación anónima.

**Regla:** ninguna desviación mayor al umbral se reporta sin causa identificada y sin
acción correctiva con responsable y fecha.

### A3. Flujo, stock, clientes e ingresos

**El instrumento central es el flujo de caja rolling de 13 semanas**, no el flujo mensual.
Una financiera quiebra por caja, no por resultado, y lo hace rápido. Se actualiza semanal:

- Entradas: recaudación de facturas cedidas por fecha de vencimiento, giros de líneas de
  fondeo, aportes de capital.
- Salidas: desembolsos comprometidos, amortizaciones de fondeo, OPEX, impuestos.
- Salida crítica: **caja mínima proyectada semana a semana** y capacidad de colocación
  disponible.

Fuente en la base actual: `cierres` (fecha de curse, anticipo, tasa), `cierre_facturas`
(monto y fecha de vencimiento de cada factura cedida), `cobranza_estados_factura`
(recaudación efectiva). Falta modelar el pasivo: ver sección 5.

### A4. OPEX y productividad

**Hoy es imposible medirlo:** `empleados` tiene 0 registros. Sin dotación cargada no hay
costo por área, no hay costo por operación y no hay productividad.

Primera tarea concreta del cargo: poblar `empleados` (cargo, área, tipo de contrato,
fecha de ingreso, costo total) y usarlo como fuente única de dotación, de modo que el
OPEX de personal se calcule desde la misma fuente que la nómina y no desde una planilla
aparte. Luego:

- OPEX por área / colocaciones del período.
- Costo total por operación cursada (todo el OPEX dividido por operaciones).
- Operaciones por ejecutivo comercial y por analista de riesgo.

### A5. Rentabilidad por cliente, ejecutivo y producto

El error clásico es reportar ingresos por cliente y llamarlo rentabilidad. La metodología
correcta asigna cuatro capas:

| Capa | Cómo se asigna |
|---|---|
| Ingreso | Directo: intereses + comisiones de las operaciones del cliente |
| Costo de fondeo | Saldo promedio del cliente × costo de fondeo del período |
| Pérdida esperada | Colocación del cliente × % de pérdida esperada de su categoría de riesgo |
| Costo operativo | Por driver de actividad: n.º de operaciones, n.º de facturas gestionadas, gestiones de cobranza |

Recién después de las cuatro capas se sabe si un cliente deja plata. En factoring es
frecuente que un cliente de alto volumen y tasa baja, con muchas facturas chicas y mucha
gestión de cobranza, sea destructor de valor. Ese hallazgo es el que justifica el cargo.

**Fuentes actuales:** `cierres` + `cierre_facturas` (ingreso y volumen por cedente y por
ejecutivo vía `ejecutivo_email`), `cobranza_gestiones` (intensidad de gestión por factura),
`facturas_comisiones` (comisiones facturadas).

### A6. ROE, leverage y utilización de fondeo

| Indicador | Fórmula | Por qué importa en NEO |
|---|---|---|
| ROE | Utilidad neta 12m / patrimonio promedio | Es el número que mira el inversionista |
| Leverage | Pasivo financiero / patrimonio | Define cuánto puede crecer NEO sin capital nuevo |
| Utilización de fondeo | Fondeo girado / líneas aprobadas disponibles | Es el techo real de colocación de la semana |
| Calce de plazos | Duración del activo vs. duración del pasivo | Un descalce mata a una financiera antes que la mora |

La utilización de fondeo debe mirarse **semanal**, no mensual: es la restricción dura del
negocio. Si Comercial vende más de lo que Tesorería puede fondear, el problema no es
comercial, es de coordinación — exactamente el trabajo de este cargo.

### A7. Construcción y mantención de KPIs

**Diccionario de indicadores.** Un registro donde cada KPI tiene: nombre, definición en
palabras, fórmula exacta, tabla y campo de origen, frecuencia, responsable del número,
umbral de alerta y fecha de última revisión. Sin esto, a los tres meses hay dos versiones
de "colocaciones del mes" y las reuniones se van en discutir cuál es la correcta.

**Regla de oro del dato:** un KPI se calcula **una vez**, en una vista SQL sobre la base,
y todos los consumidores (dashboard, informe, reporte de Directorio) leen de ahí.
Ningún indicador se calcula en una planilla personal.

### A8. Dashboards

Arquitectura mínima, de abajo hacia arriba:

1. **Capa de datos.** Vistas SQL en Supabase: `v_embudo_comercial`, `v_colocaciones_mes`,
   `v_stock_cartera`, `v_mora`, `v_tiempos_proceso`, `v_productividad`. Cada vista
   **debe excluir `es_demo = true`** (ver sección 5, es el riesgo más grave del dato hoy).
2. **Capa semántica.** El diccionario de A7 apuntando a esas vistas.
3. **Capa de visualización.** Una vista para el CEO (10 números y 4 alertas, en una
   pantalla), una por área, una para Directorio.

**Criterio de diseño:** el dashboard del CEO no se diseña por lo que es bonito mostrar,
sino por las decisiones que el CEO toma esa semana: ¿cuánto puedo colocar?, ¿dónde se
está trabando el embudo?, ¿qué compromiso está vencido?, ¿qué se está deteriorando?

### A9. Alertas tempranas

Una alerta es un umbral + una frecuencia de evaluación + un destinatario + una acción
esperada. Sin los cuatro elementos es ruido.

| Alerta | Umbral sugerido | Frecuencia | Destinatario |
|---|---|---|---|
| Colocaciones bajo plan | Acumulado del mes < 80% del pro-rata | Semanal | CEO + Comercial |
| Embudo trabado | Leads accionables sin contactar > 7 días | Diaria | Comercial |
| Mora temprana | Facturas con atraso 1–30 días sobre umbral | Semanal | Cobranza |
| Fondeo | Utilización de líneas > 85% | Semanal | CEO + Tesorería |
| Concentración | Un pagador > umbral % del stock | Semanal | Riesgo |
| Compromiso vencido | Cualquier acuerdo pasado de fecha | Semanal | CEO |

NEO ya tiene infraestructura de agentes corriendo (`agent_task`, `agente_corridas`,
`agente_hallazgos`, con 29.211 corridas registradas). Las alertas deberían vivir ahí,
como tareas automáticas que escriben hallazgos, y no depender de que una persona mire
una planilla los lunes.

---

## 2. Bloque B — Orquestación de las áreas

### B1. Bitácora de compromisos

El mecanismo más simple y el que más valor genera. Un registro único con: compromiso,
área, responsable (persona, no área), fecha comprometida, estado, fecha de cumplimiento
real y origen (de qué reunión o decisión salió).

**Cómo se opera.**
- Todo acuerdo de una reunión ejecutiva entra a la bitácora antes de que termine la reunión.
- Cada reunión **parte** revisando los compromisos de la anterior. Sin excepción.
- Un compromiso sin responsable individual y sin fecha no se registra: se devuelve a discusión.
- El indicador del sistema es: % de compromisos cumplidos en fecha. Se reporta por área.

El efecto real de este mecanismo no es el control: es que la gente deja de comprometerse
a la ligera cuando sabe que el compromiso queda escrito y se revisa.

### B2. Proyectos e iniciativas transversales

Cada iniciativa con: objetivo medible, dueño, hitos con fecha, áreas involucradas,
decisiones pendientes y semáforo. El semáforo lo pone Control de Gestión **con criterio
de hitos, no de percepción del dueño**: si el hito venció, está rojo aunque el dueño diga
que va bien. Esta es una de las pocas atribuciones donde el cargo decide unilateralmente,
y conviene dejarla explícita al instalar el rol.

### B3. Identificación de cuellos de botella

Aquí el cargo deja de opinar y empieza a medir. La tabla `cierres` tiene cuatro estampas
de tiempo — `creada_at`, `firmada_at`, `cesion_at`, `cursada_at` — que permiten medir el
proceso completo por etapa **desde hoy**:

```sql
select
  round(avg(extract(epoch from (firmada_at - creada_at))/86400)::numeric, 2) as dias_creacion_firma,
  round(avg(extract(epoch from (cesion_at  - firmada_at))/86400)::numeric, 2) as dias_firma_cesion,
  round(avg(extract(epoch from (cursada_at - cesion_at ))/86400)::numeric, 2) as dias_cesion_curse,
  round(avg(extract(epoch from (cursada_at - creada_at ))/86400)::numeric, 2) as time_to_cash
from cierres
where coalesce(es_demo, false) = false and cursada_at is not null;
```

Sobre la única operación real cursada a la fecha: creación → firma 1 día,
creación → curse 3 días. Con volumen, esta consulta pasa a ser el mapa del cuello de
botella: la etapa con mayor tiempo promedio y mayor dispersión es donde está el problema.

El embudo comercial se mide igual de directo:

```sql
select count(*) as captados,
       count(*) filter (where semaforo = 'verde') as verdes,
       count(*) filter (where accionable)         as accionables,
       count(*) filter (where contactado)         as contactados
from leads;
```

Hoy: 17.220 → 366 → 46 → 8. **Ese salto de 46 a 8 es el cuello de botella de NEO**, y no
requiere un cargo nuevo para verse: requiere que alguien lo mire todas las semanas y le
ponga nombre y fecha a la solución.

### B4. SLA entre áreas

Se acuerdan con cada par de áreas, se miden desde las estampas de tiempo del sistema y se
reportan por tendencia. Los pares relevantes en NEO, con la fuente que ya existe:

| Traspaso | Se mide con |
|---|---|
| Captación → Comercial | `leads.createdAt` → `leads.contactado` |
| Comercial → Riesgo | `evaluaciones.createdAt` → cambio de estado (`cambios_estado_evaluacion`) |
| Riesgo → Operaciones | `evaluaciones` resuelta → `cierres.creada_at` |
| Operaciones (curse) | `cierres.firmada_at` → `cierres.cursada_at` |
| Operaciones → Cobranza | `cierre_facturas.fecha` → primera gestión en `cobranza_gestiones` |

Que el SLA se mida solo desde el sistema, y nunca desde el autorreporte del área, es lo
que hace que el mecanismo no se degrade.

### B5. Reuniones ejecutivas

**Guion del pulso semanal (45 minutos, no más):**

1. (5 min) Compromisos de la semana pasada: cumplidos / vencidos. Sin discusión, solo estado.
2. (10 min) Los números de la semana: embudo, colocaciones, caja y fondeo disponible, mora.
3. (20 min) Bloqueos: cada gerente trae lo que lo está trabando y lo que necesita de otra área.
4. (10 min) Compromisos nuevos: responsable y fecha, registrados en vivo.

Control de Gestión prepara los números **antes** y los envía la noche anterior. La reunión
no se usa para presentar información; se usa para decidir sobre información ya leída. Si la
reunión se va en presentar planillas, el mecanismo falló.

**Minuta:** máximo una página, enviada el mismo día, con decisiones y compromisos. Nadie
lee minutas de cinco páginas.

### B6. Escalamiento

Se escala al CEO cuando: vence un compromiso crítico, un SLA se incumple de forma
reiterada, una desviación supera el umbral, o dos áreas no logran acuerdo.

**Formato obligatorio del escalamiento** (esto separa al cargo de un buzón de quejas):
qué pasó (dato), por qué pasó (causa), qué se hizo hasta ahora, dos o tres opciones con
su costo, y una recomendación. El CEO decide; no diagnostica.

---

## 3. Bloque C — Ejecución estratégica

### C1. Traducir decisiones del CEO en planes de acción

Toda decisión del CEO se convierte, dentro de 48 horas, en una ficha: objetivo, resultado
medible, hitos con fecha, dueño, áreas involucradas y riesgos. Si al escribirla la decisión
no se deja convertir en resultado medible, la decisión todavía no está tomada — y eso hay
que devolvérselo al CEO, no rellenarlo con supuestos.

### C2. Seguimiento de iniciativas estratégicas

Revisión quincenal con los dueños, semáforo por hitos, y un principio: una iniciativa sin
avance por dos revisiones consecutivas se cierra o se reprioriza explícitamente. Las
iniciativas zombis son el principal consumidor invisible de capacidad en una empresa chica.

### C3. Implementación de procesos

El cargo no diseña el proceso de un área: lo facilita, lo documenta y verifica que se
cumpla. Secuencia: mapear el proceso actual con tiempos reales → identificar dónde se pierde
el tiempo → acordar el proceso objetivo con el dueño → dejarlo escrito → medirlo con datos
del sistema → revisar el cumplimiento en el pulso semanal.

### C4. Automatización, datos y tecnología

Aquí este cargo tiene, en NEO, más espacio que en una empresa tradicional: ya existe una
capa de agentes corriendo sobre la operación. El trabajo concreto es:

- Definir qué reportes deben dejar de armarse a mano (todos, idealmente).
- Priorizar automatizaciones por horas liberadas y por riesgo de error humano eliminado.
- Ser contraparte de Tecnología con requerimientos escritos en términos de decisión
  ("necesito saber cada lunes qué leads accionables llevan más de 7 días sin contacto"),
  no en términos de pantalla.
- Vigilar la calidad del dato: sin esto, todo lo demás es decoración.

### C5. Información para Directorio e inversionistas

Un formato estándar, estable en el tiempo, que se repita trimestre a trimestre: KPIs
comparables, desviación vs. plan, cartera y riesgo, caja y fondeo, avance de iniciativas,
y decisiones que se le piden al Directorio. La estabilidad del formato es lo que permite
al inversionista ver tendencia; cambiar el formato cada trimestre destruye esa lectura y
levanta sospecha de que se está escondiendo algo.

### C6. Seguimiento del plan de crecimiento

El plan de crecimiento se sigue por hitos de capacidad, no solo por monto colocado:
capacidad de fondeo asegurada, capacidad de originación, capacidad de evaluación,
capacidad operativa de curse y de cobranza. Crecer colocación sin crecer las cuatro
capacidades produce exactamente la crisis que este cargo debería prevenir.

---

## 4. Qué se puede medir hoy y qué no

| KPI | ¿Medible hoy? | Qué falta |
|---|---|---|
| Embudo comercial completo | Sí | Nada — `leads` está poblado |
| Tiempos de proceso (time-to-cash) | Sí | Solo volumen; las estampas ya existen en `cierres` |
| Productividad por ejecutivo | Parcial | `ejecutivo_email` existe; falta dotación en `empleados` |
| Colocaciones y stock | Sí, con 1 operación | Volumen |
| Mora y recaudación | Parcial | `cobranza_estados_factura` existe pero casi vacía |
| Ingresos y comisiones | Parcial | `facturas_comisiones` con 1 registro |
| Costo de fondeo y leverage | **No** | No existe modelo de pasivos ni de líneas de fondeo |
| OPEX y costo por operación | **No** | `empleados` vacía; sin contabilidad conectada |
| Real vs. presupuesto | **No** | No existe presupuesto cargado en ninguna parte |
| ROE | **No** | Requiere P&L y patrimonio: no hay contabilidad integrada |
| Rentabilidad por cliente | **No** | Requiere costo de fondeo + OPEX asignable |
| Cumplimiento de compromisos | **No** | No existe registro de compromisos ni de iniciativas |

---

## 5. Deuda que hay que saldar para que el cargo funcione

En orden de prioridad:

1. **Separar demo de producción.** Hoy `es_demo` convive con el dato real en las mismas
   tablas, y la mayoría de los registros de `cierres`, `evaluaciones` y
   `cobranza_estados_factura` son demo (11 de 12, 13 de 17, 10 de 11). Cualquier reporte
   que olvide el filtro producirá un número falso y, peor, creíble. Toda vista de gestión
   debe excluir `es_demo` por construcción, no por disciplina de quien escribe la consulta.
2. **Cargar la dotación** en `empleados`. Sin esto no hay OPEX, ni costo por operación,
   ni productividad.
3. **Modelar el pasivo:** líneas de fondeo, costo, plazos, disponibilidad y giros. Es la
   restricción central del negocio y hoy no existe en la base.
4. **Cargar el presupuesto** en una tabla, no en una planilla: sin presupuesto en la
   fuente de datos, el "real vs. presupuesto" vuelve a ser un trabajo manual mensual.
5. **Registro de compromisos e iniciativas.** El mecanismo B1 necesita dónde vivir.
6. **Conectar contabilidad** para que el P&L de gestión y el contable no se separen.

---

## 6. Crítica al diseño del cargo, dado el estado real de NEO

El documento del rol propone incorporarlo entre M1 y M4. La evidencia de la base matiza
esa recomendación en dos puntos:

**Primero: hoy no hay gestión que controlar.** Con 1 operación real cursada, 3 clientes y
0 empleados registrados, un Chief of Staff senior dedicado a control de gestión tendría,
durante meses, casi nada que medir. El riesgo concreto es que se dedique a construir
presupuestos y dashboards sobre supuestos, es decir, a producir precisión sobre datos
que no existen. Eso consume caja y crea la ilusión de control.

**Segundo: el cuello de botella está en originación, no en coordinación.** 366 leads
verdes, 46 accionables, 8 contactados. El problema de NEO hoy no es que las áreas estén
descoordinadas entre sí — es que el embudo no se está trabajando. Un cargo de coordinación
no resuelve un problema de ejecución comercial.

**Recomendación.** Incorporar el rol temprano sí, pero definido como **70% ejecución y
30% control de gestión** durante los primeros meses: alguien que trabaje el embudo, instale
los procesos y la disciplina de medición mientras el volumen aparece, y que vaya migrando
hacia control de gestión puro a medida que haya operación real que controlar. El perfil
que sirve para esa versión del cargo no es el de un controller: es alguien analítico que
además esté dispuesto a hacer trabajo operativo.

El disparador para migrar al rol completo descrito en el documento no debería ser el mes
del calendario, sino una condición observable: **operación recurrente, con varias áreas
funcionando en paralelo y un volumen mensual estable de operaciones**. Antes de eso, el
cargo es un lujo; después de eso, es tarde para instalarlo.
