const { Breed } = require('../domain/entities/Breed')

class CreateBreed {

  constructor(breedRepository) {
    this.breedRepository = breedRepository
  }

  async execute({ name, species, description }) {
  
    const breed = new Breed({ name, species, description })

    const alreadyExists = await this.breedRepository.findByName(breed.name)
    if (alreadyExists) {
      throw new Error('Já existe uma raça com este nome!')
    }

    const created = await this.breedRepository.create({
      name: breed.name,
      species: breed.species,
      description: breed.description,
    })

    return created
  }
}

module.exports = { CreateBreed }