const { Settings } = require('../domain/entities/Settings')
const { sanitizeInput } = require('./helpers/SecurityInput')

class CreateSettings {
  constructor(settingsRepository) {
    this.settingsRepository = settingsRepository
  }

  async execute(data) {
    const sanitizedData = {
      userId: sanitizeInput(data.userId),
      theme: sanitizeInput(data.theme),
      language: sanitizeInput(data.language),
      notificationsEnabled: data.notificationsEnabled,
    }

    const settings = new Settings(sanitizedData)

    return this.settingsRepository.create({
      userId: settings.userId,
      theme: settings.theme,
      language: settings.language,
      notificationsEnabled: settings.notificationsEnabled,
    })
  }
}

module.exports = { CreateSettings }