const { CreateReview } = require('../CreateReview')

describe('CreateReview Use Case', () => {
  const makeReviewRepository = () => ({
    create: jest.fn().mockImplementation(async (review) => ({
      id: 'review-id',
      rating: review.rating,
      comment: review.comment,
      petId: review.petId,
      authorId: review.authorId,
    })),
  })

  const makeSut = () => {
    const reviewRepository = makeReviewRepository()
    const sut = new CreateReview(reviewRepository)

    return {
      sut,
      reviewRepository,
    }
  }

  const validInput = {
    rating: 5,
    comment: 'Pet maravilhoso, adoção tranquila!',
    petId: 'pet-1',
    authorId: 'user-1',
  }

  it('deve lançar erro se a nota não for informada', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, rating: undefined }))
      .rejects.toThrow('A nota da avaliação é obrigatória!')
  })

  it('deve lançar erro se a nota não for um número', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, rating: 'cinco' }))
      .rejects.toThrow('A nota deve ser um número!')
  })

  it('deve lançar erro se a nota estiver fora do intervalo 1-5', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, rating: 6 }))
      .rejects.toThrow('A nota deve estar entre 1 e 5!')

    await expect(sut.execute({ ...validInput, rating: 0 }))
      .rejects.toThrow('A nota deve estar entre 1 e 5!')
  })

  it('deve lançar erro se o comentário não for informado', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, comment: undefined }))
      .rejects.toThrow('O comentário da avaliação é obrigatório!')
  })

  it('deve lançar erro se o pet avaliado não for informado', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, petId: undefined }))
      .rejects.toThrow('O pet avaliado é obrigatório!')
  })

  it('deve lançar erro se o autor não for informado', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, authorId: undefined }))
      .rejects.toThrow('O autor da avaliação é obrigatório!')
  })

  it('deve repassar os dados validados ao repositório', async () => {
    const { sut, reviewRepository } = makeSut()
    await sut.execute(validInput)

    expect(reviewRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        rating: 5,
        comment: 'Pet maravilhoso, adoção tranquila!',
        petId: 'pet-1',
        authorId: 'user-1',
      })
    )
  })

  it('deve retornar a review criada com id', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(validInput)

    expect(result).toHaveProperty('id')
    expect(result.rating).toBe(5)
    expect(result.petId).toBe('pet-1')
  })
})