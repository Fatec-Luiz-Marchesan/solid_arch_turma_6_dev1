class IProfileRepository {
  async findByUser(user) {
    throw new Error('Método findByUser não implementado')
  }

  async create(profileData) {
    throw new Error('Método create não implementado')
  }
}

module.exports = { IProfileRepository }