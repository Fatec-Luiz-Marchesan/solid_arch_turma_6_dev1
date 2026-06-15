const VALID_TYPES = ['abuse', 'spam', 'fraud', 'other']

class ReportValidator {
    static validateCreate(body) {
        if (!body || typeof body !== 'object') {
            return 'Corpo da requisição inválido!'
        }
        const { title, description, type, reporterId } = body

        if (title !== undefined && typeof title !== 'string') {
            return 'O título deve ser um texto!'
        }
        if (description !== undefined && typeof description !== 'string') {
            return 'A descrição deve ser um texto!'
        }
        if (reporterId !== undefined && typeof reporterId !== 'string') {
            return 'O autor deve ser um texto!'
        }
        if (type !== undefined && !VALID_TYPES.includes(type)) {
            return 'Tipo de report inválido!'
        }
        return null
    }
}

module.exports = { ReportValidator, VALID_TYPES }