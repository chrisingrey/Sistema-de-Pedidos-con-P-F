# Sistema de Procesamiento de Pedidos con Pipeline y Filtros

Este proyecto es una API de ejemplo para la gestión y procesamiento de pedidos, desarrollada en Node.js, Express y TypeScript. Utiliza el patrón Pipeline para aplicar validaciones, cálculos de precios, descuentos, impuestos y más, de forma flexible y extensible.

## ¿Qué resuelve este sistema?

Permite recibir pedidos, validarlos, calcular precios y descuentos, y registrar el resultado de cada etapa del procesamiento. El flujo de filtros es configurable y extensible, ideal para escenarios de negocio donde las reglas pueden cambiar o crecer.

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
   - Descuento por membresía
   - Cálculo de impuestos
   - Descuento por volumen
4. Si todos los filtros son exitosos, el pedido se guarda y se devuelve el resultado final junto con el detalle de cada filtro aplicado.
5. Si algún filtro falla, se detiene el procesamiento y se informa el error correspondiente.

### Configuración dinámica

La secuencia y habilitación de filtros puede modificarse mediante los endpoints de configuración del pipeline, permitiendo adaptar el flujo de procesamiento según las necesidades del negocio.

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

## Endpoints y documentación

- Consulta los endpoints y ejemplos de uso en [`docs/Endpoints.md`](docs/Endpoints.md).
- Datos precargados de clientes, productos y configuración en [`docs/DataPrecargada.md`](docs/DataPrecargada.md).

## Ejemplo de uso con Postman

Para probar la API fácilmente, puedes importar la colección de Postman incluida:

- Archivo: `docs/SistemaPedidos.postman_collection.json`

Esta colección contiene ejemplos listos para:

- Procesar un pedido
- Consultar el estado de un pedido
- Obtener y actualizar la configuración del pipeline

**¿Cómo usarla?**

1. Abre Postman y selecciona "Import".
2. Elige el archivo `docs/SistemaPedidos.postman_collection.json`.
3. Ejecuta los requests de la colección contra tu servidor local (`http://localhost:3000` por defecto).

Esto te permitirá probar todos los flujos principales del sistema de manera interactiva y ver ejemplos reales de entrada y salida.
