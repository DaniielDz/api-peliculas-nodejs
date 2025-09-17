import { sendJsonResponse } from "../helpers/sendJsonResponse.mjs"
import { MoviesModel } from "../models/movies.mjs"

export class MoviesController {
    static async welcome(req, res) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end('<h1>Bienvenido a la Mini API de Películas</h1>')
    }

    static async getAll(req, res) {
        const filters = req.query
        const { success, statusCode, data, error } = await MoviesModel.getAll(filters)

        if (!success) {
            sendJsonResponse(res, statusCode, error)
            return
        }

        sendJsonResponse(res, statusCode, data)
    }

    static async getById(req, res) {
        const { id } = req.params;

        // Validar que el ID sea numérico
        if (!/^\d+$/.test(id)) {
            return sendJsonResponse(res, 400, {
                error: "El ID debe ser un número válido"
            });
        }

        const { success, statusCode, data, error } = await MoviesModel.getById({ id });

        if (!success) {
            sendJsonResponse(res, statusCode, error);
            return;
        }

        sendJsonResponse(res, statusCode, data);
    }

    static async create(req, res) {
        const { success, statusCode, data, error } = await MoviesModel.create({ input: req.body })

        if (!success) {
            sendJsonResponse(res, statusCode, error)
            return
        }

        sendJsonResponse(res, statusCode, data)
    }

    static async delete(req, res) {
        const { id } = req.params

        // Validar que el ID sea numérico
        if (!/^\d+$/.test(id)) {
            return sendJsonResponse(res, 400, {
                error: "El ID debe ser un número válido"
            });
        }

        const { success, statusCode, data, error } = await MoviesModel.delete({ id });

        if (!success) {
            sendJsonResponse(res, statusCode, error);
            return;
        }

        sendJsonResponse(res, statusCode, data);
    }
}