import { MoviesController } from "../controllers/movies.mjs"

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
                case ('/movies'):
                    MoviesController.create(req, res)
                    break
            }
        }
    }
}