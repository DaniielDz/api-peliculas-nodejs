export function sendJsonResponse(res, status, payload) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(payload)
}