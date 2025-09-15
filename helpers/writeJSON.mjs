import { writeFile } from "node:fs/promises";

export const writeJSON = async (actualJSON) => {
    try {
        const url = new URL('../films.json', import.meta.url)
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