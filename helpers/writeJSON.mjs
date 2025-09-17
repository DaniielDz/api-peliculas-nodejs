import { writeFile } from "node:fs/promises";

const JSON_PATH = '../data/movies.json'

export const writeJSON = async (actualJSON) => {
    try {
        const url = new URL(JSON_PATH, import.meta.url)
        await writeFile(url, JSON.stringify(actualJSON, null, 2))
        return {
            success: true,
            message: "Se actualizaron las peliculas"
        }
    } catch (error) {
        return {
            success: false,
            message: "Error al actualizar las peliculas"
        }
    }
}