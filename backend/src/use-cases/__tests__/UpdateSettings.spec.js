const { UpdateSettings } = require('../UpdateSettings')

describe('UpdateSettings Use Case', () => {
  const makeRepository = () => ({
    update: jest.fn().mockImplementation(async (id, data) => ({ id, ...data })),
  })

  const makeSut = () => {
    const settingsRepository = makeRepository()
    const sut = new UpdateSettings(settingsRepository)
    return { sut, settingsRepository }
  }

  it('deve atualizar apenas os campos informados', async () => {
    const { sut, settingsRepository } = makeSut()
    await sut.execute('id-1', { theme: 'dark' })
    expect(settingsRepository.update).toHaveBeenCalledWith('id-1', { theme: 'dark' })
  })

  it('deve atualizar múltiplos campos quando informados', async () => {
    const { sut, settingsRepository } = makeSut()
    await sut.execute('id-1', { theme: 'light', language: 'es', notificationsEnabled: false })
    expect(settingsRepository.update).toHaveBeenCalledWith('id-1', {
      theme: 'light',
      language: 'es',
      notificationsEnabled: false,
    })
  })

  it('não deve incluir campos não informados no update', async () => {
    const { sut, settingsRepository } = makeSut()
    await sut.execute('id-1', { language: 'en-US' })
    expect(settingsRepository.update).toHaveBeenCalledWith('id-1', { language: 'en-US' })
  })

  it('deve lançar erro para tema inválido', async () => {
    const { sut } = makeSut()
    await expect(sut.execute('id-1', { theme: 'rainbow' }))
      .rejects.toThrow('Tema inválido!')
  })

  it('deve lançar erro para idioma inválido', async () => {
    const { sut } = makeSut()
    await expect(sut.execute('id-1', { language: 'fr-FR' }))
      .rejects.toThrow('Idioma inválido!')
  })

  it('deve lançar erro se notificationsEnabled não for booleano', async () => {
    const { sut } = makeSut()
    await expect(sut.execute('id-1', { notificationsEnabled: 'sim' }))
      .rejects.toThrow('O campo de notificações deve ser booleano!')
  })

  it('deve sanitizar o tema antes de validar', async () => {
    const { sut, settingsRepository } = makeSut()
    await sut.execute('id-1', { theme: '  dark  ' })
    expect(settingsRepository.update).toHaveBeenCalledWith('id-1', { theme: 'dark' })
  })

  it('deve permitir update vazio (nenhum campo)', async () => {
    const { sut, settingsRepository } = makeSut()
    await sut.execute('id-1', {})
    expect(settingsRepository.update).toHaveBeenCalledWith('id-1', {})
  })
})
