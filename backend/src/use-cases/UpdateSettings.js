const { sanitizeInput } = require('./helpers/SecurityInput')

const VALID_THEMES = ['light', 'dark']
const VALID_LANGUAGES = ['pt-BR', 'en-US', 'es']

class UpdateSettings {
  constructor(settingsRepository) {
    this.settingsRepository = settingsRepository
  }

  async execute(id, data) {
    const updateData = {}

    if (data.theme !== undefined) {
      const theme = sanitizeInput(data.theme)
      if (!VALID_THEMES.includes(theme)) {
        throw new Error('Tema inválido!')
      }
      updateData.theme = theme
    }

    if (data.language !== undefined) {
      const language = sanitizeInput(data.language)
      if (!VALID_LANGUAGES.includes(language)) {
        throw new Error('Idioma inválido!')
      }
      updateData.language = language
    }

    if (data.notificationsEnabled !== undefined) {
      if (typeof data.notificationsEnabled !== 'boolean') {
        throw new Error('O campo de notificações deve ser booleano!')
      }
      updateData.notificationsEnabled = data.notificationsEnabled
    }

    return this.settingsRepository.update(id, updateData)
  }
}

module.exports = { UpdateSettings }