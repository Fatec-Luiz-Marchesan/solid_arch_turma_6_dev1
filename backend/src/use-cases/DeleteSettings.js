class DeleteSettings {
  constructor(settingsRepository) {
    this.settingsRepository = settingsRepository
  }

  async execute(id) {
    return this.settingsRepository.delete(id)
  }
}

module.exports = { DeleteSettings }