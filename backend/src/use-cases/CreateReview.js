const { Review } = require('../domain/entities/Review')

class CreateReview {

  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository
  }

  async execute({ rating, comment, petId, authorId }) {

    const review = new Review({ rating, comment, petId, authorId })

    const created = await this.reviewRepository.create({
      rating: review.rating,
      comment: review.comment,
      petId: review.petId,
      authorId: review.authorId,
    })

    return created
  }
}

module.exports = { CreateReview }