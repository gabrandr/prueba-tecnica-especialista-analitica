# Digotec Analytics — aplicación React

MVP responsive para explorar la vista cliente 360 generada por el notebook. Incluye acceso demostrativo, filtros combinables, KPIs recalculables, visualizaciones accesibles, clientes paginados y un espacio preparado para Power BI.

## Requisitos y ejecución

- Node.js 22.12.0 o superior.
- npm; las versiones instaladas quedan fijadas en `package-lock.json`.

Desde la raíz del repositorio:

```bash
cd app
npm install
npm run sync:data
npm run dev
```

Abrir la URL indicada por Vite, normalmente `http://localhost:5173`.

Credenciales del login demo:

- Correo: `analista@digotec.demo`
- Contraseña: `Digotec2026!`

El login no brinda seguridad real: compara valores en el navegador y guarda en `sessionStorage` únicamente un marcador de sesión, nunca el correo ni la contraseña. En una solución corporativa se reemplazaría por Microsoft Entra ID u otro proveedor de identidad.

## Datos reproducibles

`npm run sync:data` ejecuta un script Node multiplataforma que copia, sin transformar:

| Fuente analítica | Copia pública usada por Vite |
|---|---|
| `../data/processed/cliente_360.json` | `public/data/clientes_360.json` |
| `../data/processed/data_quality_report.json` | `public/data/data_quality_report.json` |

Las copias se versionan para que el build de Vercel no necesite Python. La aplicación descarga ambos archivos en paralelo, comprueba el contrato y exige 2.200 IDs únicos. Si la carga falla, presenta un estado de error con reintento.

El campo `saldo_tarjetas_conocido` se añadió a cliente 360 para que la utilización ponderada pueda recalcularse después de filtrar: `suma de saldos de tarjeta / suma de cupos`. El saldo de tarjeta ya forma parte de `saldo_deuda_conocido`; no deben sumarse entre sí.

## Exploración y métricas

Los filtros de búsqueda, segmento, ciudad, producto y Lover se combinan con una condición “y”. La búsqueda acepta nombre o ID sin distinguir mayúsculas ni tildes. Para Travel, Streaming, Food y Tech se consulta la lista multilabel; `Generalista` y `Sin información transaccional` consultan la clasificación principal.

Los seis KPIs, la tenencia por producto y la distribución principal se recalculan sobre los clientes visibles. Si una selección no tiene cupo de tarjeta, la utilización muestra “Sin cupo aplicable”. La tabla presenta diez clientes por página y regresa a la primera al cambiar filtros.

Los vencimientos y outliers están titulados “Señales de la base completa”: proceden del reporte de calidad y no cambian con filtros porque cliente 360 no contiene su detalle individual. Presentarlos como filtrados sería una falsa precisión.

Los montos usan `$`, formato `es-EC` y moneda USD como supuesto visual. La fuente no incluye una columna de moneda, por lo que este supuesto debe validarse antes de uso productivo.

## Power BI

Copiar `.env.example` a un archivo local `.env` y completar opcionalmente:

```text
VITE_POWER_BI_EMBED_URL=
VITE_POWER_BI_REPORT_ID=
VITE_POWER_BI_WORKSPACE_ID=
```

Sin una URL HTTPS, la interfaz muestra un estado “no configurado”. Con URL válida, muestra un iframe titulado. Este mecanismo solo prepara el espacio visual: un reporte corporativo privado requiere publicación en Power BI Service, permisos del workspace, autenticación con Microsoft Entra ID, un token de embed emitido de forma segura y, según el alcance, `powerbi-client`. Nunca debe colocarse un secreto o token permanente en variables `VITE_*`, porque se exponen al navegador.

### Evolución corporativa propuesta

El `iframe` actual es únicamente una demostración técnica: no implementa autenticación corporativa, autorización ni seguridad por filas.

Para usuarios internos se recomienda **embed for your organization**. SPFx y React reutilizarían la sesión de Microsoft 365, Power BI Service comprobaría los permisos y el modelo semántico aplicaría RLS. `tenantId`, `workspaceId`, `reportId` y `embedUrl` son identificadores de configuración: no son secretos y tampoco conceden acceso por sí solos.

Tokens, secretos de aplicación, certificados y credenciales de base de datos no deben almacenarse en React, SPFx, variables `VITE_*`, SharePoint Lists ni el repositorio. Si se adoptara *app owns data*, un backend autorizado generaría tokens temporales y custodiaría sus credenciales en un almacén seguro.

La propuesta completa está en [Arquitectura corporativa](../docs/ARCHITECTURE.md) y el flujo diario de vencimientos en [Automatización](../docs/AUTOMATION.md).

## Comandos

| Comando | Propósito |
|---|---|
| `npm run sync:data` | Actualiza las copias públicas desde los datos procesados. |
| `npm run dev` | Inicia Vite con recarga automática. |
| `npm run typecheck` | Comprueba contratos TypeScript. |
| `npm test` | Ejecuta Vitest una vez. |
| `npm run test:watch` | Ejecuta pruebas en modo observación. |
| `npm run lint` | Revisa el código con Oxlint. |
| `npm run build` | Verifica tipos y genera `dist/`. |
| `npm run preview` | Sirve localmente el build generado. |

## Diseño, accesibilidad y límites

- React 19, TypeScript, Vite y CSS Modules; sin Next.js, router, framework visual ni librería de gráficos.
- En móvil, los filtros se despliegan, los KPIs usan dos columnas y la tabla se representa como tarjetas.
- Los gráficos de barras usan HTML/CSS y mantienen valores textuales para no depender únicamente del color.
- Incluye enlace de salto, foco visible, controles de 44 px, regiones dinámicas y reducción de movimiento.
- Los datos son sintéticos, la fecha de corte es 2026-08-31 y no existe backend.
- Despliegue público: <https://prueba-tecnica-especialista-analiti.vercel.app/>.
