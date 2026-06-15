const VALID_TYPES = ['weight-loss', 'maintenance', 'weight-gain', 'medical']

class Diet {
  constructor({ name, pet, dailyCalories, type, mealsPerDay }) {
    if (!name) {
      throw new Error('O nome da dieta é obrigatório!')
    }
    if (!pet) {
      throw new Error('O pet é obrigatório!')
    }
    if (typeof dailyCalories !== 'number' || Number.isNaN(dailyCalories)) {
      throw new Error('As calorias diárias devem ser um número!')
    }
    if (dailyCalories <= 0) {
      throw new Error('As calorias diárias devem ser maiores que zero!')
    }
    if (type && !VALID_TYPES.includes(type)) {
      throw new Error('Tipo de dieta inválido!')
    }

    const finalMeals = mealsPerDay === undefined ? 2 : mealsPerDay
    if (!Number.isInteger(finalMeals)) {
      throw new Error('O número de refeições por dia deve ser um inteiro!')
    }
    if (finalMeals < 1) {
      throw new Error('O número de refeições por dia deve ser no mínimo 1!')
    }

    this.name = name
    this.pet = pet
    this.dailyCalories = dailyCalories
    this.type = type || 'maintenance'
    this.mealsPerDay = finalMeals
  }
}

module.exports = { Diet }