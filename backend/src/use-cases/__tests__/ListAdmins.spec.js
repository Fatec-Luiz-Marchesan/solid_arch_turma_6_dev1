const { ListAdmins } = require('../ListAdmins')

describe('ListAdmins Use Case', () => {
  const makeAdminRepository = () => ({
    findAll: jest.fn().mockResolvedValue([
      { id: '1', name: 'Root Admin', email: 'root@admin.com', role: 'admin' },
      { id: '2', name: 'Segundo Admin', email: 'dois@admin.com', role: 'admin' },
    ]),
  })

  const makeSut = () => {
    const adminRepository = makeAdminRepository()
    const sut = new ListAdmins(adminRepository)
    return { sut, adminRepository }
}

  it('deve retornar a lista de admins', async () => {
    const { sut } = makeSut()
    const result = await sut.execute()

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Root Admin')
  })

  it('deve buscar os admins através do repositório (porta findAll)', async () => {
    const { sut, adminRepository } = makeSut()
    await sut.execute()

    expect(adminRepository.findAll).toHaveBeenCalledTimes(1)
  })

  it('nunca deve expor a senha de nenhum admin', async () => {
    const { sut } = makeSut()
    const result = await sut.execute()

    result.forEach((admin) => {
      expect(admin.password).toBeUndefined()
    })
  })

 it('deve retornar uma lista vazia quando não há admins', async () => {
    const { sut, adminRepository } = makeSut()
    adminRepository.findAll.mockResolvedValue([])

    const result = await sut.execute()

    expect(result).toEqual([])
  })
})