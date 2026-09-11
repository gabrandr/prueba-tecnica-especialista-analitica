# Dashboard ejecutivo en Power BI

Esta carpeta contiene los insumos y controles publicos del reporte **Digotec Analytics - Cliente 360**. El archivo `.pbix` no se genera con Python ni con React: debe crearse y guardarse desde Power BI Desktop para Windows.

La pagina principal responde tres preguntas:

1. ¿Como esta compuesta la cartera de clientes y productos?
2. ¿Como consumen los clientes y que afinidades presentan?
3. ¿Que oportunidades requieren atencion?

## Archivos

| Archivo | Proposito |
|---|---|
| `MEASURES_DAX.md` | Formulas, explicacion, formato y control esperado de cada medida. |
| `Digotec_Analytics_theme.json` | Tema visual importable en Power BI Desktop. |
| `mockup-dashboard.svg` | Referencia vectorial de la pagina 16:9. |
| `mockup-dashboard.png` | Vista rapida del mismo mockup. |
| `Digotec_Analytics.pbix` | Archivo que debe crear el candidato en Power BI Desktop. |
| `Digotec_Analytics_dashboard.png` | Captura que debe exportar el candidato para revision. |

## Fuentes del modelo

Importar en modo **Importar** estos tres archivos:

| Archivo | Nombre en Power BI | Granularidad | Filas esperadas |
|---|---|---|---:|
| `../data/processed/dim_clientes.csv` | `DimClientes` | Una fila por cliente | 2.200 |
| `../data/processed/fact_productos.csv` | `FactProductos` | Una fila por cliente-producto | 5.048 |
| `../data/processed/fact_consumos.csv` | `FactConsumos` | Un consumo positivo de tarjeta | 14.873 |

No se importa `cliente_360.csv`: esa vista alimenta React, mientras Power BI utiliza el modelo dimensional para analizar saldos y consumos sin duplicarlos.

## Modelo

```text
                       DimFecha
                          1
                          |
                          *
DimClientes 1 ───────── * FactConsumos
     |
     1
     |
     *
FactProductos
```

Relaciones activas y con direccion de filtro unica:

- `DimClientes[cliente_id]` 1 → * `FactProductos[cliente_id]`.
- `DimClientes[cliente_id]` 1 → * `FactConsumos[cliente_id]`.
- `DimFecha[Fecha]` 1 → * `FactConsumos[fecha_consumo]`.

No se relacionan las dos tablas de hechos entre si. Los atributos de cliente filtran ambos hechos; categoria y fecha pertenecen al analisis de consumos.

## Pagina `Resumen ejecutivo`

La referencia visual es [mockup-dashboard.png](./mockup-dashboard.png). La pagina incluye:

- filtros de segmento, ciudad, Lover principal, categoria y fecha de consumo;
- seis KPIs: clientes, multiproducto, depositos, deuda, consumo y utilizacion TC;
- cartera por producto, consumo por categoria y distribucion de Lovers;
- cuatro hallazgos globales con lenguaje no causal;
- fecha de corte, procedencia sintetica y supuesto visual de USD.

Los filtros de segmento, ciudad y Lover principal afectan los dos hechos. Categoria y fecha afectan las medidas y visualizaciones de consumo. Esta diferencia es intencional y debe explicarse en el reporte.

## Controles sin filtros

| Control | Valor esperado |
|---|---:|
| Clientes | 2.200 |
| Multiproducto | 1.787 |
| Depositos | $6.018.429,30 |
| Deuda | $71.338.479,72 |
| Consumo | $1.862.441,01 |
| Utilizacion ponderada TC | 32,83% |
| Vencimientos a 30 dias | 22 |
| Vencimientos a 90 dias | 153 |

Si alguno no coincide, no se debe corregir visualmente: hay que revisar tipos, relaciones, filtros o la medida DAX.

## Limites

- La fecha de corte es fija: 31 de agosto de 2026.
- Los montos se muestran en USD como supuesto de presentacion; el dataset no contiene moneda.
- Los nulos no se convierten automaticamente en cero.
- Los saldos negativos y outliers se conservan porque no existe evidencia para descartarlos.
- El reporte no se publica ni se embebe sin Power BI Service, permisos e identidad corporativa.

Referencias: [relaciones en Power BI](https://learn.microsoft.com/es-es/power-bi/transform-model/desktop-relationships-understand), [esquema estrella](https://learn.microsoft.com/power-bi/guidance/star-schema) y [exportacion a PDF](https://learn.microsoft.com/power-bi/consumer/end-user-pdf).
