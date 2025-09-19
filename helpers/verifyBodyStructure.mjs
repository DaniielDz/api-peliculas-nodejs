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
            } else if (typeof value !== expectedType) {
                return false
            }
        }
    }

    return true
}