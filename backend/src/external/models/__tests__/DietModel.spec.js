const DietModel = require('../DietModel')

describe('DietModel (schema Mongoose)', () => {
  const makeValidData = (overrides = {}) => ({
    name: 'Dieta do Rex',
    pet: 'pet-1',
    dailyCalories: 500,
    ...overrides,
  })

  it('deve persistir uma dieta válida com os defaults', async () => {
    const doc = await DietModel.create(makeValidData())
    expect(doc._id).toBeDefined()
    expect(doc.type).toBe('maintenance')
    expect(doc.mealsPerDay).toBe(2)
  })

  it('deve aceitar um valor positivo de dailyCalories', async () => {
    const doc = await DietModel.create(makeValidData({ dailyCalories: 1200 }))
    expect(doc.dailyCalories).toBe(1200)
  })

  it('deve rejeitar dailyCalories igual a zero (validação de mínimo)', async () => {
    await expect(
      DietModel.create(makeValidData({ dailyCalories: 0 }))
    ).rejects.toThrow()
  })

  it('deve rejeitar dailyCalories negativo (validação de mínimo)', async () => {
    await expect(
      DietModel.create(makeValidData({ dailyCalories: -100 }))
    ).rejects.toThrow()
  })

  it('deve rejeitar mealsPerDay menor que 1', async () => {
    await expect(
      DietModel.create(makeValidData({ mealsPerDay: 0 }))
    ).rejects.toThrow()
  })
})