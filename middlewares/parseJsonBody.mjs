import { sendJsonResponse } from "../helpers/sendJsonResponse.mjs"

export function parseJsonBody(req, res, next) {
    const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH'])
    const methodHasBody = METHODS_WITH_BODY.has(req.method)

    if (!methodHasBody) return next()

    let data = ''

    req.on('error', (err) => {
        return sendJsonResponse(res, 400, { error: "Error al leer el cuerpo de la solicitud." })
    })

    req.on('data', (chunk) => data += chunk.toString())

    req.on('end', () => {
        if (data === '') {
            req.body = {}
            return next()
        }

        try {
            req.body = JSON.parse(data);
            next()
        } catch (e) {
            return sendJsonResponse(res, 400, { error: "El cuerpo de la solicitud tiene un formato JSON inválido." });
        }
    })
}