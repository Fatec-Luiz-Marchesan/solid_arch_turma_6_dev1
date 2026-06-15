const { RecordAuditEvent } = require('../RecordAuditEvent')

describe('RecordAuditEvent Use Case', () => {
  const makeAuditRepository = () => ({
    record: jest.fn().mockImplementation(async (event) => ({
      id: 'audit-id',
      ...event,
      createdAt: new Date('2026-01-01T00:00:00Z'),
    })),
  })

  const makeSut = () => {
    const auditRepository = makeAuditRepository()
    const sut = new RecordAuditEvent(auditRepository)
    return { sut, auditRepository }
  }

  const validInput = {
    action: 'DELETE_PET',
    actorId: 'admin-1',
    targetId: 'pet-99',
  }

  it('deve lançar erro se a ação não for informada', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, action: undefined }))
      .rejects.toThrow('A ação auditada é obrigatória!')
  })

  it('deve lançar erro se o ator (actorId) não for informado', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, actorId: undefined }))
      .rejects.toThrow('O ator da ação é obrigatório!')
  })

  it('deve registrar o evento com metadados opcionais', async () => {
    const { sut, auditRepository } = makeSut()
    await sut.execute({ ...validInput, metadata: { reason: 'spam' } })

    expect(auditRepository.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'DELETE_PET',
        actorId: 'admin-1',
        targetId: 'pet-99',
        metadata: { reason: 'spam' },
      })
    )
  })

  it('deve retornar o evento registrado com id e timestamp', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(validInput)

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('createdAt')
    expect(result.action).toBe('DELETE_PET')
  })
})