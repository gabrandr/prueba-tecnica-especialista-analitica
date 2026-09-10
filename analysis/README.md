# Preparación reproducible de datos

## Objetivo

Esta carpeta contiene el notebook que audita, limpia y analiza `data/raw/Digotec_Prueba_Analitica_Automatizacion_Dataset.tsv`. El proceso conserva la fuente intacta, documenta cada decisión, genera el dataset limpio y construye segmentaciones conductuales utilizables por Power BI y React.

Los hallazgos comerciales cuantificados y sus limitaciones se encuentran en [`analysis/INSIGHTS.md`](INSIGHTS.md).

## Requisitos

- Python 3.12.
- El TSV fuente en `data/raw/`.
- Las dependencias fijadas en `requirements.txt`.

Desde la raíz del repositorio, en macOS o Linux:

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m jupyter lab analysis/analysis.ipynb
```

En Windows PowerShell:

```powershell
py -3.12 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m jupyter lab analysis/analysis.ipynb
```

Para ejecutar y regenerar todos los archivos automáticamente:

```powershell
.venv\Scripts\python.exe -m jupyter nbconvert --execute --to notebook --inplace analysis/analysis.ipynb --ExecutePreprocessor.timeout=300
```

En macOS o Linux, reemplazar `.venv\Scripts\python.exe` por `.venv/bin/python`.

## Reglas aplicadas

- Se valida el SHA-256 del TSV antes de procesarlo.
- Se eliminan únicamente 113 duplicados exactos en las 15 columnas originales.
- Segmentos y categorías se normalizan mediante diccionarios visibles en el notebook.
- Las fechas ISO se interpretan con `%Y-%m-%d` y las alternativas con `%d/%m/%Y`.
- Los segmentos conflictivos se resuelven por moda y, en caso de empate, por última aparición; la ambigüedad permanece indicada mediante una bandera.
- Se recupera ciudad desde otras filas del mismo cliente. Un cliente queda como `Desconocida`.
- Se recupera saldo desde otras filas del mismo cliente-producto. Ocho productos conservan saldo nulo.
- Los saldos negativos y los posibles outliers IQR no se modifican; se agregan banderas.
- Cuentas de ahorro y corriente se clasifican como `Depósito`; tarjetas y créditos como `Deuda`.
- Los identificadores `REG-...` y `CON-...` se derivan de la línea de origen y son técnicos, no identificadores bancarios.

Los archivos CSV usan UTF-8, coma como delimitador, punto decimal, fechas `YYYY-MM-DD` y saltos de línea reproducibles.

## Archivos generados

| Archivo | Filas | Granularidad | Clave |
|---|---:|---|---|
| `data/dataset_clean.csv` | 22.342 | Registro fuente limpio | `registro_id` |
| `data/processed/dim_clientes.csv` | 2.200 | Cliente | `cliente_id` |
| `data/processed/fact_productos.csv` | 5.048 | Cliente-producto | `cliente_producto_id` |
| `data/processed/fact_consumos.csv` | 14.873 | Consumo positivo de tarjeta | `consumo_id` |
| `data/processed/cliente_360.csv` | 2.200 | Cliente consolidado | `cliente_id` |
| `data/processed/cliente_360.json` | 2.200 | Cliente consolidado para React | `cliente_id` |
| `data/processed/data_quality_report.json` | 1 reporte | Ejecución y archivos | No aplica |

`data/dataset_clean.csv` es el entregable limpio solicitado en el enunciado. Las tablas de `data/processed/` son vistas adicionales que evitan doble conteo y facilitan Power BI y React. No existe una segunda copia del dataset limpio dentro de `processed/`.

## Segmentación de Lovers

La segmentación usa exclusivamente los 14.873 consumos positivos de tarjeta observados hasta 2026-08-31. Para ser Lover de una categoría, el cliente debe cumplir simultáneamente:

- Al menos 2 consumos en la categoría.
- Gasto en la categoría mayor o igual a 20% de todo su consumo, considerando las diez categorías disponibles en el denominador.

| Etiqueta | Categoría evaluada | Uso comercial potencial |
|---|---|---|
| `Travel Lover` | Travel | Beneficios de viaje, millas o alianzas turísticas. |
| `Streaming Lover` | Streaming | Paquetes digitales y beneficios para suscripciones. |
| `Food Lover` | Food | Promociones en restaurantes y servicios de entrega. |
| `Tech Lover` | Technology | Financiación y alianzas para compras tecnológicas. |

La lista `lovers` es multilabel: conserva todas las reglas cumplidas. `lover_principal` selecciona la categoría con mayor participación para crear gráficos sin doble conteo. Si hubiera empate, se elige mayor cantidad de consumos y después el orden Travel, Streaming, Food y Tech.

Los clientes con consumos que no cumplen ninguna regla se clasifican como `Generalista`. Los clientes sin consumos positivos se clasifican como `Sin información transaccional`; en este dataset los 545 casos coinciden con clientes sin tarjeta observada, por lo que no deben llamarse clientes inactivos.

`dim_clientes.csv` y `cliente_360.csv/json` contienen estas variables:

- Cuatro banderas: `es_travel_lover`, `es_streaming_lover`, `es_food_lover` y `es_tech_lover`.
- `cantidad_lovers`.
- `lovers`, separado por `|` en CSV y como lista en JSON.
- `lover_principal`.

Los Lovers no se copian a `dataset_clean.csv` ni a las tablas de hechos porque son atributos calculados a nivel cliente.

## Trazabilidad del dataset limpio

Además de las 15 columnas funcionales, el dataset limpio contiene:

- Identidad técnica: `registro_id`, `fila_origen`.
- Segmento: valor observado, valor resuelto, método y bandera de conflicto.
- Producto: `tipo_producto`.
- Ciudad: banderas de recuperación y ausencia total.
- Saldo: banderas de recuperación, ausencia, negativo y outlier.
- Consumo: bandera de outlier.

El TSV original permite reconstruir el valor literal de cualquier fila mediante `fila_origen`.

## Reconciliaciones verificadas

- Saldo consolidado: 77.356.909,02.
- Saldo de depósitos: 6.018.429,30.
- Saldo de deuda: 71.338.479,72.
- Consumo total: 1.862.441,01.
- Utilización ponderada de tarjeta: 32,83%.
- Clientes multiproducto: 1.787.
- Clientes sin consumos: 545.
- Clientes con al menos un Lover: 1.014.
- Clientes con más de un Lover: 157.
- Lover principal: 255 Travel, 236 Streaming, 322 Food y 201 Tech.
- Generalistas: 641.
- Próximos vencimientos: 22 en 30 días y 153 en 90 días desde la fecha de corte.
- Productos con saldo negativo: 117.
- Productos marcados como outlier: 255.
- Consumos marcados como outlier: 1.231.

La última celda del notebook contiene aserciones de conteo, unicidad, integridad referencial, fechas y reconciliación. Si alguna condición falla, la ejecución se detiene.

## Supuestos y limitaciones

- `N/A` y las cadenas vacías significan ausencia o “no aplica”, según el campo y el producto.
- Los duplicados exactos se eliminan por tratarse de datos sintéticos con inconsistencias intencionales. Sin un ID transaccional de origen, sigue siendo un supuesto documentado.
- La moda de segmento puede estar influida por la cantidad de registros. La bandera permite identificar los 211 clientes afectados y, en un entorno real, contrastarlos con una fuente maestra.
- Un saldo desconocido no se convierte en cero.
- Una bandera IQR indica que el valor es inusual, no que sea erróneo.
- La fecha de corte reproducible es 2026-08-31, máxima fecha de movimiento observada.
- Un Lover es una regla conductual explicable, no una predicción ni una prueba de preferencia futura.
- La relación entre una etiqueta y un resultado comercial es observacional; una campaña debe validarse con población elegible, comparación y KPIs definidos.
