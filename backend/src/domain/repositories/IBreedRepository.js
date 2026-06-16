class IBreedRepository {
  async findByName(name) {
    throw new Error('Método findByName não implementado')
  }

  async create(breedData) {
    throw new Error('Método create não implementado')
  }

  async findAll() {
    throw new Error('Método findAll não implementado')
  }

  async findAllFiltered(options) {
    throw new Error ('Método findAllFiltered não implementado')
  }
}

module.exports = { IBreedRepository }