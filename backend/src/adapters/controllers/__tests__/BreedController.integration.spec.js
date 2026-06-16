const request = require('supertest')
const app = require('../../../external/frameworks/app')
const { BreedMongoRepository } = require('../../../external/repositories/BreedMongoRepository')

describe('Contrato da API de Breed (integração)', () => {
  const validBreed = {
    name: 'Labrador',
    species: 'dog',
    description: 'Cão dócil e brincalhão',
    size: 'large',
  }

  it('POST /breeds/create deve criar uma raça e retornar 201', async () => {
    const res = await request(app).post('/breeds/create').send(validBreed)

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('breed')
    expect(res.body.breed.name).toBe('Labrador')
    expect(res.body.breed.species).toBe('dog')
    expect(res.body.breed.size).toBe('large')
    expect(res.body.breed).toHaveProperty('id')
  })

  it('POST /breeds/create sem nome deve retornar 422', async () => {
    const res = await request(app)
      .post('/breeds/create')
      .send({ species: 'dog', description: 'sem nome' })

    expect(res.status).toBe(422)
    expect(res.body.message).toBe('O nome da raça é obrigatório!')
  })

  it('POST /breeds/create sem espécie deve retornar 422', async () => {
    const res = await request(app)
      .post('/breeds/create')
      .send({ name: 'Sem Especie' })

    expect(res.status).toBe(422)
    expect(res.body.message).toBe('A espécie é obrigatória!')
  })

  it('POST /breeds/create com espécie inválida deve retornar 422', async () => {
    const res = await request(app)
      .post('/breeds/create')
      .send({ name: 'Dragão', species: 'dinossauro' })

    expect(res.status).toBe(422)
    expect(res.body.message).toBe('Espécie inválida!')
  })

  it('POST /breeds/create com porte inválido deve retornar 422', async () => {
    const res = await request(app)
      .post('/breeds/create')
      .send({ name: 'Raça X', species: 'dog', size: 'gigante' })

    expect(res.status).toBe(422)
    expect(res.body.message).toBe('Porte inválido!')
  })

  it('POST /breeds/create com nome duplicado deve retornar 409', async () => {
    await request(app).post('/breeds/create').send(validBreed)
    const res = await request(app).post('/breeds/create').send(validBreed)

    expect(res.status).toBe(409)
    expect(res.body.message).toBe('Já existe uma raça com este nome!')
  })

  it('GET /breeds deve retornar 200 e a lista de raças', async () => {
    await request(app).post('/breeds/create').send(validBreed)
    const res = await request(app).get('/breeds')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('breeds')
    expect(Array.isArray(res.body.breeds)).toBe(true)
    expect(res.body.breeds).toHaveLength(1)
    expect(res.body.breeds[0].name).toBe('Labrador')
    expect(res.body.breeds[0].size).toBe('large')
  })

  it('POST /breeds/create deve retornar 500 em caso de erro interno não mapeado', async () => {
    jest.spyOn(BreedMongoRepository.prototype, 'create').mockRejectedValueOnce(new Error('Erro Genérico DB'))

    const res = await request(app)
      .post('/breeds/create')
      .send(validBreed)

    expect(res.status).toBe(500)
    expect(res.body.message).toBe('Erro interno ao criar raça.')

    jest.restoreAllMocks()
  })
})

