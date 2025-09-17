/**
 * Ejecuta una cadena de middlewares al estilo Express y, al finalizar,
 * invoca un manejador final. Cada middleware recibe `(req, res, next)`.
 *
 * Flujo:
 * - Llama secuencialmente a cada middleware de `middlewares`.
 * - Si un middleware invoca `next(err)` o lanza una excepción, se interrumpe
 *   la cadena y se delega el control en `finalHandler(err)`.
 * - Cuando no quedan middlewares por ejecutar, se invoca `finalHandler()` sin argumentos.
 *
 * @typedef {(req: any, res: any, next: (err?: unknown) => void) => void} Middleware
 * @typedef {(err?: unknown) => void} FinalHandler
 *
 * @param {any} req - Objeto de solicitud (por ejemplo, `IncomingMessage`).
 * @param {any} res - Objeto de respuesta (por ejemplo, `ServerResponse`).
 * @param {Middleware[]} middlewares - Lista ordenada de middlewares a ejecutar.
 * @param {FinalHandler} finalHandler - Función llamada al terminar o ante un error.
 * @returns {void}
 *
 * @example
 * runMiddlewares(req, res, [
 *   parseJsonBody,
 *   validateBody,
 * ], (err) => {
 *   if (err) return sendError(res, err)
 *   controller(req, res)
 * })
 */

export function runMiddlewares(req, res, middlewares, finalHandler) {
    let index = 0

    const next = (error) => {
        if (error) return finalHandler(error)

        const middleware = middlewares[index++]
        if (!middleware) return finalHandler();

        try {
            middleware(req, res, next)
        } catch (error) {
            next(error)
        }
    }

    next()
}
