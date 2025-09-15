export const addFilm = (actualFilms, body) => {
    const newFilmID = actualFilms.length + 1
    const newMovie = {
        id: newFilmID,
        ...body
    }

    // TO-DO: si existe la pelicula (titulo) no agregar la nueva 

    const newFilms = [...actualFilms, newMovie]
    return newFilms
}