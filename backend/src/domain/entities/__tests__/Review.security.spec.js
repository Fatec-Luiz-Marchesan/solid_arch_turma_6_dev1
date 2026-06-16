const { Review } = require('../Review')
const { LIMITS } = require('../helpers/review-input')

describe('Review - Segurança (payload e sanitização)', () => {
  const validInput = {
    rating: 5,
    comment: 'Pet maravilhoso, adoção tranquila!',
    petId: 'pet-1',
    authorId: 'user-1',
  }

  it('deve lançar erro se o comentário exceder o tamanho máximo permitido', () => {
    const hugeComment = 'a'.repeat(LIMITS.COMMENT_MAX + 1)
    expect(() => new Review({ ...validInput, comment: hugeComment }))
      .toThrow('O campo comentário excede o tamanho máximo permitido!')
  })

  it('deve sanitizar o comentário removendo espaços nas pontas', () => {
    const review = new Review({ ...validInput, comment: '  Ótimo pet  ' })
    expect(review.comment).toBe('Ótimo pet')
  })

  it('deve remover caracteres de controle do comentário', () => {
    const review = new Review({ ...validInput, comment: 'Texto\u0000 com\t controle' })
    expect(review.comment).toBe('Texto com controle')
  })

  it('deve tratar comentário que vira vazio após sanitização como obrigatório', () => {
    expect(() => new Review({ ...validInput, comment: '   ' }))
      .toThrow('O comentário da avaliação é obrigatório!')
  })

  it('deve aceitar comentário exatamente no limite máximo', () => {
    const limitComment = 'a'.repeat(LIMITS.COMMENT_MAX)
    const review = new Review({ ...validInput, comment: limitComment })
    expect(review.comment).toBe(limitComment)
  })

  it('deve manter o contrato existente intacto (sem regressão)', () => {
    const review = new Review(validInput)
    expect(review.rating).toBe(5)
    expect(review.comment).toBe('Pet maravilhoso, adoção tranquila!')
    expect(review.petId).toBe('pet-1')
    expect(review.authorId).toBe('user-1')
  })
})