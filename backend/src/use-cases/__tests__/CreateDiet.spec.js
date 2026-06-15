const { CreateDiet } = require('../CreateDiet')

describe('CreateDiet Use Case', () => {
  const makeDietRepository = () => ({
    create: jest.fn().mockImplementation(async (data) => ({
      id: 'diet-id',
      name: data.name,
      pet: data.pet,
      dailyCalories: data.dailyCalories,
      type: data.type,
      mealsPerDay: data.mealsPerDay,
    })),
  })

  const makeSut = () => {
    const dietRepository = makeDietRepository()
    const sut = new CreateDiet(dietRepository)
    return { sut, dietRepository }
  }

  const validInput = {
    name: 'Dieta de emagrecimento',
    pet: 'pet-id',
    dailyCalories: 350,
    type: 'weight-loss',
    mealsPerDay: 3,
  }

  it('deve lançar erro de validação vindo da entidade (calorias inválidas)', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, dailyCalories: -5 }))
      .rejects.toThrow('As calorias diárias devem ser maiores que zero!')
  })

  it('deve persistir a dieta através do repositório', async () => {
    const { sut, dietRepository } = makeSut()
    await sut.execute(validInput)

    expect(dietRepository.create).toHaveBeenCalledWith({
      name: 'Dieta de emagrecimento',
      pet: 'pet-id',
      dailyCalories: 350,
      type: 'weight-loss',
      mealsPerDay: 3,
    })
  })

  it('deve retornar a dieta criada com id', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(validInput)

    expect(result).toHaveProperty('id', 'diet-id')
    expect(result.name).toBe('Dieta de emagrecimento')
  })

  it('deve lançar erro se mealsPerDay não for um número inteiro', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, mealsPerDay: 2.5 }))
      .rejects.toThrow('O número de refeições por dia deve ser um inteiro!')
  })

  it('deve lançar erro se mealsPerDay for menor que 1', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, mealsPerDay: 0 }))
      .rejects.toThrow('O número de refeições por dia deve ser no mínimo 1!')
  })

  it('deve assumir mealsPerDay = 2 por padrão quando não informado', async () => {
    const { sut } = makeSut()
    const result = await sut.execute({ ...validInput, mealsPerDay: undefined })
    expect(result.mealsPerDay).toBe(2)
  })
})