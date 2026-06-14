const { IReviewRepository } = require('../../domain/repositories/IReviewRepository')
const ReviewModel = require('../models/ReviewModel')

class ReviewMongoRepository extends IReviewRepository {
  async create(reviewData) {
    const doc = await ReviewModel.create(reviewData)
    return this._toDTO(doc)
  }

  async findAll() {
    const docs = await ReviewModel.find().sort('-createdAt')
    return docs.map((doc) => this._toDTO(doc))
  }

  async findByPetId(petId) {
    const docs = await ReviewModel.find({ petId }).sort('-createdAt')
    return docs.map((doc) => this._toDTO(doc))
  }

  _toDTO(doc) {
    return {
      id: doc._id.toString(),
      rating: doc.rating,
      comment: doc.comment,
      petId: doc.petId,
      authorId: doc.authorId,
    }
  }
}

module.exports = { ReviewMongoRepository }