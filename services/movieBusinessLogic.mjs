/**
 * Lógica de negocio específica para películas
 * Métodos utilitarios que encapsulan reglas de negocio
 */

/**
 * Verifica si ya existe una película con el mismo título
 * @param {string} title - Título a verificar
 * @param {Array} movies - Lista de películas existentes
 * @returns {boolean}
 */
export function isDuplicateTitle(title, movies) {
    return movies.some(movie =>
        movie.title.toLowerCase().trim() === title.toLowerCase().trim()
    );
}


/**
 * Filtra películas por criterios específicos
 * @param {Array} movies - Array de películas
 * @param {Object} criteria - Criterios de filtrado
 * @returns {Array} Películas filtradas
 */
export function filterMovies(movies, criteria) {
    const { genre, year, title } = criteria

    const filteredMovies = movies.filter(movie => {
        if (genre && movie.genre.toLowerCase() !== genre.toLowerCase()) {
            return false;
        }
        if (year && movie.year !== parseInt(year)) {
            return false;
        }
        if (title && !movie.title.toLowerCase().includes(title.toLowerCase())) {
            return false;
        }
        return true;
    });

    return filteredMovies
}

/**
 * Valida si un array de películas está vacío
 * @param {Array} movies - Array de películas
 * @returns {boolean} true si el array está vacío, false en caso contrario
 */
export function isMoviesArrayEmpty(movies) {
    return !movies || movies.length === 0;
}

/**
 * Crea una respuesta de error estándar
 * @param {number} statusCode - Código de estado HTTP
 * @param {string} message - Mensaje de error
 * @returns {Object} Respuesta de error estandarizada
 */
export function createErrorResponse(statusCode, message) {
    return {
        success: false,
        statusCode,
        error: { message }
    };
}

/**
 * Crea una respuesta de éxito estándar
 * @param {number} statusCode - Código de estado HTTP
 * @param {*} data - Datos de respuesta
 * @returns {Object} Respuesta de éxito estandarizada
 */
export function createSuccessResponse(statusCode, data) {
    return {
        success: true,
        statusCode,
        data
    };
}