const MIN_RATING = 1
const MAX_RATING = 5

class Review {
  constructor({ rating, comment, petId, authorId }) {
    if (rating === undefined || rating === null || rating === '') {
      throw new Error('A nota da avaliação é obrigatória!')
    }
    if (typeof rating !== 'number' || Number.isNaN(rating)) {
      throw new Error('A nota deve ser um número!')
    }
    if (rating < MIN_RATING || rating > MAX_RATING) {
      throw new Error('A nota deve estar entre 1 e 5!')
    }
    if (!comment) {
      throw new Error('O comentário da avaliação é obrigatório!')
    }
    if (!petId) {
      throw new Error('O pet avaliado é obrigatório!')
    }
    if (!authorId) {
      throw new Error('O autor da avaliação é obrigatório!')
    }

    this.rating = rating
    this.comment = comment
    this.petId = petId
    this.authorId = authorId
  }
}

module.exports = { Review, MIN_RATING, MAX_RATING }