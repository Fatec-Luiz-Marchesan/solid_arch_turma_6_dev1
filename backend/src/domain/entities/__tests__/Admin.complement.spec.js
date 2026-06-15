const { Admin } = require('../Admin')

describe('Entidade Admin (cenários complementares)', () => {
  const makeValidData = (overrides = {}) => ({
    name: 'Admin Geral',
    email: 'admin@email.com',
    password: 'senha123',
    ...overrides,
  })

  it('deve preservar uma role customizada (moderator)', () => {
    const admin = new Admin(makeValidData({ role: 'moderator' }))
    expect(admin.role).toBe('moderator')
  })

  it('deve usar "admin" quando role é string vazia (valor falsy)', () => {
    // role || 'admin' → string vazia cai no default
    const admin = new Admin(makeValidData({ role: '' }))
    expect(admin.role).toBe('admin')
  })

  it('deve usar "admin" quando role é null', () => {
    const admin = new Admin(makeValidData({ role: null }))
    expect(admin.role).toBe('admin')
  })

  it('deve rejeitar senha com 5 caracteres mesmo contendo símbolos', () => {
    expect(() => new Admin(makeValidData({ password: '@#$%!' })))
      .toThrow('A senha deve ter no mínimo 6 caracteres!')
  })

  it('deve aceitar senha de 6 caracteres composta por símbolos', () => {
    const admin = new Admin(makeValidData({ password: '@#$%!&' }))
    expect(admin.password).toBe('@#$%!&')
  })

  it('deve aceitar senha contendo espaços desde que tenha 6+ caracteres', () => {
    const admin = new Admin(makeValidData({ password: 'a b c d' }))
    expect(admin.password).toBe('a b c d')
  })

  it('deve contar espaços no comprimento da senha (string só de espaços)', () => {
    // 6 espaços têm length 6, então a regra de tamanho passa.
    const admin = new Admin(makeValidData({ password: '      ' }))
    expect(admin.password).toBe('      ')
  })

  it('deve preservar o email exatamente como informado', () => {
    const admin = new Admin(makeValidData({ email: 'Admin.Geral+tag@Email.COM' }))
    expect(admin.email).toBe('Admin.Geral+tag@Email.COM')
  })

  it('deve expor exatamente os campos esperados', () => {
    const admin = new Admin(makeValidData({ role: 'admin' }))
    expect(admin).toEqual(
      expect.objectContaining({
        name: 'Admin Geral',
        email: 'admin@email.com',
        password: 'senha123',
        role: 'admin',
      })
    )
  })

  it('deve manter o name quando informado junto dos demais campos', () => {
    const admin = new Admin(makeValidData({ name: 'Fulano' }))
    expect(admin.name).toBe('Fulano')
  })
})
