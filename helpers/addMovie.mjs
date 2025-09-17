export const addMovie = (actualmovies, body) => {
    const newmovieID = actualmovies.length + 1
    const newMovie = {
        id: newmovieID,
        ...body
    }

    // TO-DO: si existe la pelicula (titulo) no agregar la nueva 

    const newmovies = [...actualmovies, newMovie]
    return { newmovies, newMovie }
}