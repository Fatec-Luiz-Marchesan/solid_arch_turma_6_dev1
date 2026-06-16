const { RequestAdoption } = require('../RequestAdoption')

describe('RequestAdoption Use Case', () => {
  const makePetRepository = () => ({
    findById: jest.fn().mockResolvedValue({
      id: 'pet-1',
      available: true,
      user: { _id: 'owner-1' },
    }),
  })

  const makeAdoptionRepository = () => ({
    findByPetAndRequester: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(async (data) => ({ id: 'adoption-1', ...data })),
  })

  const validInput = {
    petId: 'pet-1',
    requesterId: 'user-2',
    message: 'Tenho quintal grande e amo animais.',
  }

  const makeSut = () => {
    const petRepository = makePetRepository()
    const adoptionRepository = makeAdoptionRepository()
    const sut = new RequestAdoption(adoptionRepository, petRepository)
    return { sut, petRepository, adoptionRepository }
  }

  it('deve criar uma solicitação de adoção com status pending', async () => {
    const { sut, adoptionRepository } = makeSut()
    const result = await sut.execute(validInput)

    expect(adoptionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        pet: 'pet-1',
        requester: 'user-2',
        owner: 'owner-1',
        status: 'pending',
      })
    )
    expect(result).toHaveProperty('id', 'adoption-1')
  })

  it('deve lançar erro se o pet não existir', async () => {
    const { sut, petRepository } = makeSut()
    petRepository.findById.mockResolvedValue(null)

    await expect(sut.execute(validInput)).rejects.toThrow('Pet não encontrado!')
  })

  it('deve lançar erro se o pet não estiver disponível', async () => {
    const { sut, petRepository } = makeSut()
    petRepository.findById.mockResolvedValue({
      id: 'pet-1',
      available: false,
      user: { _id: 'owner-1' },
    })

    await expect(sut.execute(validInput)).rejects.toThrow('Este pet não está disponível para adoção!')
  })

  it('deve lançar erro se o solicitante for o dono do pet', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, requesterId: 'owner-1' }))
      .rejects.toThrow('O dono não pode adotar o próprio pet!')
  })

  it('deve lançar erro se já existir solicitação do mesmo usuário para o mesmo pet', async () => {
    const { sut, adoptionRepository } = makeSut()
    adoptionRepository.findByPetAndRequester.mockResolvedValue({ id: 'adoption-existing' })

    await expect(sut.execute(validInput))
      .rejects.toThrow('Você já solicitou a adoção deste pet!')
  })
})