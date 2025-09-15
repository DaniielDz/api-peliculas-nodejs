export async function findFilm(films, filmID) {
    const filmsJSON = JSON.parse(films)
    const film = filmsJSON.find((film) => film.id.toString() === filmID)
    const response = {
        success: false,
        error: '',
        data: ''
    }

    if (!film) {
        response.error = JSON.stringify({ error: "No se encontró la película solicitada." })
        return response
    }

    response.success = true
    response.data = JSON.stringify(film)
    return response
}