const { Diet } = require('../domain/entities/Diet')

class CreateDiet {
  constructor(dietRepository) {
    this.dietRepository = dietRepository
  }

  async execute({ name, pet, dailyCalories, type, mealsPerDay }) {
    const diet = new Diet({ name, pet, dailyCalories, type, mealsPerDay })

    const created = await this.dietRepository.create({
      name: diet.name,
      pet: diet.pet,
      dailyCalories: diet.dailyCalories,
      type: diet.type,
      mealsPerDay: diet.mealsPerDay,
    })

    return created
  }
}

module.exports = { CreateDiet }