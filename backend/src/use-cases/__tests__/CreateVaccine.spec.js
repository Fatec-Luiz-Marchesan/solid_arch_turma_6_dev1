const { CreateVaccine } = require('../CreateVaccine')

describe('CreateVaccine Use Case', () => {
  let vaccineRepository
  let createVaccine

  beforeEach(() => {
    vaccineRepository = {
      create: jest.fn(async (vaccine) => ({
        ...vaccine,
        id: 'vaccine-id',
      })),
    }

    createVaccine = new CreateVaccine(vaccineRepository)
  })

  it('deve criar uma vacina com dados válidos', async () => {
    const result = await createVaccine.execute({
      name: 'Antirrábica',
      manufacturer: 'VetLab',
      description: 'Vacina contra raiva',
      requiredDoses: 1,
      intervalDays: 0,
    })

    expect(result.id).toBe('vaccine-id')
    expect(result.name).toBe('Antirrábica')
    expect(vaccineRepository.create).toHaveBeenCalledTimes(1)
  })

  it('deve sanitizar espaços e caracteres de controle dos campos textuais', async () => {
    const result = await createVaccine.execute({
      name: '  Antirrábica\u0000  ',
      manufacturer: '  VetLab\u0007  ',
      description: '  Vacina contra raiva\u001F  ',
      requiredDoses: 1,
      intervalDays: 0,
    })

    expect(result.name).toBe('Antirrábica')
    expect(result.manufacturer).toBe('VetLab')
    expect(result.description).toBe('Vacina contra raiva')
  })

  it('deve lançar erro se o nome não for informado', async () => {
    await expect(createVaccine.execute({
      manufacturer: 'VetLab',
      requiredDoses: 1,
    })).rejects.toThrow('O nome da vacina é obrigatório!')
  })

  it('deve lançar erro se o fabricante não for informado', async () => {
    await expect(createVaccine.execute({
      name: 'Antirrábica',
      requiredDoses: 1,
    })).rejects.toThrow('O fabricante da vacina é obrigatório!')
  })

  it('deve lançar erro se requiredDoses for inválido', async () => {
    await expect(createVaccine.execute({
      name: 'Antirrábica',
      manufacturer: 'VetLab',
      requiredDoses: 0,
    })).rejects.toThrow('A quantidade de doses deve ser maior que zero!')
  })
})