const VALID_SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'other']

class Breed {
  constructor({ name, species, description }) {
    if (!name) {
      throw new Error('O nome da raça é obrigatório!')
    }
    if (!species) {
      throw new Error('A espécie é obrigatória!')
    }
    if (!VALID_SPECIES.includes(species)) {
      throw new Error('Espécie inválida!')
    }

    this.name = name
    this.species = species
    this.description = description || ''
  }
}

module.exports = { Breed }