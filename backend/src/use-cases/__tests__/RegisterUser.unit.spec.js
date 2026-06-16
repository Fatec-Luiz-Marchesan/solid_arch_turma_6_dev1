const { RegisterUser } = require('../RegisterUser')

describe('RegisterUser — testes de unidade (mocks)', () => {
  const makeUserRepository = () => ({
    findByEmail: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(async (user) => ({
      id: 'user-id',
      name: user.name,
      email: user.email,
      phone: user.phone,
    })),
  })

  const makeHasher = () => ({
    hash: jest.fn().mockResolvedValue('hashed-password'),
  })

  const makeTokenGenerator = () => ({
    generate: jest.fn().mockReturnValue('valid-token'),
  })

  const makeSut = () => {
    const userRepository = makeUserRepository()
    const hasher = makeHasher()
    const tokenGenerator = makeTokenGenerator()
    const sut = new RegisterUser(userRepository, hasher, tokenGenerator)
    return { sut, userRepository, hasher, tokenGenerator }
  }

  const validInput = {
    name: 'Maria',
    email: 'maria@email.com',
    phone: '11999999999',
    password: '123456',
    confirmpassword: '123456',
  }

  it('deve checar a existência do email exatamente uma vez', async () => {
    const { sut, userRepository } = makeSut()
    await sut.execute(validInput)
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1)
    expect(userRepository.findByEmail).toHaveBeenCalledWith('maria@email.com')
  })

  it('deve gerar o token com id e nome do usuário criado', async () => {
    const { sut, tokenGenerator } = makeSut()
    await sut.execute(validInput)
    expect(tokenGenerator.generate).toHaveBeenCalledWith({
      id: 'user-id',
      name: 'Maria',
    })
  })

  it('não deve criar usuário se a senha não confirmar', async () => {
    const { sut, userRepository } = makeSut()
    await expect(sut.execute({ ...validInput, confirmpassword: 'errada' }))
      .rejects.toThrow('A senha e a confirmação precisam ser iguais!')
    expect(userRepository.create).not.toHaveBeenCalled()
  })

  it('não deve criar usuário se o email já existir', async () => {
    const { sut, userRepository } = makeSut()
    userRepository.findByEmail.mockResolvedValue({ id: 'x' })
    await expect(sut.execute(validInput))
      .rejects.toThrow('Por favor, utilize outro e-mail!')
    expect(userRepository.create).not.toHaveBeenCalled()
  })

  it('deve propagar erro do hasher sem chamar create', async () => {
    const { sut, hasher, userRepository } = makeSut()
    hasher.hash.mockRejectedValue(new Error('Falha no hash'))
    await expect(sut.execute(validInput)).rejects.toThrow('Falha no hash')
    expect(userRepository.create).not.toHaveBeenCalled()
  })
})