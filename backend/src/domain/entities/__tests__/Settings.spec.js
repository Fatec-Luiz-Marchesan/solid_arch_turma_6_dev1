const { Settings, VALID_THEMES, VALID_LANGUAGES } = require('../Settings')

describe('Entidade Settings (regras de domínio)', () => {
  const makeValid = (overrides = {}) => ({
    userId: 'user-1',
    theme: 'dark',
    language: 'en-US',
    notificationsEnabled: false,
    ...overrides,
  })

  it('deve criar configurações válidas com os dados corretos', () => {
    const settings = new Settings(makeValid())
    expect(settings.userId).toBe('user-1')
    expect(settings.theme).toBe('dark')
    expect(settings.language).toBe('en-US')
    expect(settings.notificationsEnabled).toBe(false)
  })

  it('deve assumir theme "light" por padrão', () => {
    const settings = new Settings(makeValid({ theme: undefined }))
    expect(settings.theme).toBe('light')
  })

  it('deve assumir language "pt-BR" por padrão', () => {
    const settings = new Settings(makeValid({ language: undefined }))
    expect(settings.language).toBe('pt-BR')
  })

  it('deve assumir notificationsEnabled true por padrão', () => {
    const settings = new Settings(makeValid({ notificationsEnabled: undefined }))
    expect(settings.notificationsEnabled).toBe(true)
  })

  it('deve expor as constantes de temas e idiomas válidos', () => {
    expect(VALID_THEMES).toContain('light')
    expect(VALID_THEMES).toContain('dark')
    expect(VALID_LANGUAGES).toContain('pt-BR')
  })

  it('deve lançar erro se o userId não for informado', () => {
    expect(() => new Settings(makeValid({ userId: undefined })))
      .toThrow('O usuário das configurações é obrigatório!')
  })

  it('deve lançar erro para um tema inválido', () => {
    expect(() => new Settings(makeValid({ theme: 'rainbow' })))
      .toThrow('Tema inválido!')
  })

  it('deve lançar erro para um idioma inválido', () => {
    expect(() => new Settings(makeValid({ language: 'fr-FR' })))
      .toThrow('Idioma inválido!')
  })

  it('deve lançar erro se notificationsEnabled não for booleano', () => {
    expect(() => new Settings(makeValid({ notificationsEnabled: 'sim' })))
      .toThrow('O campo de notificações deve ser booleano!')
  })

  it('deve aceitar todos os temas válidos', () => {
    VALID_THEMES.forEach((theme) => {
      expect(() => new Settings(makeValid({ theme }))).not.toThrow()
    })
  })

  it('deve aceitar todos os idiomas válidos', () => {
    VALID_LANGUAGES.forEach((language) => {
      expect(() => new Settings(makeValid({ language }))).not.toThrow()
    })
  })

  it('deve criar instâncias independentes', () => {
    const a = new Settings(makeValid({ userId: 'u-a' }))
    const b = new Settings(makeValid({ userId: 'u-b' }))
    expect(a.userId).toBe('u-a')
    expect(b.userId).toBe('u-b')
    expect(a).not.toBe(b)
  })
})