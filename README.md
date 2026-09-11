# Prueba técnica - Especialista de Analítica y Automatización

Solución de extremo a extremo que transforma un TSV sintético con problemas de calidad en un modelo analítico reproducible, identifica segmentos conductuales, presenta los resultados en Power BI y React, y propone su evolución a Microsoft 365.

> Los datos son completamente sintéticos. El login web es demostrativo y no representa autenticación productiva.

## Entregables

| Área | Entrega | Descripción |
|---|---|---|
| Datos | [`data/dataset_clean.csv`](data/dataset_clean.csv) | Dataset limpio a nivel de registro. |
| Análisis | [`analysis/analysis.ipynb`](analysis/analysis.ipynb) | Auditoría, limpieza, modelo, Lovers, visualizaciones y validaciones ejecutadas. |
| Reglas | [`analysis/README.md`](analysis/README.md) | Supuestos, limpieza, granularidad, segmentación y reconciliaciones. |
| Insights | [`analysis/INSIGHTS.md`](analysis/INSIGHTS.md) | Cinco hallazgos con evidencia, acción, KPI y limitación. |
| Power BI | [`powerbi/Digotec_Analytics.pbix`](powerbi/Digotec_Analytics.pbix) | Dashboard ejecutivo editable. |
| Evidencia Power BI | [`powerbi/Digotec_Analytics_dashboard.png`](powerbi/Digotec_Analytics_dashboard.png) | Captura de la página ejecutiva. |
| React | [`app/`](app/) | Aplicación Vite, React y TypeScript con login demo, filtros y KPIs. |
| Microsoft 365 | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Migración conceptual a SPFx, datos, identidad, permisos y Power BI. |
| Automatización | [`docs/AUTOMATION.md`](docs/AUTOMATION.md) | Alerta diaria e idempotente de vencimientos. |
| Uso de IA | [`AI_NOTES.md`](AI_NOTES.md) | Herramientas, forma de trabajo y validación humana. |

## Resultado ejecutivo

- 22.455 registros originales y 22.342 después de retirar 113 duplicados exactos.
- 2.200 clientes, 5.048 relaciones cliente-producto y 14.873 consumos positivos de tarjeta.
- Saldo consolidado conocido de $77.356.909,02: $6.018.429,30 en depósitos y $71.338.479,72 en deuda.
- Consumo total de $1.862.441,01 y utilización ponderada de tarjeta de 32,83%.
- 1.014 clientes cumplen al menos una regla Lover y 157 son multilabel.
- 22 productos vencen en 30 días y 153 en 90 días desde la fecha de corte.
- 1.231 consumos outlier representan 8,28% de las operaciones y 37,63% del monto; se marcan para revisión, no para eliminación automática.

La recomendación inmediata es priorizar los 22 vencimientos dentro de 30 días mediante seguimiento medible. Como segundo paso, las campañas basadas en Lovers deberían validarse con grupos comparables antes de atribuirles impacto.

## Estructura analítica

```text
data/raw/                  Fuente original intacta
data/dataset_clean.csv     Entregable limpio a nivel registro
data/processed/            Dimensión, hechos y vista cliente 360
analysis/                  Notebook, reglas e insights
powerbi/                   PBIX y evidencia visual
app/                       Aplicación React
docs/                      Arquitectura corporativa y automatización
```

Separar cliente, producto y consumo evita doble conteo: sumar el saldo desde el TSV plano lo inflaría 2,20 veces y, en tarjetas, 8,94 veces.

## Reproducir el análisis

Requiere Python 3.12 y las dependencias de [`requirements.txt`](requirements.txt).

macOS o Linux:

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m jupyter lab analysis/analysis.ipynb
```

Windows PowerShell:

```powershell
py -3.12 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m jupyter lab analysis/analysis.ipynb
```

Ejecución automática desde la raíz:

```bash
python -m jupyter nbconvert --execute --to notebook --inplace analysis/analysis.ipynb --ExecutePreprocessor.timeout=300
```

El notebook valida el hash del TSV y detiene la ejecución si fallan conteos, claves, fechas o reconciliaciones.

## Ejecutar React

Requiere Node.js 22.12 o superior.

```bash
cd app
npm install
npm run dev
```

Credenciales demostrativas:

```text
Correo: analista@digotec.demo
Contraseña: Digotec2026!
```

Comandos de calidad:

```bash
npm run sync:data
npm run typecheck
npm test
npm run lint
npm run build
```

La aplicación ofrece búsqueda, filtros de segmento, ciudad, producto y Lover, KPIs recalculables, gráficos accesibles, tabla paginada, estados de carga/error y adaptación móvil. Consulta las decisiones técnicas en [`app/README.md`](app/README.md).

## Abrir Power BI

1. Instalar Power BI Desktop en Windows.
2. Abrir [`powerbi/Digotec_Analytics.pbix`](powerbi/Digotec_Analytics.pbix).
3. Seleccionar la página `Resumen ejecutivo`.

El PBIX conserva los datos importados. La sección de Power BI dentro de React queda preparada, pero no se configura un embed real porque requeriría Power BI Service, permisos e identidad corporativa.

## Microsoft 365 y automatización

La evolución propuesta reutiliza componentes React dentro de SPFx, reemplaza el login demo por Microsoft Entra ID y usa una API protegida para consultar Azure SQL. SharePoint Lists se reserva para configuración y seguimiento; secretos y credenciales no viven en el navegador.

La automatización diaria consulta productos próximos a vencer, resuelve al responsable y utiliza `cliente_producto_id|fecha_vencimiento` como clave idempotente para no duplicar oportunidades o notificaciones.

## Enlaces de entrega

- Repositorio: <https://github.com/gabrandr/prueba-tecnica-especialista-analitica>
- Aplicación desplegada: pendiente de publicación en Vercel.
- Video de presentación: se añadirá después de la grabación final.

## Supuestos y limitaciones

- Fecha de corte fija: 2026-08-31.
- USD es un supuesto de visualización; la fuente no contiene moneda.
- Los Lovers son reglas heurísticas explicables, no predicciones.
- Un outlier no demuestra error o fraude.
- `Sin información transaccional` no equivale a cliente inactivo.
- No se desplegaron SPFx, Azure SQL, Power BI Service o Power Automate; esa parte es una propuesta técnica.
- El repositorio incluye únicamente datos sintéticos y no contiene el enunciado confidencial.
