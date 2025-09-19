## Mini API de Películas (Node.js sin frameworks) — Arquitectura MVC

API REST mínima construida con Node.js (módulos nativos) que implementa una separación por capas siguiendo el patrón MVC (Model–View–Controller). Permite listar películas, obtener por id, crear, eliminar y actualizar parcialmente películas, persistiendo los datos en `data/movies.json`.

### Requisitos
- **Node.js** 18+ (recomendado LTS)
- No requiere dependencias externas ni `package.json`

### Puesta en marcha
1. Clona el repositorio o copia la carpeta del proyecto.
2. Sitúate en la raíz del proyecto.
3. Ejecuta el servidor:

```bash
node app.mjs
```

El servidor queda disponible en `http://localhost:3003`.

### Arquitectura MVC + Middlewares
- **Routes (`routes/`)**: reciben cada solicitud HTTP, parsean `query`, `params` y delegan en el controlador. `routes/movies.mjs` resuelve `/`, `/movies`, `/movies/:id` y enruta `POST /movies`, `DELETE /movies/:id` y `PATCH /movies/:id`.
- **Controllers (`controllers/`)**: coordinan el flujo por petición: validan entrada (cuando aplica), invocan al modelo y devuelven la respuesta con `sendJsonResponse`.
- **Models (`models/`)**: encapsulan la lógica de negocio y el acceso a datos. `models/movies.mjs` lee/escribe del archivo JSON, aplica filtros y gestiona códigos de estado y mensajes de error coherentes.
- **Middlewares (`middlewares/`)**: parseo de JSON, validación de datos y ejecución de cadenas de middlewares: `parseJsonBody`, `validateBody`, `validatePartialBody`, `runMiddlewares`.
- **Helpers (`helpers/`)**: utilidades para IO, validación, filtrado y respuestas HTTP: `readJSON`, `writeJSON`, `sendJsonResponse`, `filterMovies`, `addMovie`, `verifyBodyStructure`.

Esta separación mejora la mantenibilidad, testabilidad y escalabilidad del proyecto.

### Sistema de Middlewares

El proyecto implementa un sistema de middlewares personalizado que permite procesar las peticiones HTTP de manera modular:

- `parseJsonBody.mjs`: parsea automáticamente el cuerpo JSON de peticiones POST/PUT/PATCH. Maneja errores de parseo y establece `req.body`.
- `validateBody.mjs`: valida la estructura del cuerpo contra el esquema para creaciones (requerido completo).
- `validatePartialBody.mjs`: valida la estructura para actualizaciones parciales (todas las claves opcionales, tipos correctos, sin extras).
- `runMiddlewares.mjs`: Sistema de ejecución de cadenas de middlewares similar a Express.js. Permite ejecutar middlewares de forma secuencial con manejo de errores integrado.

Ejemplo en rutas:
```javascript
const middlewares = [parseJsonBody, validateBody]
runMiddlewares(req, res, middlewares, async (error) => {
    if (error) return sendJsonResponse(res, 500, { error: "Error interno" })
    MoviesController.create(req, res)
})
```

### Estructura del proyecto

```text
api-peliculas-nodejs/
  app.mjs
  data/
    movies.json
  routes/
    movies.mjs
  controllers/
    movies.mjs
  models/
    movies.mjs
  middlewares/
    parseJsonBody.mjs
    runMiddlewares.mjs
    validateBody.mjs
    validatePartialBody.mjs
  helpers/
    addMovie.mjs
    filterMovies.mjs
    readJSON.mjs
    sendJsonResponse.mjs
    verifyBodyStructure.mjs
    writeJSON.mjs
  README.md
```

### Endpoints

- GET `/`
  - Respuesta HTML de bienvenida.

- GET `/movies`
  - Devuelve el listado de películas.
  - Filtros opcionales por `genre`, `year` y `title` mediante query string, p. ej.: `?genre=Action`, `?year=2010`, `?title=Matrix`.
  - Códigos: `200 OK`, `404 Not Found` si no hay datos o no hay coincidencias.

- GET `/movies/:id`
  - Devuelve una película por su `id` numérico.
  - Valida que `id` sea numérico; en caso contrario responde `400`.
  - Códigos: `200 OK`, `404 Not Found` si no existe, `400 Bad Request` si `id` inválido.

- POST `/movies`
  - Crea una nueva película y la persiste en `data/movies.json`.
  - Utiliza un sistema de middlewares para validación automática del cuerpo de la petición.
  - Cuerpo esperado (JSON estrictamente con estas 3 propiedades):
    ```json
    {
      "title": "string",
      "year": 2000,
      "genre": "string"
    }
    ```
  - Reglas: no se permiten propiedades extra; tipos deben coincidir.
  - Códigos: `201 Created`, `400 Bad Request` si el JSON o la estructura es inválida, `500 Internal Server Error` si falla IO.

- DELETE `/movies/:id`
  - Elimina una película por su `id` numérico.
  - Valida que `id` sea numérico.
  - Códigos: `200 OK` con mensaje y `deletedMovie`, `404 Not Found` si no existe, `400 Bad Request` si `id` inválido.

- PATCH `/movies/:id`
  - Actualiza parcialmente una película existente.
  - Middlewares: `parseJsonBody`, `validatePartialBody`.
  - Reglas: todas las claves son opcionales, tipos deben ser correctos; no se permite actualizar `id` (se ignora si viene en el body).
  - Códigos: `200 OK` con el recurso actualizado, `404 Not Found` si no existe, `400 Bad Request` si `id` inválido, `500 Internal Server Error` si falla IO.

### Ejemplos con curl

- Listar todas las películas
```bash
curl -i http://localhost:3003/movies
```

- Filtrar por género
```bash
curl -i "http://localhost:3003/movies?genre=Action"
```

- Filtrar por año
```bash
curl -i "http://localhost:3003/movies?year=2010"
```

- Filtrar por título
```bash
curl -i "http://localhost:3003/movies?title=Matrix"
```

- Obtener una película por id (por ejemplo, 3)
```bash
curl -i http://localhost:3003/movies/3
```

- Intentar obtener con id inválido
```bash
curl -i http://localhost:3003/movies/abc
```

- Crear una nueva película
```bash
curl -i -X POST http://localhost:3003/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Matrix",
    "year": 1999,
    "genre": "Sci-Fi"
  }'
```

- Eliminar una película por id (por ejemplo, 2)
```bash
curl -i -X DELETE http://localhost:3003/movies/2
```

- Actualización parcial (PATCH) de una película (por ejemplo, 1)
```bash
curl -i -X PATCH http://localhost:3003/movies/1 \
  -H "Content-Type: application/json" \
  -d '{
    "genre": "Science Fiction"
  }'
```

### Persistencia de datos
- Los datos se leen y escriben desde/hacia `data/movies.json` usando `fs/promises`.
- Cada nueva película se añade con un `id` incremental basado en la longitud actual del array.
- Al eliminar elementos pueden quedar huecos en los IDs (no se reindexa).
- No hay control de duplicados por `title` (posible mejora).

### Errores y formatos de respuesta
- Respuestas JSON usan `application/json; charset=utf-8`.
- Códigos posibles: `200`, `201`, `400`, `404`, `500`.
- Mensajes de error típicos:
  - `{ "error": "El cuerpo de la solicitud tiene un formato JSON inválido." }`
  - `{ "error": "El ID debe ser un número válido" }`
  - `{ "message": "No se encontraron películas que coincidan con los filtros proporcionados" }`

### Decisiones técnicas destacadas
- Node.js nativo con ESM y módulos del core; sin frameworks.
- Separación clara por capas (MVC + Middlewares).
- Sistema de middlewares personalizado para parseo y validación.
- Manejo consistente de estados HTTP y respuestas mediante helper dedicado.
- Validación estricta en `POST` y validación parcial en `PATCH`.
- Filtros en `GET /movies` por `genre`, `year` y `title`.
- Endpoint DELETE para eliminación de películas con validación de ID.
- Arquitectura modular que facilita la extensión y mantenimiento del código.

### Roadmap / futuras mejoras
- Paginación, búsqueda y filtros combinados para `GET /movies`.
- Endpoint `PUT` para reemplazos completos del recurso.
- Control de concurrencia para escrituras seguras en `movies.json`.
- Documentación OpenAPI/Swagger y colección de Postman.
- Tests unitarios e integración; CI simple (GitHub Actions).