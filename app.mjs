import { createServer } from "node:http";
import { moviesRoutes } from "./routes/movies.mjs";

const server = createServer((req, res) => {
    moviesRoutes(req, res)
})

server.listen(3003, () => {
    console.log("Servidor funcionando en http://localhost:3003")
})