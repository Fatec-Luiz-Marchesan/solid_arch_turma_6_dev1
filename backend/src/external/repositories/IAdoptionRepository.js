class IAdoptionRepository {
  async create(adoptionData) {
    throw new Error('Método create não implementado')
  }

  async findById(id) {
    throw new Error('Método findById não implementado')
  }

  async findByPetAndRequester(petId, requesterId) {
    throw new Error('Método findByPetAndRequester não implementado')
  }

  async findByRequester(requesterId) {
    throw new Error('Método findByRequester não implementado')
  }

  async updateStatus(id, status) {
    throw new Error('Método updateStatus não implementado')
  }
}

module.exports = { IAdoptionRepository }