## Mini API de Películas (Node.js sin frameworks) — Arquitectura MVC

API REST mínima construida con Node.js (módulos nativos) que implementa una separación por capas siguiendo el patrón MVC (Model–View–Controller). Permite listar películas, obtener una por id, crear nuevas películas y eliminar películas existentes, persistiendo los datos en `data/movies.json`.

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

El servidor quedará disponible en `http://localhost:3003`.

### Arquitectura MVC + Middlewares
- **Routes (`routes/`)**: reciben cada solicitud HTTP, parsean `query`, `params` y delegan en el controlador correspondiente. En este proyecto `routes/movies.mjs` resuelve rutas para `/`, `/movies`, `/movies/:id` y enruta `POST /movies` y `DELETE /movies/:id`.
- **Controllers (`controllers/`)**: coordinan el flujo por petición: validan entrada (cuando aplica), invocan al modelo y formatean la respuesta mediante `sendJsonResponse`. Ver `controllers/movies.mjs`.
- **Models (`models/`)**: encapsulan la lógica de negocio y el acceso a datos. `models/movies.mjs` lee/escribe del almacenamiento (archivo JSON), aplica filtros y gestiona códigos de estado y mensajes de error coherentes.
- **Middlewares (`middlewares/`)**: capa de procesamiento intermedio que maneja tareas transversales como parseo de JSON, validación de datos y ejecución de cadenas de middlewares. Incluye `parseJsonBody`, `runMiddlewares` y `validateBody`.
- **Helpers (`helpers/`)**: utilidades puras y reutilizables para IO, validación, filtrado y respuestas HTTP (`readJSON`, `writeJSON`, `sendJsonResponse`, `filterMovies`, `addMovie`, `verifyBodyStructure`).

Esta separación mejora la mantenibilidad, testabilidad y escalabilidad del proyecto.

### Sistema de Middlewares

El proyecto implementa un sistema de middlewares personalizado que permite procesar las peticiones HTTP de manera modular:

- **`parseJsonBody.mjs`**: Middleware que parsea automáticamente el cuerpo JSON de las peticiones POST/PUT/PATCH. Maneja errores de parseo y establece `req.body` para uso posterior.

- **`validateBody.mjs`**: Middleware que valida la estructura del cuerpo de la petición usando `verifyBodyStructure`. Asegura que los datos cumplan con el esquema esperado.

- **`runMiddlewares.mjs`**: Sistema de ejecución de cadenas de middlewares similar a Express.js. Permite ejecutar middlewares de forma secuencial con manejo de errores integrado.

**Ejemplo de uso en las rutas:**
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

- **GET /**
  - Respuesta HTML de bienvenida.

- **GET /movies**
  - Devuelve el listado de películas. Soporta filtros opcionales por `genre`, `year` y `title` mediante query string, p. ej.: `/movies?genre=Action`, `/movies?year=2010` o `/movies?title=Matrix`.
  - Respuestas: `200 OK` con `application/json`, `404 Not Found` si no hay películas o no hay coincidencias con los filtros.

- **GET /movies/:id**
  - Devuelve una película por su `id` numérico.
  - Respuestas: `200 OK` con la película en `JSON`, `404 Not Found` si no existe.

- **POST /movies**
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
  - Respuestas: `201 Created` cuando se persiste correctamente, `400 Bad Request` si el JSON es inválido o la estructura no coincide, `500 Internal Server Error` si falla la lectura/escritura del archivo.

Notas sobre validación en POST:
- El sistema de middlewares valida automáticamente el formato JSON y la estructura del cuerpo.
- El validador exige EXACTAMENTE las claves `title`, `year`, `genre` con tipos correctos.
- Cualquier propiedad adicional o faltante produce `400`.
- El middleware `parseJsonBody` maneja el parseo del JSON y `validateBody` verifica la estructura.

- **DELETE /movies/:id**
  - Elimina una película por su `id` numérico.
  - Respuestas: `200 OK` con mensaje de confirmación y datos de la película eliminada, `404 Not Found` si no existe la película, `400 Bad Request` si el ID no es válido.

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

### Persistencia de datos
- Los datos se leen y escriben desde/hacia `data/movies.json` usando `fs/promises`.
- Cada nueva película se añade con un `id` incremental basado en la longitud actual del array.
- Las películas se pueden eliminar por ID, actualizando el archivo JSON.
- No hay control de duplicados por `title` (pendiente de mejora).

### Errores y formatos de respuesta
- Respuestas JSON usan `application/json; charset=utf-8`.
- Posibles códigos: `200`, `201`, `400`, `404`, `500`.
- Mensajes de error típicos:
  - `{"error":"No se encontró una película con el ID solicitado."}`
  - `{"error":"El cuerpo de la solicitud tiene un formato JSON inválido."}`

### Decisiones técnicas destacadas
- Node.js nativo con ESM y módulos del core; sin frameworks.
- Separación clara por capas (MVC + Middlewares) para favorecer mantenimiento y pruebas.
- Sistema de middlewares personalizado para manejo de peticiones y validación.
- Manejo consistente de estados HTTP y respuestas mediante helper dedicado.
- Validación estricta del input en `POST /movies` mediante middlewares.
- Filtros avanzados en `GET /movies` por `genre`, `year` y `title`.
- Endpoint DELETE para eliminación de películas con validación de ID.
- Arquitectura modular que facilita la extensión y mantenimiento del código.

### Roadmap / futuras mejoras
- Paginación, búsqueda y filtros combinados para `GET /movies`.
- Endpoints `PUT/PATCH` para actualizar películas existentes.
- Control de concurrencia para escrituras seguras en `movies.json`.
- `POST /movies` debería devolver el recurso creado con su `id`.
- Documentación OpenAPI/Swagger y colección de Postman.
- Tests unitarios e integración; CI simple (GitHub Actions).