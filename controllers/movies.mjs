import { sendJsonResponse } from "../helpers/sendJsonResponse.mjs"
import { verifyBodyStructure } from "../helpers/verifyBodyStructure.mjs"
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
        const { id } = req.params
        const { success, statusCode, data, error } = await MoviesModel.getById({ id })

        if (!success) {
            sendJsonResponse(res, statusCode, error)
            return
        }

        sendJsonResponse(res, statusCode, data)
    }

    static async create(req, res) {
        let body = ''

        req.on('data', (chunk) => body += chunk.toString())

        req.on('end', async () => {
            let parsedBody
            try {
                parsedBody = JSON.parse(body);
            } catch (e) {
                sendJsonResponse(res, 400, { error: "El cuerpo de la solicitud tiene un formato JSON inválido." });
                return;
            }
            // Verificar que el body este en la estructura correcta
            const isBodyCorrect = verifyBodyStructure(parsedBody)
            if (!isBodyCorrect) {
                sendJsonResponse(res, 400, { error: "El cuerpo de la solicitud tiene un formato JSON inválido." })
                return
            }

            const { success, statusCode, data, error } = await MoviesModel.create({ input: parsedBody })

            if (!success) {
                sendJsonResponse(res, statusCode, error)
                return
            }

            sendJsonResponse(res, statusCode, data)
        })
    }
}