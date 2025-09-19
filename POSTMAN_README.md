# Colección de Postman - Movies API

Esta colección de Postman contiene todos los endpoints de la API de Películas con ejemplos de uso y casos de prueba.

## Cómo importar la colección

### Opción 1: Importar desde archivos
1. Abre Postman
2. Haz clic en "Import" en la esquina superior izquierda
3. Selecciona los archivos:
   - `postman_collection.json` (Colección)
   - `postman_environment.json` (Variables de entorno)

### Opción 2: Importar desde URL (si está en GitHub)
1. Abre Postman
2. Haz clic en "Import"
3. Pega la URL del archivo JSON de la colección

## Endpoints incluidos

### ✅ **GET Endpoints**
- **Welcome** - Página de bienvenida
- **Get All Movies** - Listar todas las películas
- **Get Movies by Genre** - Filtrar por género (Action)
- **Get Movies by Year** - Filtrar por año (2010)
- **Get Movies by Title** - Filtrar por título (Inception)
- **Get Movie by ID** - Obtener película específica
- **Get Movie by ID - Not Found** - Caso de error 404

### ✅ **POST Endpoints**
- **Create New Movie** - Crear nueva película
- **Create Movie - Duplicate Title** - Validación de duplicados
- **Create Movie - Invalid Data** - Validación de datos

### ✅ **PATCH Endpoints**
- **Update Movie** - Actualizar película
- **Update Movie - Duplicate Title** - Validación de duplicados
- **Update Movie - Not Found** - Caso de error 404

### ✅ **DELETE Endpoints**
- **Delete Movie** - Eliminar película
- **Delete Movie - Not Found** - Caso de error 404

### ✅ **Error Cases**
- **Invalid Route** - Ruta no encontrada

## 🔧 Configuración

### Variables de entorno
La colección incluye las siguientes variables:

- `base_url`: `http://localhost:3003` (URL base de la API)
- `api_version`: `v1` (Versión de la API)
- `content_type`: `application/json` (Tipo de contenido)

### Cambiar la URL base
Si tu API corre en un puerto diferente:
1. Ve a la pestaña "Environments"
2. Selecciona "Movies API Environment"
3. Cambia el valor de `base_url` a tu URL

## 🧪 Casos de prueba incluidos

### Casos exitosos
- ✅ Obtener todas las películas
- ✅ Filtrar películas por diferentes criterios
- ✅ Crear nueva película
- ✅ Actualizar película existente
- ✅ Eliminar película

### Casos de error
- ❌ Película no encontrada (404)
- ❌ Título duplicado (409)
- ❌ Datos inválidos (400)
- ❌ Ruta no encontrada (404)

## Códigos de estado HTTP

| Código | Descripción | Cuándo ocurre |
|--------|-------------|---------------|
| 200 | OK | Operación exitosa |
| 201 | Created | Película creada exitosamente |
| 400 | Bad Request | Datos inválidos o JSON malformado |
| 404 | Not Found | Película no encontrada o sin resultados |
| 409 | Conflict | Título duplicado |
| 500 | Internal Server Error | Error del servidor |

## Cómo usar

1. **Asegúrate de que la API esté corriendo:**
   ```bash
   node app.mjs
   ```

2. **Selecciona el entorno "Movies API Environment"**

3. **Ejecuta las peticiones en orden:**
   - Primero las peticiones GET para ver datos existentes
   - Luego POST para crear nuevas películas
   - Después PATCH para actualizar
   - Finalmente DELETE para eliminar