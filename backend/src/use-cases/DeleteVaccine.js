class DeleteVaccine {
  constructor(vaccineRepository) {
    this.vaccineRepository = vaccineRepository
  }

  async execute(id) {
    if (!id) {
      throw new Error('O id da vacina é obrigatório!')
    }

    return this.vaccineRepository.delete(id)
  }
}

module.exports = { DeleteVaccine }