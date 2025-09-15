import { createServer } from "node:http";
import { handleFilmsRequest } from "./helpers/handleFilmsRequest.mjs";
import { sendJsonResponse } from "./helpers/sendJsonResponse.mjs";
import { readJSON } from "./helpers/readJSON.mjs";
import { writeJSON } from "./helpers/writeJSON.mjs";
import { verifyBodyStructure } from "./helpers/verifyBodyStructure.mjs";
import { addFilm } from "./helpers/addFilm.mjs";

const server = createServer((req, res) => {
    const { method, url } = req
    const idURL = url.startsWith('/films/') && url.split('/').length === 3 ? url.split('/')[2] : undefined

    switch (method) {
        case 'GET': {
            switch (url) {
                case '/':
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/html; charset=utf-8')
                    res.end('<h1>Bienvenido a la Mini API de Películas</h1>')
                    break;

                case '/films':
                    handleFilmsRequest(res)
                    break;

                case `/films/${idURL}`:
                    handleFilmsRequest(res, idURL)
                    break;

                default:
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'text/html; charset=utf-8')
                    res.end(`
                        <div style="text-align:center; width:max-content; margin: 20px auto 0">
                            <h1 style="color:red; font-size: 36px">404</h1>
                            <p style="font-size: 18px">Página <em>${url}</em> no encontrada</p>
                        </div>`)
                    break;
            }
            break;
        }
        case 'POST': {
            switch (url) {
                case ('/films'): {
                    let body = ''

                    req.on('data', (chunk) => body += chunk.toString())

                    req.on('end', async () => {
                        let parsedBody
                        try {
                            parsedBody = JSON.parse(body);
                        } catch (e) {
                            sendJsonResponse(res, 400, { "error": "El cuerpo de la solicitud tiene un formato JSON inválido." });
                            return;
                        }
                        // Verificar que el body este en la estructura correcta
                        const isBodyCorrect = verifyBodyStructure(parsedBody)
                        if (!isBodyCorrect) {
                            sendJsonResponse(res, 400, JSON.stringify({ "error": "El cuerpo de la solicitud tiene un formato JSON inválido." }))
                            return
                        }

                        // OBTENER contenido json
                        const filmsJSON = await readJSON()
                        if (!filmsJSON.success) {
                            sendJsonResponse(res, 500, filmsJSON.error)
                            return
                        }

                        // MODIFICAR contenido json
                        const actualFilms = JSON.parse(filmsJSON.data)
                        const newFilms = addFilm(actualFilms, parsedBody)

                        // SOBREESCRIBIR archivo .json
                        const { success, message } = await writeJSON(newFilms)
                        if (!success) {
                            sendJsonResponse(res, 500, message)
                            return
                        }

                        sendJsonResponse(res, 201, message)
                    })
                }
            }
        }
    }
})

server.listen(3003, () => {
    console.log("Servidor funcionando en http://localhost:3003")
})