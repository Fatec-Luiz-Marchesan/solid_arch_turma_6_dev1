const { CreateSettings } = require('../CreateSettings')

describe('CreateSettings Use Case', () => {
  const makeRepository = () => ({
    create: jest.fn().mockImplementation(async (data) => ({ id: 'settings-id', ...data })),
  })

  const makeSut = () => {
    const settingsRepository = makeRepository()
    const sut = new CreateSettings(settingsRepository)
    return { sut, settingsRepository }
  }

  const validInput = {
    userId: 'user-1',
    theme: 'dark',
    language: 'en-US',
    notificationsEnabled: false,
  }

  it('deve criar configurações válidas e retornar com id', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(validInput)
    expect(result).toHaveProperty('id')
    expect(result.theme).toBe('dark')
  })

  it('deve repassar os dados validados ao repositório', async () => {
    const { sut, settingsRepository } = makeSut()
    await sut.execute(validInput)
    expect(settingsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        theme: 'dark',
        language: 'en-US',
        notificationsEnabled: false,
      })
    )
  })

  it('deve aplicar os defaults quando campos opcionais não são informados', async () => {
    const { sut, settingsRepository } = makeSut()
    await sut.execute({ userId: 'user-2' })
    expect(settingsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'light',
        language: 'pt-BR',
        notificationsEnabled: true,
      })
    )
  })

  it('deve lançar erro se o userId não for informado', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, userId: undefined }))
      .rejects.toThrow('O usuário das configurações é obrigatório!')
  })

  it('deve lançar erro para tema inválido', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, theme: 'rainbow' }))
      .rejects.toThrow('Tema inválido!')
  })

  it('deve sanitizar espaços do userId antes de validar', async () => {
    const { sut, settingsRepository } = makeSut()
    await sut.execute({ ...validInput, userId: '  user-3  ' })
    expect(settingsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-3' })
    )
  })
})
