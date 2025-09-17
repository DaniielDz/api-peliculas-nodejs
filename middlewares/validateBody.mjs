import { sendJsonResponse } from "../helpers/sendJsonResponse.mjs"
import { verifyBodyStructure } from "../helpers/verifyBodyStructure.mjs"

export function validateBody(req, res, next) {
    const isBodyCorrect = verifyBodyStructure(req.body)

    if (!isBodyCorrect) {
        return sendJsonResponse(res, 400, { error: "El cuerpo de la solicitud tiene un formato JSON inválido." })
    }

    next()
}