const { ReviewAdoptionDecision } = require('../ReviewAdoptionDecision')

describe('ReviewAdoptionDecision Use Case', () => {
  const makeAdoptionRepository = () => ({
    findById: jest.fn().mockResolvedValue({
      id: 'adoption-1',
      pet: 'pet-1',
      requester: 'user-2',
      owner: 'owner-1',
      status: 'pending',
    }),
    updateStatus: jest.fn().mockImplementation(async (id, status) => ({
      id,
      status,
    })),
  })

  const makeSut = () => {
    const adoptionRepository = makeAdoptionRepository()
    const sut = new ReviewAdoptionDecision(adoptionRepository)
    return { sut, adoptionRepository }
  }

  it('deve aprovar uma adoção pendente quando solicitada pelo dono', async () => {
    const { sut, adoptionRepository } = makeSut()
    const result = await sut.execute({
      adoptionId: 'adoption-1',
      ownerId: 'owner-1',
      decision: 'approved',
    })

    expect(adoptionRepository.updateStatus).toHaveBeenCalledWith('adoption-1', 'approved')
    expect(result.status).toBe('approved')
  })

  it('deve rejeitar uma adoção pendente', async () => {
    const { sut, adoptionRepository } = makeSut()
    await sut.execute({ adoptionId: 'adoption-1', ownerId: 'owner-1', decision: 'rejected' })

    expect(adoptionRepository.updateStatus).toHaveBeenCalledWith('adoption-1', 'rejected')
  })

  it('deve lançar erro se a adoção não existir', async () => {
    const { sut, adoptionRepository } = makeSut()
    adoptionRepository.findById.mockResolvedValue(null)

    await expect(sut.execute({ adoptionId: 'x', ownerId: 'owner-1', decision: 'approved' }))
      .rejects.toThrow('Adoção não encontrada!')
  })

  it('deve lançar erro se quem decide não for o dono do pet', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ adoptionId: 'adoption-1', ownerId: 'intruso', decision: 'approved' }))
      .rejects.toThrow('Apenas o dono do pet pode decidir sobre a adoção!')
  })

  it('deve lançar erro para uma decisão inválida', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ adoptionId: 'adoption-1', ownerId: 'owner-1', decision: 'talvez' }))
      .rejects.toThrow('Decisão inválida!')
  })

  it('deve lançar erro ao decidir sobre adoção que não está pendente', async () => {
    const { sut, adoptionRepository } = makeSut()
    adoptionRepository.findById.mockResolvedValue({
      id: 'adoption-1',
      owner: 'owner-1',
      status: 'approved',
    })

    await expect(sut.execute({ adoptionId: 'adoption-1', ownerId: 'owner-1', decision: 'rejected' }))
      .rejects.toThrow('Esta adoção já foi finalizada!')
  })
})