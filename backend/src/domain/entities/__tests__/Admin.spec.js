const { Admin } = require('../Admin')

describe('Entidade Admin (regras de domínio)', () => {
  const makeValidData = (overrides = {}) => ({
    name: 'Admin Geral',
    email: 'admin@email.com',
    password: 'senha123',
    ...overrides,
  })

  it('deve criar um Admin válido com os dados corretos', () => {
    const admin = new Admin(makeValidData())
    expect(admin.name).toBe('Admin Geral')
    expect(admin.email).toBe('admin@email.com')
    expect(admin.password).toBe('senha123')
  })

  it('deve atribuir a role "admin" por padrão quando não informada', () => {
    const admin = new Admin(makeValidData())
    expect(admin.role).toBe('admin')
  })

  it('deve preservar a role quando informada explicitamente', () => {
    const admin = new Admin(makeValidData({ role: 'super-admin' }))
    expect(admin.role).toBe('super-admin')
  })

  it('deve aceitar admin sem nome (name não é validado pela entidade)', () => {
    // Documenta o comportamento atual: apenas email e senha são obrigatórios.
    const admin = new Admin(makeValidData({ name: undefined }))
    expect(admin.email).toBe('admin@email.com')
    expect(admin.name).toBeUndefined()
  })

  it('deve lançar erro se o email não for informado', () => {
    expect(() => new Admin(makeValidData({ email: undefined })))
      .toThrow('O email é obrigatório!')
  })

  it('deve lançar erro se o email for string vazia', () => {
    expect(() => new Admin(makeValidData({ email: '' })))
      .toThrow('O email é obrigatório!')
  })

  it('deve lançar erro se a senha não for informada', () => {
    expect(() => new Admin(makeValidData({ password: undefined })))
      .toThrow('A senha deve ter no mínimo 6 caracteres!')
  })

  it('deve lançar erro se a senha tiver menos de 6 caracteres', () => {
    expect(() => new Admin(makeValidData({ password: '12345' })))
      .toThrow('A senha deve ter no mínimo 6 caracteres!')
  })

  it('deve aceitar uma senha com exatamente 6 caracteres (limite válido)', () => {
    const admin = new Admin(makeValidData({ password: '123456' }))
    expect(admin.password).toBe('123456')
  })

  it('deve aceitar uma senha com mais de 6 caracteres', () => {
    const admin = new Admin(makeValidData({ password: 'senhaSuperLonga' }))
    expect(admin.password).toBe('senhaSuperLonga')
  })

  it('deve criar instâncias independentes', () => {
    const a = new Admin(makeValidData({ email: 'a@email.com' }))
    const b = new Admin(makeValidData({ email: 'b@email.com' }))
    expect(a.email).toBe('a@email.com')
    expect(b.email).toBe('b@email.com')
    expect(a).not.toBe(b)
  })
})