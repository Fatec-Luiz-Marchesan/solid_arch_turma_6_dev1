const VALID_SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'other']
const VALID_SIZES = ['small', 'medium', 'large']

class Breed {
  constructor({ name, species, description, size }) {
    if (!name) {
      throw new Error('O nome da raça é obrigatório!')
    }
    if (!species) {
      throw new Error('A espécie é obrigatória!')
    }
    if (!VALID_SPECIES.includes(species)) {
      throw new Error('Espécie inválida!')
    }
    if (size !== undefined && !VALID_SIZES.includes(size)) {
      throw new Error('Porte inválido!')
    }

    this.name = name
    this.species = species
    this.description = description || ''
    this.size = size || 'medium'
  }
}

module.exports = { Breed }