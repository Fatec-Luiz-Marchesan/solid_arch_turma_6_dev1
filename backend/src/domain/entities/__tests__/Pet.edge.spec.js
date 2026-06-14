const { Pet } = require('../Pet')

describe('Entidade Pet (cenários de borda)', () => {
  const makeValidData = (overrides = {}) => ({
    name: 'Rex',
    age: 2,
    weight: 8,
    color: 'preto',
    images: ['rex.jpg'],
    user: { _id: 'u1', name: 'Dono' },
    ...overrides,
  })

  // ---- Borda de "ausência" para idade e peso ----
  // A entidade trata undefined, null e '' como "não informado".

  it('deve lançar erro se a idade for null', () => {
    expect(() => new Pet(makeValidData({ age: null })))
      .toThrow('A idade é obrigatória!')
  })

  it('deve lançar erro se a idade for string vazia', () => {
    expect(() => new Pet(makeValidData({ age: '' })))
      .toThrow('A idade é obrigatória!')
  })

  it('deve lançar erro se o peso for null', () => {
    expect(() => new Pet(makeValidData({ weight: null })))
      .toThrow('O peso é obrigatório!')
  })

  it('deve lançar erro se o peso for string vazia', () => {
    expect(() => new Pet(makeValidData({ weight: '' })))
      .toThrow('O peso é obrigatório!')
  })

  // ---- Valor zero: a regra atual ACEITA idade/peso zero (só rejeita ausência) ----

  it('deve aceitar idade igual a zero (recém-nascido)', () => {
    const pet = new Pet(makeValidData({ age: 0 }))
    expect(pet.age).toBe(0)
  })

  it('deve aceitar peso fracionário pequeno', () => {
    const pet = new Pet(makeValidData({ weight: 0.5 }))
    expect(pet.weight).toBe(0.5)
  })

  // ---- Múltiplas imagens ----

  it('deve preservar todas as imagens quando há mais de uma', () => {
    const images = ['a.jpg', 'b.jpg', 'c.jpg']
    const pet = new Pet(makeValidData({ images }))
    expect(pet.images).toHaveLength(3)
    expect(pet.images).toEqual(images)
  })

  // ---- Campo available ----

  it('deve respeitar available = false quando informado explicitamente', () => {
    const pet = new Pet(makeValidData({ available: false }))
    expect(pet.available).toBe(false)
  })

  it('deve manter available = true quando informado explicitamente', () => {
    const pet = new Pet(makeValidData({ available: true }))
    expect(pet.available).toBe(true)
  })

  // ---- Campos opcionais de relacionamento ----

  it('deve preservar os dados do usuário dono', () => {
    const user = { _id: 'u9', name: 'Ana' }
    const pet = new Pet(makeValidData({ user }))
    expect(pet.user).toEqual(user)
  })

  it('deve aceitar adopter como undefined por padrão', () => {
    const pet = new Pet(makeValidData())
    expect(pet.adopter).toBeUndefined()
  })

  it('deve preservar o adopter quando informado', () => {
    const adopter = { _id: 'a1', name: 'Adotante' }
    const pet = new Pet(makeValidData({ adopter }))
    expect(pet.adopter).toEqual(adopter)
  })
})