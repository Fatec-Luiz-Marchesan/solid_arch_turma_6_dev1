const { Diet } = require('../domain/entities/Diet')

class UpdateDiet {
  constructor(dietRepository) {
    this.dietRepository = dietRepository
  }

  async execute(id, { name, pet, dailyCalories, type, mealsPerDay }) {
    if (!id) {
      throw new Error('O id da dieta é obrigatório!')
    }

    const diet = new Diet({ name, pet, dailyCalories, type, mealsPerDay })

    return this.dietRepository.update(id, {
      name: diet.name,
      pet: diet.pet,
      dailyCalories: diet.dailyCalories,
      type: diet.type,
      mealsPerDay: diet.mealsPerDay,
    })
  }
}

module.exports = { UpdateDiet }