const { CreateProfile } = require('../CreateProfile')

describe('CreateProfile Use Case', () => {
  const makeProfileRepository = () => ({
    findByUser: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(async (data) => ({
      id: 'profile-id',
      user: data.user,
      bio: data.bio,
      phone: data.phone,
    })),
  })

  const makeSut = () => {
    const profileRepository = makeProfileRepository()
    const sut = new CreateProfile(profileRepository)
    return { sut, profileRepository }
  }

  const validInput = { user: 'user-id', bio: 'Amo animais', phone: '11999999999' }

  it('deve lancar erro de validacao vindo da entidade (user ausente)', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, user: undefined }))
      .rejects.toThrow('O usuario e obrigatorio!')
  })

  it('deve lancar erro se o usuario ja tiver um profile', async () => {
    const { sut, profileRepository } = makeSut()
    profileRepository.findByUser.mockResolvedValue({ id: 'x', user: 'user-id' })

    await expect(sut.execute(validInput))
      .rejects.toThrow('Este usuario ja possui um profile!')
  })

  it('deve persistir o profile atraves do repositorio', async () => {
    const { sut, profileRepository } = makeSut()
    await sut.execute(validInput)

    expect(profileRepository.create).toHaveBeenCalledWith({
      user: 'user-id',
      bio: 'Amo animais',
      phone: '11999999999',
    })
  })

  it('deve retornar o profile criado com id', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(validInput)

    expect(result).toHaveProperty('id', 'profile-id')
    expect(result.user).toBe('user-id')
  })
})