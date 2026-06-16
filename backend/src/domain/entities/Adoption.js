function sameId(a, b) {
  if (!a || !b) return false
  // ObjectId tem .equals(); strings usam comparação direta
  if (typeof a.equals === 'function') return a.equals(b)
  return String(a) === String(b)
}

class Adoption {
  constructor(pet) {
    if (!pet) {
      throw new Error('O pet é obrigatório para iniciar uma adoção!')
    }
    this.pet = pet
  }

  schedule(visitor) {
    // Regra: o dono não pode agendar com o próprio pet
    if (sameId(this.pet.user._id, visitor._id)) {
      throw new Error('Você não pode agendar uma visita com seu próprio Pet!')
    }

    if (this.pet.adopter && sameId(this.pet.adopter._id, visitor._id)) {
      throw new Error('Você já agendou uma visita para este Pet!')
    }

    this.pet.adopter = {
      _id: visitor._id,
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
}

module.exports = { Adoption }