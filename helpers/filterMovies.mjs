export function filterMovies(filters, movies) {
    let filteredMovies = [...movies];

    if (filters.genre) {
        filteredMovies = filteredMovies.filter(m =>
            m.genre.toLowerCase().includes(filters.genre.toLowerCase())
        );
    }

    if (filters.year) {
        const year = parseInt(filters.year);
        if (!isNaN(year)) {
            filteredMovies = filteredMovies.filter(m => m.year === year);
        }
    }

    if (filters.title) {
        filteredMovies = filteredMovies.filter(m =>
            m.title.toLowerCase().includes(filters.title.toLowerCase())
        );
    }

    return filteredMovies;
}