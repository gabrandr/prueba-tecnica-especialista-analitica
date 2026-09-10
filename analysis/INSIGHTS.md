# Insights accionables

## Cómo leer este documento

Los hallazgos provienen del dataset sintético y de la fecha de corte fija 2026-08-31. Cada insight separa lo observado de su interpretación. Las acciones son hipótesis comerciales que deben medirse; no son resultados causales demostrados.

## 1. Existe una base relevante para personalización

- **Evidencia:** 1.014 de los 2.200 clientes (46,09%) cumplen al menos una regla Lover. Además, 157 clientes cumplen dos o tres reglas.
- **Interpretación:** existe una población material con señales de recurrencia y concentración de gasto. La superposición muestra que las afinidades no son necesariamente excluyentes.
- **Acción y responsable:** CRM o Marketing puede probar campañas diferenciadas para Travel, Streaming, Food y Tech, permitiendo más de una temática cuando corresponda.
- **KPI:** tasa de conversión, consumo incremental frente a un grupo de control y retorno de la campaña.
- **Limitación:** los umbrales de 2 consumos y 20% son reglas heurísticas; no garantizan preferencia futura.

## 2. Los Generalistas requieren una estrategia distinta

- **Evidencia:** 641 clientes son Generalistas. Representan 29,14% de la base total y 38,73% de los 1.655 clientes con consumos.
- **Interpretación:** su gasto está más distribuido o todavía no alcanza suficiente recurrencia en las cuatro categorías evaluadas.
- **Acción y responsable:** CRM puede probar beneficios amplios y continuar observando comportamiento antes de asignar una oferta temática.
- **KPI:** conversión, consumo incremental, repetición de compra y proporción que desarrolla una señal Lover estable.
- **Limitación:** no cumplir una regla Lover no significa desinterés ni bajo valor comercial.

## 3. “Sin información transaccional” no significa inactividad

- **Evidencia:** los 545 clientes sin consumos positivos coinciden exactamente con los clientes sin tarjeta de crédito observada.
- **Interpretación:** los datos no permiten distinguir falta de interés, falta de elegibilidad o ausencia de oferta del producto.
- **Acción y responsable:** Producto y Riesgo pueden evaluar una campaña de adquisición de tarjeta después de aplicar criterios de elegibilidad y capacidad de pago.
- **KPI:** clientes elegibles, tasa de aprobación, activación, primera compra y mora temprana como guardrail.
- **Limitación:** faltan variables de riesgo, contacto, consentimiento, historial de campañas y propensión.

## 4. Los próximos vencimientos permiten una acción inmediata

- **Evidencia:** 22 productos vencen en los próximos 30 días y los 22 son tarjetas. En una ventana de 90 días vencen 153 productos: 98 tarjetas, 21 créditos de consumo, 19 vehiculares y 15 hipotecarios.
- **Interpretación:** existe una población concreta para comunicación preventiva y priorización operativa.
- **Acción y responsable:** Operaciones o Servicio al Cliente puede organizar recordatorios y renovaciones por cercanía del vencimiento.
- **KPI:** porcentaje renovado antes del vencimiento, contactos efectivos y tiempo medio de renovación.
- **Limitación:** la ventana usa una fecha de corte fija y el dataset no contiene contacto, consentimiento ni historial de renovación.

## 5. Los valores extremos son pocos, pero materiales

- **Evidencia:** 1.231 consumos marcados mediante IQR representan 8,28% de las 14.873 transacciones y 37,63% del monto total. Están distribuidos entre 541 clientes.
- **Interpretación:** eliminar estos registros automáticamente reduciría de manera importante el valor observado. Un valor inusual puede ser válido, un error o un caso que requiera revisión.
- **Acción y responsable:** Analítica y Riesgo deben revisar los casos con reglas de negocio y señales adicionales antes de excluirlos o convertirlos en alertas.
- **KPI:** porcentaje de casos revisados, monto validado, tasa de falsos positivos y tiempo de resolución.
- **Limitación:** una bandera IQR no identifica fraude y el dataset no incluye variables suficientes para confirmarlo.

## Mensaje ejecutivo

La segmentación permite personalizar oportunidades sin ocultar a los clientes Generalistas ni confundir ausencia de tarjeta con inactividad. La acción inmediata más concreta es gestionar vencimientos; las campañas basadas en Lovers deben probarse con grupos comparables y los consumos extremos deben revisarse antes de excluirse.
