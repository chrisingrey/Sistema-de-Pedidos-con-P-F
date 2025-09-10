# Datos Precargados

A continuación se muestra la información precargada en el sistema para pruebas y desarrollo.

## Clientes
```json
[
  {
    "id": "cust-001",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "membership": "gold",
    "address": {
      "street": "123 Oak St",
      "city": "Springfield",
      "country": "USA",
      "state": "CA",
      "zipCode": "12345"
    },
    "isActive": true
  },
  {
    "id": "cust-002",
    "name": "Bob Williams",
    "email": "bob@example.com",
    "membership": "silver",
    "address": {
      "street": "456 Pine Ave",
      "city": "Springfield",
      "country": "USA",
      "state": "FL",
      "zipCode": "12345"
    },
    "isActive": false
  },
  {
    "id": "cust-nomem",
    "name": "Cliente sin membresía",
    "email": "nomem@example.com",
    "membership": "bronze",
    "address": {
      "street": "789 Maple Rd",
      "city": "Springfield",
      "country": "USA",
      "state": "TX",
      "zipCode": "54321"
    },
    "isActive": true
  },
  {
    "id": "cust-tax-invalido",
    "name": "Cliente con dirección inválida para taxes",
    "email": "taxinvalido@example.com",
    "membership": "gold",
    "address": {
      "street": "",
      "city": "",
      "country": "",
      "state": "",
      "zipCode": ""
    },
    "isActive": true
  },
  {
    "id": "cust-sindir",
    "name": "Cliente sin dirección",
    "email": "sindir@example.com",
    "membership": "gold",
    "address": {
      "street": "123 Calle Falsa",
      "city": "Ciudad",
      "country": "Pais",
      "state": "ST",
      "zipCode": "00000"
    },
    "isActive": true
  }
]
```

## Productos
```json
[
  {
    "id": "prod-101",
    "name": "Laptop",
    "price": 1200,
    "stock": 50
  },
  {
    "id": "prod-102",
    "name": "Mouse",
    "price": 25,
    "stock": 200
  },
  {
    "id": "prod-sinprecio",
    "name": "Producto sin precio",
    "price": null,
    "stock": 10
  },
  {
    "id": "prod-sinstock",
    "name": "Producto sin stock",
    "price": 100,
    "stock": 0
  }
]
```

## Configuración de filtros por defecto
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
