class VaccineController {
  constructor(createVaccine, listVaccines, getVaccineById, updateVaccine, deleteVaccine) {
    this.createVaccine = createVaccine
    this.listVaccines = listVaccines
    this.getVaccineById = getVaccineById
    this.updateVaccine = updateVaccine
    this.deleteVaccine = deleteVaccine
  }

  async create(req, res) {
    try {
      const vaccine = await this.createVaccine.execute(req.body)
      return res.status(201).json(vaccine)
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  }

  async findAll(req, res) {
    try {
      const vaccines = await this.listVaccines.execute()
      return res.status(200).json(vaccines)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  async findById(req, res) {
    try {
      const vaccine = await this.getVaccineById.execute(req.params.id)

      if (!vaccine) {
        return res.status(404).json({ message: 'Vacina não encontrada!' })
      }

      return res.status(200).json(vaccine)
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  }

  async update(req, res) {
    try {
      const vaccine = await this.updateVaccine.execute(req.params.id, req.body)

      if (!vaccine) {
        return res.status(404).json({ message: 'Vacina não encontrada!' })
      }

      return res.status(200).json(vaccine)
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  }

  async delete(req, res) {
    try {
      const vaccine = await this.deleteVaccine.execute(req.params.id)

      if (!vaccine) {
        return res.status(404).json({ message: 'Vacina não encontrada!' })
      }

      return res.status(200).json({ message: 'Vacina removida com sucesso!' })
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  }
}

module.exports = { VaccineController }