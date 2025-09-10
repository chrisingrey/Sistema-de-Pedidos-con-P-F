# Datos Precargados

A continuación se muestra la información precargada en el sistema para pruebas y desarrollo.

## Clientes
```json
[
  {
    "id": "cust-001",
    "name": "Cliente 1",
    "membership": "gold",
    "address": {
      "street": "Calle 1",
      "city": "Ciudad A",
      "country": "País X"
    }
  },
  {
    "id": "cust-002",
    "name": "Cliente 2",
    "membership": "silver",
    "address": {
      "street": "Calle 2",
      "city": "Ciudad B",
      "country": "País Y"
    }
  }
]
```

## Productos
```json
[
  {
    "id": "prod-101",
    "name": "Producto A",
    "price": 500,
    "stock": 100
  },
  {
    "id": "prod-102",
    "name": "Producto B",
    "price": 250,
    "stock": 200
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
    "TaxCalculationFilter"
  ]
}
```
