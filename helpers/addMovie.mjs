export const addMovie = (actualmovies, body) => {
    const newmovieID = actualmovies.length + 1
    const newMovie = {
        id: newmovieID,
        ...body
    }

    const newMovies = [...actualmovies, newMovie]
    return { newMovies, newMovie }
}