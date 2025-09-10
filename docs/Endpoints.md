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

Ejemplo de solicitud:

```json
{
  "customerId": "cust-001",
  "items": [
    { "productId": "prod-101", "quantity": 2 },
    { "productId": "prod-102", "quantity": 1 }
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

```json
{
  "status": "pending|string|completed|rejected",
  "filterResults": [
    {
      "name": string,
      "success": boolean,
      "errors": ["string"],
      "warnings": ["string"]
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

```json
{
  "enabledFilters": ["string"]
}
```

---

## Actualizar configuración del pipeline

URI: /pipeline/config

Método: POST

Descripción: Actualiza los filtros habilitados en el pipeline.

Respuestas:

200 OK:

```json
{
  "enabledFilters": ["string"]
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
    "TaxCalculationFilter"
  ]
}
```
