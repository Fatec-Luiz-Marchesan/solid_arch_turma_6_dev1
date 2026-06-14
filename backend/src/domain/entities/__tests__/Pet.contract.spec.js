const { Pet } = require('../Pet')

describe('Entidade Pet (contratos e precedência de validação)', () => {
  const makeValidData = (overrides = {}) => ({
    name: 'Rex',
    age: 2,
    weight: 8,
    color: 'preto',
    images: ['rex.jpg'],
    user: { _id: 'u1', name: 'Dono' },
    ...overrides,
  })


  it('deve priorizar o erro de nome quando vários campos faltam', () => {
    expect(() => new Pet({}))
      .toThrow('O nome é obrigatório!')
  })

  it('deve cobrar a idade antes do peso quando ambos faltam', () => {
    expect(() => new Pet(makeValidData({ age: undefined, weight: undefined })))
      .toThrow('A idade é obrigatória!')
  })

  it('deve cobrar o peso antes da cor quando ambos faltam', () => {
    expect(() => new Pet(makeValidData({ weight: undefined, color: undefined })))
      .toThrow('O peso é obrigatório!')
  })

  it('deve cobrar a cor antes da imagem quando ambas faltam', () => {
    expect(() => new Pet(makeValidData({ color: undefined, images: undefined })))
      .toThrow('A cor é obrigatória!')
  })


  it('deve aceitar idade fornecida como string não vazia', () => {
    const pet = new Pet(makeValidData({ age: '3' }))
    expect(pet.age).toBe('3')
  })

  it('deve aceitar peso fornecido como string não vazia', () => {
    const pet = new Pet(makeValidData({ weight: '10' }))
    expect(pet.weight).toBe('10')
  })


  it('deve preservar a description quando informada', () => {
    const pet = new Pet(makeValidData({ description: 'Dócil e brincalhão' }))
    expect(pet.description).toBe('Dócil e brincalhão')
  })


  it('deve aceitar exatamente uma imagem', () => {
    const pet = new Pet(makeValidData({ images: ['unica.jpg'] }))
    expect(pet.images).toHaveLength(1)
  })


  it('deve aceitar nome composto com espaços', () => {
    const pet = new Pet(makeValidData({ name: 'Rex da Silva' }))
    expect(pet.name).toBe('Rex da Silva')
  })

  it('deve aceitar cor com múltiplas palavras', () => {
    const pet = new Pet(makeValidData({ color: 'preto e branco' }))
    expect(pet.color).toBe('preto e branco')
  })

  it('deve expor exatamente os campos esperados em um pet válido', () => {
    const pet = new Pet(makeValidData({ description: 'teste' }))
    expect(pet).toEqual(
      expect.objectContaining({
        name: 'Rex',
        age: 2,
        weight: 8,
        color: 'preto',
        images: ['rex.jpg'],
        description: 'teste',
        available: true,
      })
    )
  })
})