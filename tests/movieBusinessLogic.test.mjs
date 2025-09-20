import { createErrorResponse, createSuccessResponse, filterMovies, isDuplicateTitle, isMoviesArrayEmpty } from "../services/movieBusinessLogic.mjs"

const mockMovies = [
    { id: 1, title: 'The Shawshank Redemption', year: 1994, genre: 'Drama' },
    { id: 2, title: 'Inception', year: 2010, genre: 'Action' },
    { id: 3, title: 'The Dark Knight', year: 2008, genre: 'Action' },
    { id: 4, title: 'Pulp Fiction', year: 1994, genre: 'Crime' }
]

describe('isDuplicateTitle', () => {
    test('debe detectar titulos duplicados (case sensitive)', () => {
        expect(isDuplicateTitle('Inception', mockMovies)).toBe(true)
        expect(isDuplicateTitle('inception', mockMovies)).toBe(true)
        expect(isDuplicateTitle('INCEPTION', mockMovies)).toBe(true)
    })

    test('debe retornar false para titulos unicos', () => {
        expect(isDuplicateTitle('Avatar', mockMovies)).toBe(false)
    })

    test('debe manejar arrays vacios', () => {
        expect(isDuplicateTitle('Titanic', [])).toBe(false)
    })
})

describe('filterMovies', () => {
    test('debe filtrar por genero', () => {
        const result = filterMovies(mockMovies, { genre: 'Action' })
        expect(result).toHaveLength(2)
        expect(result.every(m => m.genre === 'Action')).toBe(true)
    })

    test('debe filtrar por año', () => {
        const result = filterMovies(mockMovies, { year: 1994 })
        expect(result).toHaveLength(2)
        expect(result.every(m => m.year === 1994)).toBe(true)
    })

    test('debe filtrar por titulo', () => {
        const result = filterMovies(mockMovies, { title: 'Inception' })
        expect(result).toHaveLength(1)
        expect(result[0].title === 'Inception').toBe(true)
    })

    test('debe aceptar multiples filtros', () => {
        const result = filterMovies(mockMovies, { title: 'The Shawshank Redemption', year: 1994, genre: 'Drama' })
        expect(result).toHaveLength(1)
        expect(result[0].title === 'The Shawshank Redemption').toBe(true)
    })

    test('debe retornar todas las peliculas si no hay filtros', () => {
        const result = filterMovies(mockMovies, {})
        expect(result).toHaveLength(4)
    });

    test('debe retornar un array vacio si no coinciden los filtros', () => {
        const result = filterMovies(mockMovies, { genre: "Horror" })
        expect(result).toHaveLength(0)
    });
})

describe('isMoviesArrayEmpty', () => {
    test('debe detectar arrays vacios', () => {
        expect(isMoviesArrayEmpty([])).toBe(true)
        expect(isMoviesArrayEmpty(null)).toBe(true)
        expect(isMoviesArrayEmpty(undefined)).toBe(true)
    });

    test('debe detectar arrays con contenido', () => {
        expect(isMoviesArrayEmpty(mockMovies)).toBe(false)
    });
})

describe('createErrorResponse', () => {
    test('debe crear respuesta de error correctamente', () => {
        const response = createErrorResponse(404, 'Pelicula no encontrada')
        const expectedRes = {
            success: false,
            statusCode: 404,
            error: { message: 'Pelicula no encontrada' }
        }
        expect(response).toEqual(expectedRes)
    });
})

describe('createSuccessResponse', () => {
    test('debe crear la respuesta de exito correctamente', () => {
        const data = { id: 1, title: 'Inception', year: 2010, genre: 'Action' }
        const response = createSuccessResponse(200, data)
        const expectedRes = {
            success: true,
            statusCode: 200,
            data
        }
        expect(response).toEqual(expectedRes)
    })
})