const { Adoption } = require('../domain/entities/Adoption')

class RequestAdoption {
  constructor(adoptionRepository, petRepository) {
    this.adoptionRepository = adoptionRepository
    this.petRepository = petRepository
  }

  async execute({ petId, requesterId, message }) {
    const pet = await this.petRepository.findById(petId)
    if (!pet) {
      throw new Error('Pet não encontrado!')
    }
    if (!pet.available) {
      throw new Error('Este pet não está disponível para adoção!')
    }

    const ownerId = pet.user && (pet.user._id || pet.user.id || pet.user)

    const adoption = new Adoption({
      pet: petId,
      requester: requesterId,
      owner: ownerId,
      message,
    })

    const existing = await this.adoptionRepository.findByPetAndRequester(petId, requesterId)
    if (existing) {
      throw new Error('Você já solicitou a adoção deste pet!')
    }

    const created = await this.adoptionRepository.create({
      pet: adoption.pet,
      requester: adoption.requester,
      owner: adoption.owner,
      status: adoption.status,
      message: adoption.message,
    })

    return created
  }
}

module.exports = { RequestAdoption }