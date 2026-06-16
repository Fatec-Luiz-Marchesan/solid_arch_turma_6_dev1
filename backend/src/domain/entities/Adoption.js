class Adoption {
  constructor(pet) {
    if (!pet) {
      throw new Error('O pet é obrigatório para iniciar uma adoção!')
    }

    this.pet = pet
  }

  schedule(visitor) {
    if (!visitor) {
      throw new Error('O visitante é obrigatório para agendar uma visita!')
    }

    const ownerId = this.pet.user?._id || this.pet.user?.id || this.pet.user
    const visitorId = visitor._id || visitor.id

    if (this.sameId(ownerId, visitorId)) {
      throw new Error('Você não pode agendar uma visita com seu próprio Pet!')
    }

    const currentAdopterId =
      this.pet.adopter?._id ||
      this.pet.adopter?.id ||
      this.pet.adopter

    if (currentAdopterId && this.sameId(currentAdopterId, visitorId)) {
      throw new Error('Você já agendou uma visita para este Pet!')
    }

    this.pet.adopter = {
      _id: visitorId,
      name: visitor.name,
      image: visitor.image,
    }

    return this.pet
  }

  conclude() {
    if (!this.pet.adopter) {
      throw new Error('Não é possível concluir uma adoção sem um adotante!')
    }

    this.pet.available = false

    return this.pet
  }

  sameId(a, b) {
    if (!a || !b) return false

    if (typeof a.equals === 'function') {
      return a.equals(b)
    }

    if (typeof b.equals === 'function') {
      return b.equals(a)
    }

    return String(a) === String(b)
  }
}

module.exports = { Adoption }