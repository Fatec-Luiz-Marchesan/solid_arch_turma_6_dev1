class ListDiets {
  constructor(dietRepository) {
    this.dietRepository = dietRepository
  }

  async execute() {
    return this.dietRepository.findAll()
  }
}

module.exports = { ListDiets }