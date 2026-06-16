class GetUserProfile {
    constructor(userRepository) {
        this.userRepository = userRepository
    }

    async execute(userId) {
        if (!userId) {
            throw new Error('O id do usuário é obrigatório!')
        }
        const user = await this.userRepository.findById(userId)
        if (!user) {
            const notFound = new Error('Usuário não encontrado!')
            notFound.statusCode = 404
            throw notFound
        }
        return user
    }
}

module.exports = { GetUserProfile }