# Dashboard ejecutivo en Power BI

Esta carpeta contiene el reporte final **Digotec Analytics - Cliente 360** y una captura de su página ejecutiva.

## Entregables

| Archivo | Propósito |
|---|---|
| `Digotec_Analytics.pbix` | Reporte editable para Power BI Desktop. |
| `Digotec_Analytics_dashboard.png` | Evidencia visual de la página `Resumen ejecutivo`. |

## Modelo

El PBIX importa las vistas analíticas de `data/processed/`:

- `dim_clientes.csv`: una fila por cliente.
- `fact_productos.csv`: una fila por cliente-producto.
- `fact_consumos.csv`: un consumo positivo de tarjeta.

El modelo separa dimensiones y hechos para evitar repetir saldos. `DimClientes` filtra productos y consumos mediante relaciones `1:*`, y una dimensión de fecha filtra los consumos.

## Controles sin filtros

| Indicador | Resultado verificado |
|---|---:|
| Clientes | 2.200 |
| Clientes multiproducto | 1.787 |
| Saldo de depósitos | $6.018.429,30 |
| Saldo de deuda | $71.338.479,72 |
| Consumo total | $1.862.441,01 |
| Utilización ponderada de tarjeta | 32,83% |
| Vencimientos en 30 días | 22 |
| Vencimientos en 90 días | 153 |

## Lectura del reporte

La página contiene filtros de segmento, ciudad, Lover principal, categoría y fecha, seis KPIs, cartera por producto, consumo por categoría, segmentación principal y cuatro hallazgos globales.

Segmento, ciudad y Lover filtran clientes y hechos relacionados. Categoría y fecha pertenecen al análisis transaccional y afectan el consumo, no la cartera completa. Los textos de hallazgos están identificados como globales.

## Supuestos y límites

- Fecha de corte reproducible: 31 de agosto de 2026.
- Los datos son sintéticos.
- USD es un supuesto visual porque la fuente no contiene moneda.
- Nulos, saldos negativos y outliers no se alteran sin evidencia de negocio.
- El reporte no está publicado en Power BI Service ni embebido con identidad corporativa.
