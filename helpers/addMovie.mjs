export const addMovie = (actualmovies, body) => {
    const maxExistingId = Array.isArray(actualmovies) && actualmovies.length > 0
        ? actualmovies.reduce((max, m) => {
            const currentId = Number(m?.id)
            return Number.isFinite(currentId) && currentId > max ? currentId : max
        }, 0)
        : 0

    const nextId = maxExistingId + 1

    const newMovie = {
        id: nextId,
        ...body
    }

    const newMovies = [...actualmovies, newMovie]
    return { newMovies, newMovie }
}