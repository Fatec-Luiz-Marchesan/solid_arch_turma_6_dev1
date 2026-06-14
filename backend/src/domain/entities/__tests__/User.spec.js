const { User } = require('../User')

describe('Entidade User (regras de domínio)', () => {
  const makeValidData = (overrides = {}) => ({
    name: 'Maria Silva',
    email: 'maria@email.com',
    phone: '11999998888',
    password: 'senha123',
    confirmpassword: 'senha123',
    ...overrides,
  })


  it('deve criar um User válido com os dados corretos', () => {
    const user = new User(makeValidData())
    expect(user.name).toBe('Maria Silva')
    expect(user.email).toBe('maria@email.com')
    expect(user.phone).toBe('11999998888')
    expect(user.password).toBe('senha123')
  })

  it('não deve expor a confirmação de senha no objeto final', () => {
    const user = new User(makeValidData())
    expect(user.confirmpassword).toBeUndefined()
  })


  it('deve lançar erro se o nome não for informado', () => {
    expect(() => new User(makeValidData({ name: undefined })))
      .toThrow('O nome é obrigatório!')
  })

  it('deve lançar erro se o e-mail não for informado', () => {
    expect(() => new User(makeValidData({ email: undefined })))
      .toThrow('O e-mail é obrigatório!')
  })

  it('deve lançar erro se o telefone não for informado', () => {
    expect(() => new User(makeValidData({ phone: undefined })))
      .toThrow('O telefone é obrigatório!')
  })

  it('deve lançar erro se a senha não for informada', () => {
    expect(() => new User(makeValidData({ password: undefined })))
      .toThrow('A senha é obrigatória!')
  })

  it('deve lançar erro se a confirmação de senha não for informada', () => {
    expect(() => new User(makeValidData({ confirmpassword: undefined })))
      .toThrow('A confirmação de senha é obrigatória!')
  })

  it('deve lançar erro se a senha e a confirmação forem diferentes', () => {
    expect(() => new User(makeValidData({ confirmpassword: 'outra-senha' })))
      .toThrow('A senha e a confirmação precisam ser iguais!')
  })
})