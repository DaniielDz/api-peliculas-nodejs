export const verifyBodyStructure = (body, isPartial = false) => {
    if (typeof body !== 'object' || body === null) return false

    const propsSchema = {
        title: 'string',
        year: 'number',
        genre: 'string'
    }

    const schemaKeys = Object.keys(propsSchema)
    const bodyKeys = Object.keys(body)

    // si hay propiedades que no existen en el schema → invalido
    const hasExtraProps = bodyKeys.some(key => !schemaKeys.includes(key))
    if (hasExtraProps) return false

    for (const prop of schemaKeys) {
        const expectedType = propsSchema[prop]
        const value = body[prop]

        // si no es parcial y falta una propiedad requerida → invalido
        if (!isPartial && !(prop in body)) return false

        // si existe, validar tipo
        if (value !== undefined) {
            if (expectedType === 'number') {
                if (typeof value !== 'number' || !Number.isFinite(value)) return false
                // Validación adicional para year
                if (prop === 'year') {
                    const currentYear = new Date().getFullYear()
                    const minYear = 1888 // año de la primera película
                    if (value < minYear || value > currentYear + 1) return false
                }
            } else if (typeof value !== expectedType) {
                return false
            } else {
                // Validación adicional para title: non-empty tras trim
                if (prop === 'title') {
                    if (typeof value !== 'string' || value.trim().length === 0) return false
                }
            }
        }
    }

    return true
}