class GetDietById {
  constructor(dietRepository) {
    this.dietRepository = dietRepository
  }

  async execute(id) {
    if (!id) {
      throw new Error('O id da dieta é obrigatório!')
    }
    return this.dietRepository.findById(id)
  }
}

module.exports = { GetDietById }