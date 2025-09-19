import { MoviesController } from "../controllers/movies.mjs"
import { sendJsonResponse } from "../helpers/sendJsonResponse.mjs";
import { parseJsonBody } from "../middlewares/parseJsonBody.mjs";
import { runMiddlewares } from "../middlewares/runMiddlewares.mjs";
import { validateBody } from "../middlewares/validateBody.mjs";
import { validatePartialBody } from "../middlewares/validatePartialBody.mjs";

export function moviesRoutes(req, res) {
    const { method, url } = req
    const idURL = url.startsWith('/movies/') && url.split('/').length === 3 ? url.split('/')[2] : undefined

    switch (method) {
        case 'GET': {
            const baseURL = `http://${req.headers.host}`;
            const parsedUrl = new URL(url, baseURL);

            req.query = Object.fromEntries(parsedUrl.searchParams)

            const pathname = parsedUrl.pathname;

            switch (pathname) {
                case '/':
                    MoviesController.welcome(req, res)
                    break;

                case '/movies':
                    MoviesController.getAll(req, res)
                    break;

                case `/movies/${idURL}`:
                    req.params = { id: idURL }
                    MoviesController.getById(req, res)
                    break;

                default:
                    sendJsonResponse(res, 404, { error: 'Ruta no encontrada' })
                    break;
            }
            break;
        }
        case 'POST': {
            switch (url) {
                case ('/movies'): {
                    const middlewares = [parseJsonBody, validateBody]
                    runMiddlewares(req, res, middlewares, async (error) => {
                        if (error) return sendJsonResponse(res, 500, { error: "Error interno" })

                        MoviesController.create(req, res)
                    })
                    break
                }
                default: {
                    sendJsonResponse(res, 404, { error: 'Ruta no encontrada' })
                    break
                }
            }
            break
        }
        case 'DELETE': {
            switch (url) {
                case `/movies/${idURL}`: {
                    req.params = { id: idURL }
                    MoviesController.delete(req, res)
                    break
                }
                default: {
                    sendJsonResponse(res, 404, { error: 'Ruta no encontrada' })
                    break
                }
            }
            break
        }
        case 'PATCH': {
            if (url === `/movies/${idURL}`) {
                req.params = { id: idURL }
                const middlewares = [parseJsonBody, validatePartialBody]

                runMiddlewares(req, res, middlewares, async (error) => {
                    if (error) return sendJsonResponse(res, 500, { error: "Error interno" })

                    MoviesController.update(req, res)
                })
            } else {
                sendJsonResponse(res, 404, { error: 'Ruta no encontrada' })
                break
            }
            break
        }
        default: {
            // 405 Method Not Allowed para métodos no soportados
            res.statusCode = 405
            res.setHeader('Allow', 'GET, POST, DELETE, PATCH')
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ error: 'Método no permitido' }))
            break
        }
    }
}