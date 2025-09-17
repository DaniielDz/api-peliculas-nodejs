import { readFile } from 'node:fs/promises'

const JSON_PATH = '../data/movies.json'

export async function readJSON() {
    const url = new URL(JSON_PATH, import.meta.url)
    const readResponse = {
        success: false,
        error: '',
        data: ''
    }

    try {
        const movies = await readFile(url, { encoding: 'utf-8' })
        readResponse.success = true
        readResponse.data = movies
        return readResponse
    } catch (error) {
        readResponse.error = { message: "No se pudo procesar la solicitud, error de servidor" }
        return readResponse
    }
}