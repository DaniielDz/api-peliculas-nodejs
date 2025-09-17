export function filterMovies(filters, movies) {
    const { genre, year } = filters
    let filteredMovies

    if(genre) {
        filteredMovies = movies.filter(m => m.genre.toLowerCase() === genre.toLowerCase())
    }

    if(year) {
        filteredMovies = movies.filter(m => m.year === parseInt(year))
    }

    return filteredMovies
}