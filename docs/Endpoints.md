# Tabla de Contenido

- [Crear un pedido](#crear-un-pedido)
- [Consultar estado de un pedido](#consultar-estado-de-un-pedido)
- [Obtener configuración del pipeline](#obtener-configuración-del-pipeline)
- [Actualizar configuración del pipeline](#actualizar-configuración-del-pipeline)

# Endpoints

## Crear un pedido

URI: /orders/process

Método: POST

Descripción: Procesa un nuevo pedido en el sistema.

Respuestas:

201 Created: El pedido ha sido creado exitosamente.

```json
{
  "success": boolean,
  "finalOrder": {
    "id": "string",
    "customerId": "string",
    "items": [
      { "productId": "string", "quantity": number }
    ],
    "status": "pending|string|completed|rejected",
    "createdAt": "string",
    "subtotal": number,
    "discounts": [
      { "type": "string", "value": number, "description": "string" }
    ],
    "taxes": number,
    "total": number,
    "metadata": { }
  },
  "filterResults": [
    {
      "name": string,
      "success": boolean,
      "errors": ["string"],
      "warnings": ["string"]
    }
  ],
  "executionTime": number,
  "failedAt": "string|null"
}
```

400 Bad Request: El cuerpo de la solicitud es inválido o faltan datos requeridos.
409 Conflict: Ya existe un pedido igual.
500 Internal Server Error: Ocurrió un error inesperado en el servidor.


Ejemplo de solicitud válida:
```json
{
  "customerId": "cust-001",
  "items": [
    { "productId": "prod-101", "quantity": 2 },
    { "productId": "prod-102", "quantity": 1 }
  ]
}
```

### Ejemplos de órdenes que deberían fallar según cada filtro

#### Filtro: Validación de cliente
Cliente inexistente:
```json
{
  "customerId": "cliente-invalido",
  "items": [
    { "productId": "prod-101", "quantity": 1 }
  ]
}
```

#### Filtro: Integridad de datos
Falta el campo items:
```json
{
  "customerId": "cust-001"
}
```
Cantidad inválida:
```json
{
  "customerId": "cust-001",
  "items": [
    { "productId": "prod-101", "quantity": 0 }
  ]
}
```

#### Filtro: Validación de productos
Producto inexistente:
```json
{
  "customerId": "cust-001",
  "items": [
    { "productId": "prod-invalido", "quantity": 1 }
  ]
}
```
Stock insuficiente:
```json
{
  "customerId": "cust-001",
  "items": [
    { "productId": "prod-sinstock", "quantity": 1 }
  ]
}
```

#### Filtro: Cálculo de precios
Producto sin precio:
```json
{
  "customerId": "cust-001",
  "items": [
    { "productId": "prod-sinprecio", "quantity": 1 }
  ]
}
```

#### Filtro: Descuento por membresía
Cliente sin membresía válida:
```json
{
  "customerId": "cust-nomem",
  "items": [
    { "productId": "prod-101", "quantity": 1 }
  ]
}
```


#### Filtro: Descuento por volumen (VolumeDiscountFilter)
Pedido con más de 10 ítems:
```json
{
  "customerId": "cust-001",
  "items": [
    { "productId": "prod-101", "quantity": 11 }
  ]
}
```
Pedido con subtotal mayor a $1000:
```json
{
  "customerId": "cust-001",
  "items": [
    { "productId": "prod-101", "quantity": 1 },
    { "productId": "prod-102", "quantity": 40 }
  ]
}
```

#### Filtro: Cálculo de impuestos
Dirección de cliente incompleta:
```json
{
  "customerId": "cust-tax-invalido",
  "items": [
    { "productId": "prod-101", "quantity": 1 }
  ]
}
```

---

## Consultar estado de un pedido

URI: /orders/:id/status

Método: GET

Descripción: Devuelve el estado y los resultados de los filtros para un pedido específico.

Respuestas:

200 OK: El pedido fue encontrado.

Ejemplo de respuesta:
```json
{
  "status": "completed",
  "filterResults": [
    {
      "name": "CustomerValidationFilter",
      "success": true,
      "errors": [],
      "warning": []
    },
    {
      "name": "PriceCalculationFilter",
      "success": true,
      "errors": [],
      "warning": []
    }
  ]
}
```

404 Not Found: Pedido no encontrado.

---

## Obtener configuración del pipeline

URI: /pipeline/config

Método: GET

Descripción: Devuelve la configuración actual del pipeline (filtros habilitados).

Respuestas:

200 OK:

Ejemplo de respuesta:
```json
{
  "enabledFilters": [
    "CustomerValidationFilter",
    "DataIntegrityFilter",
    "ProductValidationFilter",
    "PriceCalculationFilter",
    "MembershipDiscountFilter",
    "TaxCalculationFilter",
    "VolumeDiscountFilter"
  ]
}
```

---

## Actualizar configuración del pipeline

URI: /pipeline/config

Método: POST

Descripción: Actualiza los filtros habilitados en el pipeline.

Respuestas:

200 OK:

Ejemplo de respuesta:
```json
{
  "enabledFilters": [
    "CustomerValidationFilter",
    "DataIntegrityFilter",
    "ProductValidationFilter",
    "PriceCalculationFilter",
    "MembershipDiscountFilter",
    "TaxCalculationFilter",
    "VolumeDiscountFilter"
  ]
}
```

400 Bad Request: Datos inválidos.
500 Internal Server Error: Ocurrió un error inesperado en el servidor.

Ejemplo de solicitud:
```json
{
  "enabledFilters": [
    "CustomerValidationFilter",
    "DataIntegrityFilter",
    "ProductValidationFilter",
    "PriceCalculationFilter",
    "MembershipDiscountFilter",
    "TaxCalculationFilter",
    "VolumeDiscountFilter"
  ]
}
```
