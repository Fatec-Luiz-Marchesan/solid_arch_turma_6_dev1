const { ListDiets } = require('../ListDiets')
const { GetDietById } = require('../GetDietById')
const { UpdateDiet } = require('../UpdateDiet')
const { DeleteDiet } = require('../DeleteDiet')

const makeRepository = () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
})

const validDietData = {
  name: 'Dieta do Rex',
  pet: 'pet-1',
  dailyCalories: 500,
  type: 'maintenance',
  mealsPerDay: 2,
}

describe('ListDiets Use Case', () => {
  it('deve retornar todas as dietas do repositório', async () => {
    const repository = makeRepository()
    repository.findAll.mockResolvedValue([{ id: 'd1' }, { id: 'd2' }])
    const sut = new ListDiets(repository)

    const result = await sut.execute()

    expect(repository.findAll).toHaveBeenCalledTimes(1)
    expect(result).toHaveLength(2)
  })

  it('deve retornar lista vazia quando não há dietas', async () => {
    const repository = makeRepository()
    repository.findAll.mockResolvedValue([])
    const sut = new ListDiets(repository)

    const result = await sut.execute()
    expect(result).toEqual([])
  })
})

describe('GetDietById Use Case', () => {
  it('deve retornar a dieta correspondente ao id', async () => {
    const repository = makeRepository()
    repository.findById.mockResolvedValue({ id: 'd1', name: 'Dieta do Rex' })
    const sut = new GetDietById(repository)

    const result = await sut.execute('d1')

    expect(repository.findById).toHaveBeenCalledWith('d1')
    expect(result.name).toBe('Dieta do Rex')
  })

  it('deve retornar null quando a dieta não existe', async () => {
    const repository = makeRepository()
    repository.findById.mockResolvedValue(null)
    const sut = new GetDietById(repository)

    const result = await sut.execute('inexistente')
    expect(result).toBeNull()
  })

  it('deve lançar erro se o id não for informado', async () => {
    const repository = makeRepository()
    const sut = new GetDietById(repository)

    await expect(sut.execute()).rejects.toThrow('O id da dieta é obrigatório!')
  })
})

describe('UpdateDiet Use Case', () => {
  it('deve revalidar as regras e atualizar a dieta', async () => {
    const repository = makeRepository()
    repository.update.mockResolvedValue({ id: 'd1', ...validDietData })
    const sut = new UpdateDiet(repository)

    const result = await sut.execute('d1', validDietData)

    expect(repository.update).toHaveBeenCalledWith('d1', expect.objectContaining({
      name: 'Dieta do Rex',
      dailyCalories: 500,
    }))
    expect(result.id).toBe('d1')
  })

  it('deve lançar erro se o id não for informado', async () => {
    const repository = makeRepository()
    const sut = new UpdateDiet(repository)

    await expect(sut.execute(undefined, validDietData))
      .rejects.toThrow('O id da dieta é obrigatório!')
  })

  it('deve lançar erro se os dados violarem as regras de domínio', async () => {
    const repository = makeRepository()
    const sut = new UpdateDiet(repository)

    await expect(sut.execute('d1', { ...validDietData, dailyCalories: -10 }))
      .rejects.toThrow()
    expect(repository.update).not.toHaveBeenCalled()
  })

  it('deve retornar null quando a dieta a atualizar não existe', async () => {
    const repository = makeRepository()
    repository.update.mockResolvedValue(null)
    const sut = new UpdateDiet(repository)

    const result = await sut.execute('inexistente', validDietData)
    expect(result).toBeNull()
  })
})

describe('DeleteDiet Use Case', () => {
  it('deve remover a dieta correspondente ao id', async () => {
    const repository = makeRepository()
    repository.delete.mockResolvedValue({ id: 'd1' })
    const sut = new DeleteDiet(repository)

    const result = await sut.execute('d1')

    expect(repository.delete).toHaveBeenCalledWith('d1')
    expect(result.id).toBe('d1')
  })

  it('deve retornar null quando a dieta a remover não existe', async () => {
    const repository = makeRepository()
    repository.delete.mockResolvedValue(null)
    const sut = new DeleteDiet(repository)

    const result = await sut.execute('inexistente')
    expect(result).toBeNull()
  })

  it('deve lançar erro se o id não for informado', async () => {
    const repository = makeRepository()
    const sut = new DeleteDiet(repository)

    await expect(sut.execute()).rejects.toThrow('O id da dieta é obrigatório!')
  })
})