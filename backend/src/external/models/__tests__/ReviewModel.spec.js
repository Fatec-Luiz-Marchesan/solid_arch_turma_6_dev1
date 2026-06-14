const ReviewModel = require('../ReviewModel')

describe('ReviewModel (schema Mongoose)', () => {
  it('deve persistir uma review válida', async () => {
    const doc = await ReviewModel.create({
      rating: 4,
      comment: 'Ótima experiência de adoção',
      petId: 'pet-1',
      authorId: 'user-1',
    })

    expect(doc._id).toBeDefined()
    expect(doc.rating).toBe(4)
    expect(doc.comment).toBe('Ótima experiência de adoção')
  }) 

  it('deve rejeitar uma review sem campos obrigatórios', async () => {
    await expect(ReviewModel.create({})).rejects.toThrow()
  })

  it('deve rejeitar rating maior que 5 (validação de máximo)', async () => {
    await expect(
      ReviewModel.create({
        rating: 6,
        comment: 'Nota inválida',
        petId: 'pet-1',
        authorId: 'user-1',
      })
    ).rejects.toThrow()
  })

  it('deve rejeitar rating menor que 1 (validação de mínimo)', async () => {
    await expect(
      ReviewModel.create({
        rating: 0,
        comment: 'Nota inválida',
        petId: 'pet-1',
        authorId: 'user-1',
      })
    ).rejects.toThrow()
  })
})
