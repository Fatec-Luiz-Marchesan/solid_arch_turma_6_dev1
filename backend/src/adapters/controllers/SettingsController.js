class SettingsController {
  constructor(createSettings, listSettings, getSettingsById, updateSettings, deleteSettings) {
    this.createSettings = createSettings
    this.listSettings = listSettings
    this.getSettingsById = getSettingsById
    this.updateSettings = updateSettings
    this.deleteSettings = deleteSettings
  }

  async create(req, res) {
    try {
      const settings = await this.createSettings.execute(req.body)
      return res.status(201).json(settings)
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  }

  async findAll(req, res) {
    try {
      const settings = await this.listSettings.execute()
      return res.status(200).json(settings)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async findById(req, res) {
    try {
      const settings = await this.getSettingsById.execute(req.params.id)

      if (!settings) {
        return res.status(404).json({ message: 'Configurações não encontradas!' })
      }

      return res.status(200).json(settings)
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  }

  async update(req, res) {
    try {
      const settings = await this.updateSettings.execute(req.params.id, req.body)

      if (!settings) {
        return res.status(404).json({ message: 'Configurações não encontradas!' })
      }

      return res.status(200).json(settings)
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  }

  async delete(req, res) {
    try {
      const settings = await this.deleteSettings.execute(req.params.id)

      if (!settings) {
        return res.status(404).json({ message: 'Configurações não encontradas!' })
      }

      return res.status(200).json({ message: 'Configurações removidas com sucesso!' })
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  }
}

module.exports = { SettingsController }