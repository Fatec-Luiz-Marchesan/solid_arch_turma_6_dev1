const { canTransition } = require('../domain/entities/helpers/adoption-status')

const VALID_DECISIONS = ['approved', 'rejected']

class ReviewAdoptionDecision {
  constructor(adoptionRepository) {
    this.adoptionRepository = adoptionRepository
  }

  async execute({ adoptionId, ownerId, decision }) {
    if (!VALID_DECISIONS.includes(decision)) {
      throw new Error('Decisão inválida!')
    }

    const adoption = await this.adoptionRepository.findById(adoptionId)
    if (!adoption) {
      throw new Error('Adoção não encontrada!')
    }

    if (adoption.owner !== ownerId) {
      throw new Error('Apenas o dono do pet pode decidir sobre a adoção!')
    }

    if (!canTransition(adoption.status, decision)) {
      throw new Error('Esta adoção já foi finalizada!')
    }

    const updated = await this.adoptionRepository.updateStatus(adoptionId, decision)
    return updated
  }
}

module.exports = { ReviewAdoptionDecision }