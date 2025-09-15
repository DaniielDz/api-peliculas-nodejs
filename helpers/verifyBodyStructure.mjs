export const verifyBodyStructure = (body) => {
    if (typeof body !== 'object' || body === null) return false
    const propsSchema = {
        title: 'string',
        year: 'number',
        genre: 'string'
    }
    const requiredProps = Object.keys(propsSchema)
    const bodyProps = Object.keys(body)

    if (bodyProps.length !== requiredProps.length) return false

    for (const prop of requiredProps) {
        if (!body.hasOwnProperty(prop) || typeof body[prop] !== propsSchema[prop]) {
            return false
        }
    }

    return true
}