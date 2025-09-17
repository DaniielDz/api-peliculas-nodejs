import { addMovie } from "../helpers/addMovie.mjs";
import { filterMovies } from "../helpers/filterMovies.mjs";
import { readJSON } from "../helpers/readJSON.mjs";
import { writeJSON } from "../helpers/writeJSON.mjs";

export class MoviesModel {
    static async getAll(filters = {}) {
        const readResponse = await readJSON();

        // en caso de error al leer el archivo
        if (!readResponse.success) {
            return {
                success: false,
                statusCode: 500,
                error: readResponse.error
            };
        }

        let movies = JSON.parse(readResponse.data);

        // si el archivo no tiene peliculas
        if (movies.length === 0) {
            return {
                success: false,
                statusCode: 404,
                error: { message: "No hay películas disponibles" }
            };
        }

        if (Object.keys(filters).length > 0) {
            movies = filterMovies(filters, movies);
        }

        // si no hay peliculas que coincidan con los filtros
        if (movies.length === 0) {
            return {
                success: false,
                statusCode: 404,
                error: { message: "No se encontraron películas que coincidan con los filtros proporcionados" }
            };
        }

        // si todo fue bien
        return {
            success: true,
            statusCode: 200,
            data: movies
        };
    }

    static async getById({ id }) {
        if (id === '') {
            return {
                success: false,
                statusCode: 400,
                error: { message: "El ID de la película no puede estar vacío" }
            };
        }

        const readResponse = await readJSON();

        // en caso de error al leer el archivo
        if (!readResponse.success) {
            return {
                success: false,
                statusCode: 500,
                error: readResponse.error
            };
        }

        let movies = JSON.parse(readResponse.data);

        // si el archivo no tiene peliculas
        if (movies.length === 0) {
            return {
                success: false,
                statusCode: 404,
                error: { message: "No hay películas disponibles" }
            };
        }

        const movie = movies.find(m => m.id === parseInt(id))

        if (!movie) {
            return {
                success: false,
                statusCode: 404,
                error: { message: `No se encontró una película con el ID ${id}` }
            };
        }

        return {
            success: true,
            statusCode: 200,
            data: movie
        }
    }

    static async create({ input }) {
        const readResponse = await readJSON();

        // en caso de error al leer el archivo
        if (!readResponse.success) {
            return {
                success: false,
                statusCode: 500,
                error: readResponse.error
            };
        }

        let movies = JSON.parse(readResponse.data);

        // si el archivo no tiene peliculas
        if (movies.length === 0) {
            return {
                success: false,
                statusCode: 404,
                error: { message: "No hay películas disponibles" }
            };
        }

        // MODIFICAR contenido json
        const { newmovies, newMovie } = addMovie(movies, input)

        // SOBREESCRIBIR archivo .json
        const { success, message } = await writeJSON(newmovies)
        if (!success) {
            return {
                success: false,
                statusCode: 500,
                error: message
            }
        }

        return {
            success: true,
            statusCode: 201,
            data: newMovie
        }
    }

    static async delete({ id }) {
        if (id === '') {
            return {
                success: false,
                statusCode: 400,
                error: { message: "El ID de la película no puede estar vacío" }
            };
        }

        const readResponse = await readJSON();

        // en caso de error al leer el archivo
        if (!readResponse.success) {
            return {
                success: false,
                statusCode: 500,
                error: readResponse.error
            };
        }

        let movies = JSON.parse(readResponse.data);

        // si el archivo no tiene peliculas
        if (movies.length === 0) {
            return {
                success: false,
                statusCode: 404,
                error: { message: "No hay películas disponibles" }
            };
        }

        const existMovie = movies.find(m => m.id === parseInt(id))
        if (!existMovie) {
            return {
                success: false,
                statusCode: 404,
                error: { message: `No se encontró una pelicula con ID: ${id}` }
            }
        }

        const newMovies = [...movies].filter(m => m.id !== parseInt(id))
        const { success, message: errorMessage } = await writeJSON(newMovies)

        if (!success) {
            return {
                success: false,
                statusCode: 500,
                error: errorMessage
            }
        }

        return {
            success: true,
            statusCode: 200,
            data: {
                message: `La pelicula con el ID: ${id} fue eliminada correctamente.`,
                deletedMovie: existMovie
            }
        }
    }
}