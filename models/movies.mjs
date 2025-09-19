import { readJSON } from "../helpers/readJSON.mjs";
import { writeJSON } from "../helpers/writeJSON.mjs";

/**
 * Modelo para acceso a datos de películas
 * Solo maneja operaciones de lectura y escritura, sin lógica de negocio
 */
export class MoviesModel {
    /**
     * Obtiene todas las películas desde el archivo JSON
     * @returns {Promise<Array>} Array de películas o array vacío
     */
    static async getAll() {
        try {
            const readResponse = await readJSON();
            
            if (!readResponse.success) {
                throw new Error(readResponse.error || "Error al leer el archivo de películas");
            }

            return JSON.parse(readResponse.data) || [];
        } catch (error) {
            throw new Error(`Error al obtener películas: ${error.message}`);
        }
    }

    /**
     * Guarda todas las películas en el archivo JSON
     * @param {Array} movies - Array de películas a guardar
     * @returns {Promise<Object>} Resultado de la operación
     */
    static async saveAll(movies) {
        try {
            if (!Array.isArray(movies)) {
                throw new Error("Los datos deben ser un array de películas");
            }

            const { success, message } = await writeJSON(movies);
            
            if (!success) {
                throw new Error(message || "Error al escribir el archivo");
            }

            return {
                success: true,
                message: "Películas guardadas correctamente"
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Obtiene una película por ID (solo acceso a datos)
     * @param {number} id - ID de la película
     * @returns {Promise<Object|null>} Película encontrada o null
     */
    static async getById(id) {
        try {
            const movies = await this.getAll();
            const numericId = parseInt(id);
            return movies.find(movie => movie.id === numericId) || null;
        } catch (error) {
            throw new Error(`Error al obtener película por ID: ${error.message}`);
        }
    }

    /**
     * Verifica si existe una película con el ID dado
     * @param {number} id - ID a verificar
     * @returns {Promise<boolean>} True si existe, false si no
     */
    static async existsById(id) {
        try {
            const movie = await this.getById(id);
            return movie !== null;
        } catch (error) {
            throw new Error(`Error al verificar existencia de película: ${error.message}`);
        }
    }

    /**
     * Obtiene el siguiente ID disponible
     * @returns {Promise<number>} Siguiente ID disponible
     */
    static async getNextId() {
        try {
            const movies = await this.getAll();
            if (movies.length === 0) return 1;
            
            const maxId = movies.reduce((max, movie) => Math.max(max, movie.id), 0);
            return maxId + 1;
        } catch (error) {
            throw new Error(`Error al obtener siguiente ID: ${error.message}`);
        }
    }

    /**
     * Obtiene estadísticas básicas de las películas
     * @returns {Promise<Object>} Estadísticas de las películas
     */
    static async getStats() {
        try {
            const movies = await this.getAll();
            
            const stats = {
                total: movies.length,
                genres: {},
                years: {},
                oldest: null,
                newest: null
            };

            if (movies.length === 0) {
                return stats;
            }

            // Calcular estadísticas
            movies.forEach(movie => {
                // Géneros
                stats.genres[movie.genre] = (stats.genres[movie.genre] || 0) + 1;
                
                // Años
                stats.years[movie.year] = (stats.years[movie.year] || 0) + 1;
            });

            // Película más antigua y más nueva
            const sortedByYear = movies.sort((a, b) => a.year - b.year);
            stats.oldest = sortedByYear[0];
            stats.newest = sortedByYear[sortedByYear.length - 1];

            return stats;
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }
}