## Mini API de Películas (Node.js sin frameworks)

API REST mínima construida con Node.js (módulos nativos) que permite listar películas, obtener una por id y agregar nuevas películas persistiendo los datos en `films.json`.

### Requisitos
- **Node.js** 18+ (recomendado LTS)
- No requiere dependencias externas ni `package.json`

### Puesta en marcha
1. Clona el repositorio o copia la carpeta del proyecto.
2. Sitúate en la raíz del proyecto.
3. Ejecuta el servidor:

```bash
node server.mjs
```

El servidor quedará disponible en `http://localhost:3003`.

### Estructura del proyecto

```text
api-peliculas-nodejs/
  server.mjs
  films.json
  helpers/
    addFilm.mjs
    findFilm.mjs
    handleFilmsRequest.mjs
    readJSON.mjs
    sendJsonResponse.mjs
    verifyBodyStructure.mjs
    writeJSON.mjs
```

### Endpoints

- **GET /**
  - Respuesta HTML simple de bienvenida.

- **GET /films**
  - Devuelve el listado completo de películas almacenadas en `films.json`.
  - Respuesta: `200 OK`, `application/json`.

- **GET /films/:id**
  - Devuelve una película por su `id` numérico.
  - Respuestas:
    - `200 OK` con la película en `JSON`.
    - `404 Not Found` si no existe.

- **POST /films**
  - Crea una nueva película y la guarda en `films.json`.
  - Cuerpo esperado (JSON estrictamente con estas 3 propiedades):
    ```json
    {
      "title": "string",
      "year": 2000,
      "genre": "string"
    }
    ```
  - Respuestas:
    - `201 Created` cuando se persiste correctamente.
    - `400 Bad Request` si el JSON es inválido o la estructura no coincide.
    - `500 Internal Server Error` si falla la lectura/escritura del archivo.

Notas importantes sobre validación del cuerpo en POST:
- El validador requiere EXACTAMENTE las claves `title`, `year`, `genre` y con tipos correctos.
- Cualquier propiedad adicional o faltante hará que la solicitud falle con `400`.

### Ejemplos con curl

- Listar todas las películas
```bash
curl -i http://localhost:3003/films
```

- Obtener una película por id (por ejemplo, 3)
```bash
curl -i http://localhost:3003/films/3
```

- Crear una nueva película
```bash
curl -i -X POST http://localhost:3003/films \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Matrix",
    "year": 1999,
    "genre": "Sci-Fi"
  }'
```

### Persistencia de datos
- Los datos se leen y escriben desde/ hacia `films.json` usando los módulos nativos de Node (`fs/promises`).
- Cada nueva película se añade con un `id` incremental basado en la longitud actual del array.
- No hay control de duplicados por `title` (pendiente de mejora).

### Errores y formatos de respuesta
- Respuestas JSON usan `application/json; charset=utf-8`.
- Posibles códigos: `200`, `201`, `400`, `404`, `500`.
- Mensajes de error típicos:
  - `{"error":"No se encontró la película solicitada."}`
  - `{"error":"El cuerpo de la solicitud tiene un formato JSON inválido."}`

### Decisiones técnicas y habilidades demostradas
- Diseño con Node.js nativo: servidor HTTP sin frameworks, uso de ESM y módulos del core.
- Modularización clara: separación en helpers (`readJSON`, `writeJSON`, `findFilm`, `verifyBodyStructure`, etc.).
- Manejo de errores y estados HTTP: respuestas consistentes con `sendJsonResponse` y códigos 200/201/400/404/500.
- Validación estricta de entradas: esquema mínimo tipado para `POST /films`.
- IO asíncrono y persistencia: lectura/escritura con `fs/promises` en `films.json`.
- Código legible y simple: pensado como demo didáctica y base para extender.

### Limitaciones actuales y cosas por agregar
- Paginación, búsqueda y filtros en `GET /films`.
- Endpoints `PUT/PATCH/DELETE` para actualizar y eliminar películas.
- Control de concurrencia para escrituras seguras en `films.json`.
- `POST /films` debería devolver el recurso creado.
- Esquemas de validación más flexibles (p. ej., con `zod` o `ajv`).
- Documentación OpenAPI/Swagger y colección de Postman.
- Tests unitarios e integración; CI simple (GitHub Actions).
- Opcional: dockerización y despliegue (Railway, Render, Fly.io, etc.).