const { GetUserProfile } = require('../GetUserProfile')

describe('GetUserProfile Use Case', () => {
    const makeUserRepository = (user) => ({
        findById: jest.fn().mockResolvedValue(user),
    })

    it('deve retornar o perfil quando o usuário existe', async () => {
        const repo = makeUserRepository({ id: 'u1', name: 'Maria', email: 'm@m.com' })
        const sut = new GetUserProfile(repo)

        const result = await sut.execute('u1')

        expect(repo.findById).toHaveBeenCalledWith('u1')
        expect(result.name).toBe('Maria')
    })

    it('deve lançar erro 404 quando o usuário não existe', async () => {
        const repo = makeUserRepository(null)
        const sut = new GetUserProfile(repo)

        await expect(sut.execute('inexistente')).rejects.toMatchObject({
            message: 'Usuário não encontrado!',
            statusCode: 404,
        })
    })

    it('deve lançar erro se o id não for informado', async () => {
        const repo = makeUserRepository(null)
        const sut = new GetUserProfile(repo)

        await expect(sut.execute(undefined))
            .rejects.toThrow('O id do usuário é obrigatório!')
    })
})