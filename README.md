# Sistema de Procesamiento de Pedidos con Pipeline y Filtros

Este proyecto implementa un sistema de procesamiento de pedidos utilizando Node.js, Express y TypeScript, basado en el patrón de diseño Pipeline. El objetivo es permitir la validación, cálculo de precios, descuentos y otros procesos sobre los pedidos de manera flexible y extensible.

## ¿Cómo funciona el sistema?

El sistema está compuesto por los siguientes módulos principales:

- **Controladores (Controllers):** Reciben las solicitudes HTTP y delegan la lógica de negocio a los servicios.
- **Servicios:** Implementan la lógica de negocio, coordinando el procesamiento de pedidos, la ejecución de pipelines y la interacción con los repositorios.
- **Pipelines:** Secuencias de filtros que procesan los pedidos paso a paso. Cada filtro puede validar, modificar o rechazar el pedido.
- **Filtros:** Componentes reutilizables que realizan validaciones, cálculos de precios, descuentos, impuestos, etc. Los filtros pueden ser habilitados o deshabilitados dinámicamente.
- **Repositorios:** Gestionan el acceso a los datos de clientes, productos, pedidos y configuraciones del pipeline.
- **Modelos:** Definen la estructura de los datos (clientes, productos, pedidos, etc.).
- **Middleware:** Manejan validaciones y errores a nivel de solicitud/respuesta.

### Flujo de procesamiento de un pedido
1. El cliente realiza una solicitud para procesar un pedido (`POST /orders/process`).
2. El controlador recibe la solicitud y la envía al servicio de pedidos.
3. El servicio de pedidos ejecuta el pipeline de procesamiento, aplicando cada filtro en orden:
	- Validación de cliente
	- Integridad de datos
	- Validación de productos
	- Cálculo de precios
	- Aplicación de descuentos
	- Cálculo de impuestos
4. Si todos los filtros son exitosos, el pedido se guarda y se devuelve el resultado final junto con el detalle de cada filtro aplicado.
5. Si algún filtro falla, se detiene el procesamiento y se informa el error correspondiente.

### Configuración dinámica
La secuencia y habilitación de filtros puede modificarse mediante los endpoints de configuración del pipeline, permitiendo adaptar el flujo de procesamiento según las necesidades del negocio.

### Pruebas
El proyecto incluye pruebas unitarias y de integración usando Jest, cubriendo controladores, servicios, pipelines, filtros, repositorios y manejo de errores.




## Más información

- Para información detallada sobre los endpoints y ejemplos de uso, consulta [`docs/Endpoints.md`](docs/Endpoints.md).
- Para ver los datos precargados de clientes, productos y configuración, revisa [`docs/DataPrecargada.md`](docs/DataPrecargada.md).

## Ejecución del proyecto

1. Instala las dependencias:
	```bash
	npm install
	```
2. Inicia el servidor de desarrollo:
	```bash
	npm run dev
	```
3. Ejecuta las pruebas:
	```bash
	npm run test -- --coverage
	```

## Estructura del proyecto

```
src/
  controllers/         # Controladores HTTP
  data/                # Datos de ejemplo
  errors/              # Manejo de errores
  filters/             # Filtros de validación y precios
  middleware/          # Middleware de validación y errores
  models/              # Modelos de datos
  pipelines/           # Lógica de pipelines
  repositories/        # Acceso a datos
  routes/              # Definición de rutas
  services/            # Lógica de negocio
tests/                 # Pruebas unitarias y de integración
docs/                  # Documentación
```
