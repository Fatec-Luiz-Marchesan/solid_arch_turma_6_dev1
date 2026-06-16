class GetSettingsById {
  constructor(settingsRepository) {
    this.settingsRepository = settingsRepository
  }

  async execute(id) {
    return this.settingsRepository.findById(id)
  }
}

module.exports = { GetSettingsById }