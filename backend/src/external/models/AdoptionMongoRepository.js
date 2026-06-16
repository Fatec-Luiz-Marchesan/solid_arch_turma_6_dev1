const { IAdoptionRepository } = require('../../domain/repositories/IAdoptionRepository')
const AdoptionModel = require('../models/AdoptionModel')

function toEntity(doc) {
  if (!doc) {
    return null
  }
  return {
    id: doc._id.toString(),
    pet: doc.pet ? doc.pet.toString() : doc.pet,
    requester: doc.requester ? doc.requester.toString() : doc.requester,
    owner: doc.owner ? doc.owner.toString() : doc.owner,
    status: doc.status,
    message: doc.message,
  }
}

class AdoptionMongoRepository extends IAdoptionRepository {
  async create(adoptionData) {
    const doc = await AdoptionModel.create(adoptionData)
    return toEntity(doc)
  }

  async findById(id) {
    const doc = await AdoptionModel.findById(id)
    return toEntity(doc)
  }

  async findByPetAndRequester(petId, requesterId) {
    const doc = await AdoptionModel.findOne({
      pet: { $eq: petId },
      requester: { $eq: requesterId },
    })
    return toEntity(doc)
  }

  async findByRequester(requesterId) {
    const docs = await AdoptionModel.find({ requester: { $eq: requesterId } }).sort('-createdAt')
    return docs.map(toEntity)
  }

  async updateStatus(id, status) {
    const doc = await AdoptionModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
    return toEntity(doc)
  }
}

module.exports = { AdoptionMongoRepository }