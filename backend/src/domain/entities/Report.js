const { sanitizeText, assertMaxLength, LIMITS } = require('./helpers/analytics-input')
const { resolvePriority } = require('./helpers/report-priority')

const VALID_TYPES = ['abuse', 'spam', 'fraud', 'other']


class Report {
  constructor({ title, description, type, status, reporterId }) {
    title = sanitizeText(title)
    description = sanitizeText(description)

    if (!title) {
      throw new Error('O título do report é obrigatório!')
    }
    if (!description) {
      throw new Error('A descrição do report é obrigatória!')
    }

    assertMaxLength(title, LIMITS.TITLE_MAX, 'título')
    assertMaxLength(description, LIMITS.DESCRIPTION_MAX, 'descrição')

    if (!type || !VALID_TYPES.includes(type)) {
      throw new Error('Tipo de report inválido!')
    }
    if (!reporterId) {
      throw new Error('O autor do report é obrigatório!')
    }
   
    this.title = title
    this.description = description
    this.type = type
    this.status = status || 'open'
    this.priority = resolvePriority(type)
    this.reporterId = reporterId
  }
}

module.exports = { Report, VALID_TYPES }