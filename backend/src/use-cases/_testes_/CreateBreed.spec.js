const { CreateBreed } = require('../CreateBreed')

describe('CreateBreed Use Case', () => {
  const makeBreedRepository = () => ({
    findByName: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(async (breed) => ({
      id: 'generated-id',
      name: breed.name,
      species: breed.species,
      description: breed.description,
    })),
  })

  const makeSut = () => {
    const breedRepository = makeBreedRepository()
    const sut = new CreateBreed(breedRepository)
    return { sut, breedRepository }
  }

  const validInput = {
    name: 'Labrador',
    species: 'dog',
    description: 'Cão dócil e brincalhão',
  }

  it('deve lançar erro se o nome não for informado', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, name: undefined }))
      .rejects.toThrow('O nome da raça é obrigatório!')
  })

  it('deve lançar erro se a espécie não for informada', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, species: undefined }))
      .rejects.toThrow('A espécie é obrigatória!')
  })

  it('deve lançar erro se a espécie for inválida', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, species: 'dinossauro' }))
      .rejects.toThrow('Espécie inválida!')
  })

  it('deve lançar erro se já existir uma raça com o mesmo nome', async () => {
    const { sut, breedRepository } = makeSut()
    breedRepository.findByName.mockResolvedValue({ id: 'existing', name: 'Labrador' })

    await expect(sut.execute(validInput))
      .rejects.toThrow('Já existe uma raça com este nome!')
  })

  it('deve verificar a existência da raça pelo nome antes de criar', async () => {
    const { sut, breedRepository } = makeSut()
    await sut.execute(validInput)
    expect(breedRepository.findByName).toHaveBeenCalledWith('Labrador')
  })

  it('deve criar a raça e retornar os dados com id', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(validInput)

    expect(result).toHaveProperty('id')
    expect(result.name).toBe('Labrador')
    expect(result.species).toBe('dog')
    expect(result.description).toBe('Cão dócil e brincalhão')
  })

  it('deve aceitar description vazia (campo opcional)', async () => {
    const { sut } = makeSut()
    const result = await sut.execute({ ...validInput, description: undefined })
    expect(result).toHaveProperty('id')
    expect(result.name).toBe('Labrador')
  })
})