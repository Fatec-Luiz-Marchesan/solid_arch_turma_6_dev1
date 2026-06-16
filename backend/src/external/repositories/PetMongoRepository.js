const Pet = require('../../../models/Pet')

class PetMongoRepository {
  async findById(id) {
    const doc = await Pet.findById(id)
    if (!doc) {
      return null
    }
    return {
      id: doc._id.toString(),
      name: doc.name,
      available: doc.available,
      user: doc.user,
      adopter: doc.adopter,
    }
  }
}

module.exports = PetMongoRepository