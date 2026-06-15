const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../../external/frameworks/app')
const VaccineModel = require('../../../external/models/VaccineModel')

describe('VaccineController integração', () => {
  beforeEach(async () => {
    await VaccineModel.deleteMany({})
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it('POST /v2/vaccines deve criar uma vacina', async () => {
    const res = await request(app)
      .post('/v2/vaccines')
      .send({
        name: 'Antirrábica',
        manufacturer: 'VetLab',
        description: 'Vacina contra raiva',
        requiredDoses: 1,
        intervalDays: 0,
      })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.name).toBe('Antirrábica')
    expect(res.body.manufacturer).toBe('VetLab')
  })

  it('POST /v2/vaccines deve rejeitar vacina sem nome', async () => {
    const res = await request(app)
      .post('/v2/vaccines')
      .send({
        manufacturer: 'VetLab',
        requiredDoses: 1,
      })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('O nome da vacina é obrigatório!')
  })

  it('POST /v2/vaccines deve sanitizar espaços e caracteres de controle', async () => {
  const res = await request(app)
    .post('/v2/vaccines')
    .send({
      name: '  Antirrábica\u0000  ',
      manufacturer: '  VetLab\u0007  ',
      description: '  Vacina contra raiva\u001F  ',
      requiredDoses: 1,
      intervalDays: 0,
    })

  expect(res.status).toBe(201)
  expect(res.body.name).toBe('Antirrábica')
  expect(res.body.manufacturer).toBe('VetLab')
  expect(res.body.description).toBe('Vacina contra raiva')
})

  it('GET /v2/vaccines deve listar vacinas', async () => {
    await VaccineModel.create({
      name: 'Antirrábica',
      manufacturer: 'VetLab',
      description: 'Vacina contra raiva',
      requiredDoses: 1,
      intervalDays: 0,
    })

    const res = await request(app).get('/v2/vaccines')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(1)
  })

  it('GET /v2/vaccines/:id deve buscar vacina por id', async () => {
    const vaccine = await VaccineModel.create({
      name: 'V10',
      manufacturer: 'PetLab',
      description: 'Vacina múltipla',
      requiredDoses: 3,
      intervalDays: 21,
    })

    const res = await request(app).get(`/v2/vaccines/${vaccine._id}`)

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('V10')
    expect(res.body.manufacturer).toBe('PetLab')
  })

  it('PATCH /v2/vaccines/:id deve atualizar vacina', async () => {
    const vaccine = await VaccineModel.create({
      name: 'V10',
      manufacturer: 'PetLab',
      description: 'Vacina múltipla',
      requiredDoses: 3,
      intervalDays: 21,
    })

    const res = await request(app)
      .patch(`/v2/vaccines/${vaccine._id}`)
      .send({
        name: 'V8',
        requiredDoses: 2,
      })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('V8')
    expect(res.body.requiredDoses).toBe(2)
  })

  it('DELETE /v2/vaccines/:id deve remover vacina', async () => {
    const vaccine = await VaccineModel.create({
      name: 'V10',
      manufacturer: 'PetLab',
      description: 'Vacina múltipla',
      requiredDoses: 3,
      intervalDays: 21,
    })

    const res = await request(app).delete(`/v2/vaccines/${vaccine._id}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Vacina removida com sucesso!')

    const vaccineDeleted = await VaccineModel.findById(vaccine._id)
    expect(vaccineDeleted).toBeNull()
  })
})