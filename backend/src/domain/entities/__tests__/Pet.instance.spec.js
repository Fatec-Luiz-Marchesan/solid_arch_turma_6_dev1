const { Pet } = require('../Pet')

describe('Entidade Pet (instâncias, isolamento e robustez)', () => {
  const makeValidData = (overrides = {}) => ({
    name: 'Rex',
    age: 2,
    weight: 8,
    color: 'preto',
    images: ['rex.jpg'],
    user: { _id: 'u1', name: 'Dono' },
    ...overrides,
  })


  it('deve criar instâncias independentes a partir de dados distintos', () => {
    const a = new Pet(makeValidData({ name: 'Rex' }))
    const b = new Pet(makeValidData({ name: 'Bidu' }))
    expect(a.name).toBe('Rex')
    expect(b.name).toBe('Bidu')
    expect(a).not.toBe(b)
  })

  it('alterar uma instância não deve afetar outra', () => {
    const a = new Pet(makeValidData())
    const b = new Pet(makeValidData())
    a.available = false
    expect(b.available).toBe(true)
  })

  it('cada Pet deve ser instância de Pet', () => {
    const pet = new Pet(makeValidData())
    expect(pet).toBeInstanceOf(Pet)
  })


  it('deve manter o array images com os mesmos elementos passados', () => {
    const images = ['a.jpg', 'b.jpg']
    const pet = new Pet(makeValidData({ images }))
    expect(pet.images).toEqual(['a.jpg', 'b.jpg'])
  })

  it('deve refletir no pet alterações feitas no array original (mesma referência)', () => {
    const images = ['a.jpg']
    const pet = new Pet(makeValidData({ images }))
    images.push('b.jpg')
    expect(pet.images).toHaveLength(2)
  })


  it('deve preservar available = null quando informado (não vira true)', () => {
    const pet = new Pet(makeValidData({ available: null }))
    expect(pet.available).toBeNull()
  })

  it('deve preservar available como string quando informado', () => {
    const pet = new Pet(makeValidData({ available: 'sim' }))
    expect(pet.available).toBe('sim')
  })


  it('não deve incluir campos não declarados no objeto final', () => {
    const pet = new Pet(makeValidData({ campoExtra: 'ignorar' }))
    expect(pet.campoExtra).toBeUndefined()
  })

  it('deve manter user e adopter como objetos distintos quando ambos informados', () => {
    const user = { _id: 'u1', name: 'Dono' }
    const adopter = { _id: 'a1', name: 'Adotante' }
    const pet = new Pet(makeValidData({ user, adopter }))
    expect(pet.user).toEqual(user)
    expect(pet.adopter).toEqual(adopter)
    expect(pet.user).not.toEqual(pet.adopter)
  })

  it('deve criar um pet válido mesmo sem description nem adopter', () => {
    const data = makeValidData()
    delete data.adopter
    const pet = new Pet(data)
    expect(pet.description).toBeUndefined()
    expect(pet.adopter).toBeUndefined()
    expect(pet.name).toBe('Rex')
  })
})