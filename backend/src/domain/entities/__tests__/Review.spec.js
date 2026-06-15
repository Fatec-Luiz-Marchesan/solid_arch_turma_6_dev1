const { Review, MIN_RATING, MAX_RATING } = require('../Review')

describe('Entidade Review (regras de domínio)', () => {
  const makeValidData = (overrides = {}) => ({
    rating: 5,
    comment: 'Pet maravilhoso, adoção tranquila!',
    petId: 'pet-1',
    authorId: 'user-1',
    ...overrides,
  })

  it('deve criar uma Review válida com os dados corretos', () => {
    const review = new Review(makeValidData())
    expect(review.rating).toBe(5)
    expect(review.comment).toBe('Pet maravilhoso, adoção tranquila!')
    expect(review.petId).toBe('pet-1')
    expect(review.authorId).toBe('user-1')
  })

  it('deve expor as constantes de limite de nota', () => {
    expect(MIN_RATING).toBe(1)
    expect(MAX_RATING).toBe(5)
  })

  it('deve aceitar a nota mínima (1)', () => {
    const review = new Review(makeValidData({ rating: 1 }))
    expect(review.rating).toBe(1)
  })

  it('deve aceitar a nota máxima (5)', () => {
    const review = new Review(makeValidData({ rating: 5 }))
    expect(review.rating).toBe(5)
  })

  it('deve aceitar uma nota intermediária (3)', () => {
    const review = new Review(makeValidData({ rating: 3 }))
    expect(review.rating).toBe(3)
  })

  it('deve lançar erro para nota logo abaixo do mínimo (0)', () => {
    expect(() => new Review(makeValidData({ rating: 0 })))
      .toThrow('A nota deve estar entre 1 e 5!')
  })

  it('deve lançar erro para nota logo acima do máximo (6)', () => {
    expect(() => new Review(makeValidData({ rating: 6 })))
      .toThrow('A nota deve estar entre 1 e 5!')
  })

  it('deve aceitar nota fracionária dentro do intervalo', () => {
    const review = new Review(makeValidData({ rating: 4.5 }))
    expect(review.rating).toBe(4.5)
  })

  it('deve lançar erro se a nota for undefined', () => {
    expect(() => new Review(makeValidData({ rating: undefined })))
      .toThrow('A nota da avaliação é obrigatória!')
  })

  it('deve lançar erro se a nota for null', () => {
    expect(() => new Review(makeValidData({ rating: null })))
      .toThrow('A nota da avaliação é obrigatória!')
  })

  it('deve lançar erro se a nota for string vazia', () => {
    expect(() => new Review(makeValidData({ rating: '' })))
      .toThrow('A nota da avaliação é obrigatória!')
  })

  it('deve lançar erro se a nota for um texto não numérico', () => {
    expect(() => new Review(makeValidData({ rating: 'cinco' })))
      .toThrow('A nota deve ser um número!')
  })

  it('deve lançar erro se o comentário não for informado', () => {
    expect(() => new Review(makeValidData({ comment: undefined })))
      .toThrow('O comentário da avaliação é obrigatório!')
  })

  it('deve lançar erro se o pet avaliado não for informado', () => {
    expect(() => new Review(makeValidData({ petId: undefined })))
      .toThrow('O pet avaliado é obrigatório!')
  })

  it('deve lançar erro se o autor não for informado', () => {
    expect(() => new Review(makeValidData({ authorId: undefined })))
      .toThrow('O autor da avaliação é obrigatório!')
  })

  it('deve criar instâncias independentes', () => {
    const a = new Review(makeValidData({ rating: 1 }))
    const b = new Review(makeValidData({ rating: 5 }))
    expect(a.rating).toBe(1)
    expect(b.rating).toBe(5)
    expect(a).not.toBe(b)
  })
})