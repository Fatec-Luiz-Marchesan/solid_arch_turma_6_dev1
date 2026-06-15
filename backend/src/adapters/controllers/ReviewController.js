const { CreateReview } = require('../../use-cases/CreateReview')
const { ReviewMongoRepository } = require('../../external/repositories/ReviewMongoRepository')

module.exports = class ReviewController {
  static async create(req, res) {
    const { rating, comment, petId, authorId } = req.body

    const reviewRepository = new ReviewMongoRepository()
    const createReview = new CreateReview(reviewRepository)

    try {
      const review = await createReview.execute({
        rating,
        comment,
        petId,
        authorId,
      })

      return res.status(201).json({
        message: 'Avaliação criada com sucesso!',
        review,
      })
    } catch (error) {
      return res.status(422).json({
        message: error.message,
      })
    }
  }

  static async getAll(req, res) {
    const reviewRepository = new ReviewMongoRepository()

    try {
      const reviews = await reviewRepository.findAll()

      return res.status(200).json({
        reviews,
      })
    } catch (error) {
      return res.status(500).json({
        message: 'Erro interno ao listar avaliações',
      })
    }
  }

  static async getByPet(req, res) {
    const { petId } = req.params

    const reviewRepository = new ReviewMongoRepository()

    try {
      const reviews = await reviewRepository.findByPet(petId)

      return res.status(200).json({
        reviews,
      })
    } catch (error) {
      return res.status(500).json({
        message: 'Erro interno ao listar avaliações do pet',
      })
    }
  }
}