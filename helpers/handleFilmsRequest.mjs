import { findFilm } from "./findFilm.mjs"
import { readJSON } from "./readJSON.mjs"
import { sendJsonResponse } from "./sendJsonResponse.mjs"

export async function handleFilmsRequest(res, filmID) {
    const readJsonRes = await readJSON()
    if (!readJsonRes.success) {
        sendJsonResponse(res, 500, readJsonRes.error)
        return
    }

    const { data: films } = readJsonRes

    if (filmID) {
        const findFilmRes = await findFilm(films, filmID)
        if (!findFilmRes.success) {
            sendJsonResponse(res, 404, findFilmRes.error)
        } else {
            sendJsonResponse(res, 200, findFilmRes.data)
        }
    } else {
        sendJsonResponse(res, 200, films)
    }
}