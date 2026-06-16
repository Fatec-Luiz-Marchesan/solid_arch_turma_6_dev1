const SettingsModel = require('../SettingsModel')

describe('SettingsModel (schema Mongoose)', () => {
  const makeValid = (overrides = {}) => ({
    userId: 'user-1',
    ...overrides,
  })

  it('deve exigir o campo userId', () => {
    const settings = new SettingsModel({})
    const err = settings.validateSync()
    expect(err.errors.userId).toBeDefined()
  })

  it('deve aplicar os defaults (light, pt-BR, notificações true)', () => {
    const settings = new SettingsModel(makeValid())
    expect(settings.theme).toBe('light')
    expect(settings.language).toBe('pt-BR')
    expect(settings.notificationsEnabled).toBe(true)
  })

  it('não deve apresentar erro com dados válidos', () => {
    const settings = new SettingsModel(makeValid({ theme: 'dark', language: 'es' }))
    const err = settings.validateSync()
    expect(err).toBeUndefined()
  })

  it('deve rejeitar um theme fora do enum', () => {
    const settings = new SettingsModel(makeValid({ theme: 'rainbow' }))
    const err = settings.validateSync()
    expect(err.errors.theme).toBeDefined()
  })

  it('deve rejeitar um language fora do enum', () => {
    const settings = new SettingsModel(makeValid({ language: 'fr-FR' }))
    const err = settings.validateSync()
    expect(err.errors.language).toBeDefined()
  })
})