class GetVaccineById {
  constructor(vaccineRepository) {
    this.vaccineRepository = vaccineRepository
  }

  async execute(id) {
    if (!id) {
      throw new Error('O id da vacina é obrigatório!')
    }

    return this.vaccineRepository.findById(id)
  }
}

module.exports = { GetVaccineById }