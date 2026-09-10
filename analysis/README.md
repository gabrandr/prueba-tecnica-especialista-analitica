# Auditoría de datos

## Objetivo

Esta carpeta contiene la auditoría reproducible del archivo `Digotec_Prueba_Analitica_Automatizacion_Dataset.tsv`. El notebook identifica problemas de calidad y define el contrato de limpieza de la siguiente fase. En esta etapa no se modifica ni se exporta el dataset.

## Requisitos

- Python 3.12.
- El archivo fuente en `data/raw/`.
- Las dependencias fijadas en `requirements.txt`.

## Preparación del entorno

Desde la raíz del repositorio, en macOS o Linux:

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

En Windows PowerShell:

```powershell
py -3.12 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

## Abrir el notebook

```bash
python -m jupyter lab analysis/analysis.ipynb
```

## Ejecutar y validar de principio a fin

macOS o Linux:

```bash
.venv/bin/python -m jupyter nbconvert --execute --to notebook --inplace analysis/analysis.ipynb --ExecutePreprocessor.timeout=300
```

Windows PowerShell:

```powershell
.venv\Scripts\python.exe -m jupyter nbconvert --execute --to notebook --inplace analysis/analysis.ipynb --ExecutePreprocessor.timeout=300
```

La última celda contiene aserciones. Si cambia el archivo o falla una regla estructural, la ejecución se detiene.

## Hallazgos principales

- El archivo tiene 22.455 filas, 15 columnas y 2.200 clientes.
- Existen 113 duplicados exactos, equivalentes al 0,50% de las filas.
- Hay 5.048 combinaciones cliente-producto y 4.002 aparecen en varias filas.
- El mismo saldo de producto se repite entre registros. Sumarlo directamente infla el saldo total 2,20 veces y el saldo de tarjetas 8,94 veces.
- Las ausencias de cupo y categoría en productos no tarjeta, y de vencimiento en depósitos, son estructurales.
- Las 89 fechas no ISO se interpretan correctamente como `dd/mm/yyyy`. La combinación `format="mixed"` + `dayfirst=True` no deja inválidos, pero altera 8.182 fechas ISO ambiguas; la limpieza deberá detectar el patrón y aplicar un formato explícito a cada grupo.
- Las categorías contienen variantes de mayúsculas, espacios y errores tipográficos.
- Hay 251 clientes con más de una etiqueta literal de segmento. El formato explica 40 casos; 211 conservan segmentos canónicos distintos y requieren una regla determinista más una bandera de conflicto.
- Los saldos negativos y los valores extremos requieren banderas y análisis por producto; no existe evidencia suficiente para eliminarlos.

## Supuestos

- `N/A` y las cadenas vacías significan ausencia o “no aplica”, según la columna y el producto.
- Los duplicados exactos son candidatos a eliminación porque la prueba declara inconsistencias intencionales. Sin un identificador transaccional no puede demostrarse que todos sean duplicados operativos.
- Una combinación cliente-producto representa un producto, porque saldo, cupo y vencimiento no presentan más de un valor no nulo dentro del grupo.
- `fecha_movimiento` se interpreta como fecha del movimiento o registro, tal como indica el diccionario del enunciado.
- La normalización de texto no se usará para ocultar conflictos semánticos: un cliente que mantiene dos segmentos distintos seguirá identificado como conflictivo.
- La fecha de corte reproducible es 2026-08-31, máxima fecha de movimiento observada.

## Contrato propuesto para la limpieza

La Fase 2 deberá producir:

| Archivo | Granularidad | Propósito |
|---|---|---|
| `data/dataset_clean.csv` | Un registro fuente no duplicado | Entregable principal del PDF; preservar fecha, canal y todos los campos ya normalizados. |
| `data/processed/dim_clientes.csv` | Un cliente | Perfil estable para filtros y atributos. |
| `data/processed/fact_productos.csv` | Un cliente-producto | Evitar repetir saldos, cupos y vencimientos. |
| `data/processed/fact_consumos.csv` | Un consumo positivo de tarjeta | Analizar categorías, montos y comportamiento. |
| `data/processed/cliente_360.csv` | Un cliente | Vista consolidada para análisis, Power BI y React. |
| `data/processed/cliente_360.json` | Un cliente | Equivalente JSON de la vista consolidada para React. |
| `data/processed/data_quality_report.json` | Un reporte por ejecución | Registrar controles, conteos y reconciliaciones de calidad. |

Solo existirá una copia de `dataset_clean.csv`. La fuente permanecerá intacta en `data/raw/` y `data/processed/` contendrá exclusivamente artefactos analíticos derivados.

## Límites de esta fase

- No se eliminaron filas.
- No se imputaron nulos.
- No se normalizaron categorías en el archivo fuente.
- No se generaron datasets en `data/processed/`.
- No se calcularon Lovers ni recomendaciones comerciales definitivas.
