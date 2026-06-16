class ListSettings {
  constructor(settingsRepository) {
    this.settingsRepository = settingsRepository
  }

  async execute() {
    return this.settingsRepository.findAll()
  }
}

module.exports = { ListSettings }