import { MoviesModel } from "../models/movies.mjs";
import { addMovie } from "../helpers/addMovie.mjs";
import {
    isDuplicateTitle,
    filterMovies,
    isMoviesArrayEmpty,
    createErrorResponse,
    createSuccessResponse
} from "./movieBusinessLogic.mjs";

export class MoviesService {
    /**
     * Obtiene todas las películas con filtros opcionales
     * @param {Object} filters - Filtros de búsqueda (genre, year, title)
     * @returns {Promise<Object>} Resultado con success, statusCode, data/error
     */
    static async getAll(filters = {}) {
        try {
            const movies = await MoviesModel.getAll();

            if (isMoviesArrayEmpty(movies)) {
                return createErrorResponse(404, "No hay películas disponibles");
            }

            let filteredMovies = movies;
            if (Object.keys(filters).length > 0) {
                filteredMovies = filterMovies(movies, filters);

                if (filteredMovies.length === 0) {
                    return createErrorResponse(404, "No se encontraron películas que coincidan con los filtros proporcionados");
                }
            }

            return createSuccessResponse(200, filteredMovies);

        } catch (error) {
            return createErrorResponse(500, "Error interno del servidor al obtener películas");
        }
    }

    /**
     * Obtiene una película por ID
     * @param {string|number} id - ID de la película (ya validado por controller)
     * @returns {Promise<Object>} Resultado con success, statusCode, data/error
     */
    static async getById(id) {
        try {
            const movie = await MoviesModel.getById(id);

            if (!movie) {
                return createErrorResponse(404, `No se encontró una película con el ID ${id}`);
            }

            return createSuccessResponse(200, movie);

        } catch (error) {
            return createErrorResponse(500, "Error interno del servidor al obtener la película");
        }
    }

    /**
     * Crea una nueva película
     * @param {Object} movieData - Datos de la película (ya validados por middleware)
     * @returns {Promise<Object>} Resultado con success, statusCode, data/error
     */
    static async create(movieData) {
        try {
            const existingMovies = await MoviesModel.getAll();

            // Verificar duplicados
            if (isDuplicateTitle(movieData.title, existingMovies)) {
                return createErrorResponse(409, "Ya existe una película con este título");
            }

            // Generar ID único usando el modelo
            const nextId = await MoviesModel.getNextId();
            const movieWithId = { ...movieData, id: nextId };

            // Crear película usando helper
            const { newMovies, newMovie } = addMovie(existingMovies, movieWithId);

            // Guardar usando el modelo
            const saveResult = await MoviesModel.saveAll(newMovies);
            if (!saveResult.success) {
                return createErrorResponse(500, "Error al guardar la película");
            }

            return createSuccessResponse(201, newMovie);

        } catch (error) {
            return createErrorResponse(500, "Error interno del servidor al crear la película");
        }
    }

    /**
     * Elimina una película por ID
     * @param {string|number} id - ID de la película (ya validado por controller)
     * @returns {Promise<Object>} Resultado con success, statusCode, data/error
     */
    static async deleteMovie(id) {
        try {
            const movies = await MoviesModel.getAll();

            if (isMoviesArrayEmpty(movies)) {
                return createErrorResponse(404, "No hay películas disponibles");
            }

            const movieToDelete = await MoviesModel.getById(id);

            if (!movieToDelete) {
                return createErrorResponse(404, `No se encontró una película con el ID ${id}`);
            }

            // Eliminar película
            const updatedMovies = movies.filter(m => m.id !== parseInt(id));

            // Guardar cambios usando el modelo
            const saveResult = await MoviesModel.saveAll(updatedMovies);
            if (!saveResult.success) {
                return createErrorResponse(500, "Error al eliminar la película");
            }

            return createSuccessResponse(200, {
                message: `La película con el ID: ${id} fue eliminada correctamente.`,
                deletedMovie: movieToDelete
            });

        } catch (error) {
            return createErrorResponse(500, "Error interno del servidor al eliminar la película");
        }
    }

    /**
     * Actualiza una película existente
     * @param {string|number} id - ID de la película (ya validado por controller)
     * @param {Object} updateData - Datos a actualizar (ya validados por middleware)
     * @returns {Promise<Object>} Resultado con success, statusCode, data/error
     */
    static async update(id, updateData) {
        try {
            const movies = await MoviesModel.getAll();

            if (isMoviesArrayEmpty(movies)) {
                return createErrorResponse(404, "No hay películas disponibles");
            }

            const existingMovie = await MoviesModel.getById(id);

            if (!existingMovie) {
                return createErrorResponse(404, `No se encontró una película con el ID ${id}`);
            }

            // Verificar duplicados si se actualiza el título (única validación de negocio)
            if (updateData.title && updateData.title !== existingMovie.title) {
                if (isDuplicateTitle(updateData.title, movies)) {
                    return createErrorResponse(409, "Ya existe una película con este título");
                }
            }

            // Actualizar película 
            const updatedMovie = { ...existingMovie, ...updateData };
            const updatedMovies = movies.map(m => m.id === parseInt(id) ? updatedMovie : m);

            // Guardar cambios usando el modelo
            const saveResult = await MoviesModel.saveAll(updatedMovies);
            if (!saveResult.success) {
                return createErrorResponse(500, "Error al actualizar la película");
            }

            return createSuccessResponse(200, updatedMovie);

        } catch (error) {
            return createErrorResponse(500, "Error interno del servidor al actualizar la película");
        }
    }

}