class ListVaccines {
  constructor(vaccineRepository) {
    this.vaccineRepository = vaccineRepository
  }

  async execute() {
    return this.vaccineRepository.findAll()
  }
}

module.exports = { ListVaccines }