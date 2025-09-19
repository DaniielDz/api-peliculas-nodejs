import { sendJsonResponse } from "../helpers/sendJsonResponse.mjs"
import { MoviesService } from "../services/movies.mjs"

/**
 * Controlador para manejar las peticiones HTTP de películas
 * Solo coordina entre la capa HTTP y los servicios de negocio
 */
export class MoviesController {
    /**
     * Página de bienvenida
     */
    static async welcome(req, res) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(`
            <div style="text-align: center; font-family: Arial, sans-serif; padding: 50px;">
                <h1 style="color: #333;">🎬 Bienvenido a la Mini API de Películas</h1>
                <p style="font-size: 18px; color: #666;">API REST construida con Node.js puro</p>
                <div style="margin-top: 30px;">
                    <h3>Endpoints disponibles:</h3>
                    <ul style="text-align: left; display: inline-block; color: #555;">
                        <li><strong>GET</strong> /movies - Listar todas las películas</li>
                        <li><strong>GET</strong> /movies/:id - Obtener película por ID</li>
                        <li><strong>POST</strong> /movies - Crear nueva película</li>
                        <li><strong>PATCH</strong> /movies/:id - Actualizar película</li>
                        <li><strong>DELETE</strong> /movies/:id - Eliminar película</li>
                    </ul>
                </div>
            </div>
        `)
    }

    /**
     * Obtiene todas las películas con filtros opcionales
     */
    static async getAll(req, res) {
        try {
            const filters = req.query
            const result = await MoviesService.getAll(filters)
            
            sendJsonResponse(res, result.statusCode, result.success ? result.data : result.error)
        } catch (error) {
            console.log(error)
            sendJsonResponse(res, 500, { 
                error: error.message || "Error interno del servidor al obtener las películas"
            })
        }
    }

    /**
     * Obtiene una película por ID
     */
    static async getById(req, res) {
        try {
            const { id } = req.params
            const result = await MoviesService.getById(id)
            
            sendJsonResponse(res, result.statusCode, result.success ? result.data : result.error)
        } catch (error) {
            sendJsonResponse(res, 500, { 
                error: "Error interno del servidor al obtener la película" 
            })
        }
    }

    /**
     * Crea una nueva película
     */
    static async create(req, res) {
        try {
            const movieData = req.body
            const result = await MoviesService.create(movieData)
            
            sendJsonResponse(res, result.statusCode, result.success ? result.data : result.error)
        } catch (error) {
            sendJsonResponse(res, 500, { 
                error: "Error interno del servidor al crear la película" 
            })
        }
    }

    /**
     * Elimina una película por ID
     */
    static async delete(req, res) {
        try {
            const { id } = req.params
            const result = await MoviesService.deleteMovie(id)
            
            sendJsonResponse(res, result.statusCode, result.success ? result.data : result.error)
        } catch (error) {
            sendJsonResponse(res, 500, { 
                error: "Error interno del servidor al eliminar la película" 
            })
        }
    }

    /**
     * Actualiza una película existente
     */
    static async update(req, res) {
        try {
            const { id } = req.params
            const updateData = req.body
            const result = await MoviesService.update(id, updateData)
            
            sendJsonResponse(res, result.statusCode, result.success ? result.data : result.error)
        } catch (error) {
            sendJsonResponse(res, 500, { 
                error: "Error interno del servidor al actualizar la película" 
            })
        }
    }
}