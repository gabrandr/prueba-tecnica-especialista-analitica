# Medidas DAX - Digotec Analytics

Este archivo contiene las formulas que se deben crear en Power BI Desktop. Estan escritas con los separadores DAX predeterminados: coma para argumentos y punto para decimales. En `Archivo > Opciones y configuracion > Opciones > Configuracion regional`, mantener desactivada la opcion **Usar separadores DAX localizados**.

## Antes de copiar formulas

- Una **columna** guarda un valor por cada fila.
- Una **medida** calcula un resultado en el contexto de filtros actual.
- Las formulas siguientes son medidas salvo las dos tablas indicadas expresamente.
- Crear las medidas en la tabla `Medidas` para encontrarlas facilmente.
- No usar las opciones implicitas “Suma de saldo” en los visuales si existe una medida explicita equivalente.

## 1. Tablas calculadas

### DimFecha

Crear desde `Modelado > Nueva tabla`:

```DAX
DimFecha =
ADDCOLUMNS(
    SELECTCOLUMNS(
        CALENDAR(DATE(2025, 1, 1), DATE(2026, 8, 31)),
        "Fecha", [Date]
    ),
    "Año", YEAR([Fecha]),
    "MesNumero", MONTH([Fecha]),
    "Mes", FORMAT([Fecha], "MMM"),
    "AñoMes", FORMAT([Fecha], "yyyy-MM")
)
```

Que hace:

- `CALENDAR` crea un dia por fila dentro del periodo observado.
- `SELECTCOLUMNS` llama `Fecha` a la columna principal.
- `ADDCOLUMNS` agrega atributos utiles para filtrar y ordenar.

Despues, marcar `DimFecha` como tabla de fechas usando `DimFecha[Fecha]`. Ordenar `Mes` por `MesNumero`.

### Medidas

Crear desde `Modelado > Nueva tabla`:

```DAX
Medidas =
DATATABLE(
    "Contenedor", STRING,
    {{"Medidas"}}
)
```

Ocultar la columna `Medidas[Contenedor]` en la vista de informe. La tabla existe solamente para organizar formulas.

## 2. Poblacion de clientes

### Clientes unicos

Pregunta: ¿cuantos clientes distintos quedan bajo los filtros actuales?

```DAX
Clientes unicos =
DISTINCTCOUNT(DimClientes[cliente_id])
```

- `DISTINCTCOUNT` cuenta cada ID una sola vez.
- Formato: numero entero con separador de miles.
- Control sin filtros: **2.200**.
- Evita contar filas de productos o consumos como si fueran clientes.

### Clientes multiproducto

Pregunta: ¿cuantos clientes tienen dos o mas productos?

```DAX
Clientes multiproducto =
SUMX(
    VALUES(DimClientes[cliente_id]),
    IF(
        CALCULATE(DISTINCTCOUNT(FactProductos[producto])) >= 2,
        1,
        0
    )
)
```

- `VALUES` obtiene los clientes visibles una sola vez.
- `CALCULATE` evalua cuantos productos distintos tiene cada cliente.
- `IF` asigna 1 cuando tiene dos o mas y 0 en caso contrario.
- `SUMX` suma esas banderas.
- Formato: numero entero.
- Control sin filtros: **1.787**.

## 3. Cartera

### Saldo depositos

Pregunta: ¿que saldo conocido corresponde a cuentas de deposito?

```DAX
Saldo depositos =
CALCULATE(
    SUM(FactProductos[saldo_producto]),
    KEEPFILTERS(FactProductos[tipo_producto] = "Depósito")
)
```

- `SUM` ignora valores en blanco; no los convierte en cero.
- `CALCULATE` conserva solamente productos clasificados como deposito.
- `KEEPFILTERS` respeta los filtros existentes y agrega esta condicion.
- Formato: moneda USD, dos decimales.
- Control sin filtros: **$6.018.429,30**.
- Los saldos negativos se conservan según el contrato de limpieza.

### Saldo deuda

Pregunta: ¿que saldo conocido corresponde a productos de deuda?

```DAX
Saldo deuda =
CALCULATE(
    SUM(FactProductos[saldo_producto]),
    KEEPFILTERS(FactProductos[tipo_producto] = "Deuda")
)
```

- Aplica la misma logica anterior a creditos y tarjetas.
- Formato: moneda USD, dos decimales.
- Control sin filtros: **$71.338.479,72**.

### Saldo consolidado

Pregunta: ¿cual es el saldo conocido total sin repetir productos?

```DAX
Saldo consolidado =
SUM(FactProductos[saldo_producto])
```

- Se suma `FactProductos`, cuya granularidad es cliente-producto.
- No se usa el TSV plano porque inflaria saldos repetidos.
- Formato: moneda USD, dos decimales.
- Control sin filtros: **$77.356.909,02**.

### Saldo promedio por cliente

Pregunta: ¿cuanto saldo consolidado corresponde en promedio a cada cliente visible?

```DAX
Saldo promedio por cliente =
DIVIDE([Saldo consolidado], [Clientes unicos])
```

- `DIVIDE` evita un error cuando el denominador es cero.
- Formato: moneda USD, dos decimales.
- Control sin filtros: **$35.162,23**.
- Es un promedio de cartera consolidada por cliente, no de filas del TSV.

## 4. Consumos

### Consumo total

Pregunta: ¿cuanto suman los consumos positivos de tarjeta visibles?

```DAX
Consumo total =
SUM(FactConsumos[monto_consumo])
```

- La tabla contiene exclusivamente consumos positivos de tarjeta.
- Responde a segmento, ciudad, Lover, categoria y fecha.
- Formato: moneda USD, dos decimales.
- Control sin filtros: **$1.862.441,01**.

### Operaciones de consumo

Pregunta: ¿cuantas operaciones de consumo hay?

```DAX
Operaciones de consumo =
COUNTROWS(FactConsumos)
```

- Cada fila de `FactConsumos` es una operacion positiva.
- Formato: numero entero.
- Control sin filtros: **14.873**.

### Consumo promedio por operacion

Pregunta: ¿cual es el valor medio de una operacion?

```DAX
Consumo promedio por operacion =
AVERAGE(FactConsumos[monto_consumo])
```

- El promedio se calcula sobre operaciones, no sobre clientes.
- Formato: moneda USD, dos decimales.
- Control sin filtros: **$125,22**.
- No debe interpretarse como consumo mensual ni como promedio por cliente.

## 5. Tarjetas y utilizacion

### Saldo tarjetas

```DAX
Saldo tarjetas =
CALCULATE(
    SUM(FactProductos[saldo_producto]),
    KEEPFILTERS(FactProductos[producto] = "Tarjeta de Crédito")
)
```

- Formato: moneda USD, dos decimales.
- Control sin filtros: **$2.018.033,83**.

### Cupo tarjetas

```DAX
Cupo tarjetas =
CALCULATE(
    SUM(FactProductos[cupo_credito]),
    KEEPFILTERS(FactProductos[producto] = "Tarjeta de Crédito")
)
```

- Formato: moneda USD, dos decimales.
- Control sin filtros: **$6.146.400,00**.
- Los productos donde el cupo no aplica permanecen en blanco y no entran en la suma.

### Utilizacion ponderada TC

Pregunta: ¿que proporcion del cupo total esta representada por el saldo de tarjetas?

```DAX
Utilizacion ponderada TC =
DIVIDE([Saldo tarjetas], [Cupo tarjetas])
```

- Divide la suma de saldos entre la suma de cupos.
- Formato: porcentaje con dos decimales.
- Control sin filtros: **32,83%**.
- No se promedian porcentajes individuales: eso daria el mismo peso a tarjetas con cupos muy distintos.

## 6. Vencimientos

### Vencimientos 30 dias

Pregunta: ¿cuantos productos vencen despues del corte y hasta 30 dias despues?

```DAX
Vencimientos 30 dias =
VAR FechaCorte = DATE(2026, 8, 31)
RETURN
    CALCULATE(
        COUNTROWS(FactProductos),
        FactProductos[fecha_vencimiento] > FechaCorte,
        FactProductos[fecha_vencimiento] <= FechaCorte + 30
    )
```

- `VAR` fija la fecha reproducible del dataset.
- Solo cuenta fechas posteriores al corte y dentro de la ventana.
- Formato: numero entero.
- Control sin filtros: **22**.
- No se usa la fecha actual del computador.

### Vencimientos 90 dias

```DAX
Vencimientos 90 dias =
VAR FechaCorte = DATE(2026, 8, 31)
RETURN
    CALCULATE(
        COUNTROWS(FactProductos),
        FactProductos[fecha_vencimiento] > FechaCorte,
        FactProductos[fecha_vencimiento] <= FechaCorte + 90
    )
```

- Formato: numero entero.
- Control sin filtros: **153**.
- La ventana de 90 dias incluye los 22 productos de los primeros 30 dias.

## 7. Lovers

### Clientes con Lover

```DAX
Clientes con Lover =
CALCULATE(
    [Clientes unicos],
    KEEPFILTERS(DimClientes[cantidad_lovers] >= 1)
)
```

- Cuenta clientes que cumplen al menos una regla conductual.
- Formato: numero entero.
- Control sin filtros: **1.014**.

### Clientes multilabel

```DAX
Clientes multilabel =
CALCULATE(
    [Clientes unicos],
    KEEPFILTERS(DimClientes[cantidad_lovers] >= 2)
)
```

- Cuenta clientes que cumplen dos o mas reglas Lover.
- Formato: numero entero.
- Control sin filtros: **157**.

### Sin informacion transaccional

```DAX
Sin informacion transaccional =
CALCULATE(
    [Clientes unicos],
    KEEPFILTERS(
        DimClientes[lover_principal] = "Sin información transaccional"
    )
)
```

- Formato: numero entero.
- Control sin filtros: **545**.
- El nombre describe ausencia de consumos positivos observados; no demuestra inactividad.

## 8. Outliers de consumo

### Consumos outlier

```DAX
Consumos outlier =
CALCULATE(
    [Operaciones de consumo],
    KEEPFILTERS(FactConsumos[consumo_outlier_iqr] = TRUE())
)
```

- Formato: numero entero.
- Control sin filtros: **1.231**.
- La bandera IQR identifica casos inusuales; no demuestra fraude ni error.

### Monto outlier

```DAX
Monto outlier =
CALCULATE(
    [Consumo total],
    KEEPFILTERS(FactConsumos[consumo_outlier_iqr] = TRUE())
)
```

- Formato: moneda USD, dos decimales.
- Control sin filtros: **$700.853,11**.

### Participacion monto outlier

```DAX
Participacion monto outlier =
DIVIDE([Monto outlier], [Consumo total])
```

- Formato: porcentaje con dos decimales.
- Control sin filtros: **37,63%**.
- Se debe interpretar como concentracion para revision, no como monto a eliminar.

## Prueba rapida

Crear temporalmente una tabla visual con dos columnas: nombre de medida y valor. Sin filtros, comprobar todos los controles anteriores. Si un valor no coincide:

1. Revisar que se importaron las tres salidas de `data/processed/` y no el TSV.
2. Revisar los tipos de datos y la configuracion regional de los decimales.
3. Confirmar las relaciones 1 a muchos y direccion unica.
4. Confirmar que no existen filtros activos en el panel de filtros.
5. Usar `Restablecer filtros` antes de volver a comparar.
