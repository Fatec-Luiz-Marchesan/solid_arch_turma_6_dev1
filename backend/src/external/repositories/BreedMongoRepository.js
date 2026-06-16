const { IBreedRepository } = require('../../domain/repositories/IBreedRepository')
const BreedModel = require('../models/BreedModel')

class BreedMongoRepository extends IBreedRepository {
  async findByName(name) {
    if (typeof name !== 'string') {
      return null
    }
    return BreedModel.findOne({ name: { $eq: name } })
  }

  async create(breedData) {
    const doc = await BreedModel.create(breedData)
    return {
      id: doc._id.toString(),
      name: doc.name,
      species: doc.species,
      description: doc.description,
      size: doc.size,
    }
  }

  async findAll() {
    const docs = await BreedModel.find().sort('-createdAt')
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      species: doc.species,
      description: doc.description,
      size: doc.size,
    }))
  }
  async findAllFiltered({species, skip = 0, limit = 10} = {}) {
    const filter = species ? {species: {$eq: species}} : {}
    const [docs, total] = await Promise.all([
      BreedModel.find(filter).sort('-createdAt').skip(skip).limit(limit),
      BreedModel.countDocuments(filter),
    ])
    return {
      breeds: docs.map((doc) => ({
        id: doc._id.toString(),
        name: doc.name,
        species: doc.species,
        description: doc.description,
      })),
      total,
    }
  }
  
}

module.exports = { BreedMongoRepository }