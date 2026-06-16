class DeleteDiet {
  constructor(dietRepository) {
    this.dietRepository = dietRepository
  }

  async execute(id) {
    if (!id) {
      throw new Error('O id da dieta é obrigatório!')
    }
    return this.dietRepository.delete(id)
  }
}

module.exports = { DeleteDiet }