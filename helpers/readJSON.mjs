import { readFile } from 'node:fs/promises'

export async function readJSON() {
    const url = new URL('../films.json', import.meta.url)
    const readResponse = {
        success: false,
        error: '',
        data: ''
    }

    try {
        const films = await readFile(url, { encoding: 'utf-8' })
        readResponse.success = true
        readResponse.data = films
        return readResponse
    } catch (error) {
        readResponse.error = JSON.stringify({ error: "Error al procesar la solicitud." })
        return readResponse
    }
}