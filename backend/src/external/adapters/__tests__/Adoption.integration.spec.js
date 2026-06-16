const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../../external/frameworks/app')
const Pet = require('../../../../models/Pet')
const { makeAuthToken } = require('./helpers/test-factory')

describe('Contrato da API de Adoption (integração)', () => {
  const ownerId = new mongoose.Types.ObjectId().toString()
  const requesterId = new mongoose.Types.ObjectId().toString()

  const ownerToken = makeAuthToken(ownerId, 'Dono')
  const requesterToken = makeAuthToken(requesterId, 'Adotante')

  async function createPet(available = true) {
    const pet = await Pet.create({
      name: 'Rex',
      age: 2,
      weight: 8,
      color: 'preto',
      images: ['rex.jpg'],
      available,
      user: { _id: ownerId, name: 'Dono' },
    })
    return pet._id.toString()
  }

  it('POST /adoptions/request sem token deve retornar 401', async () => {
    const res = await request(app).post('/adoptions/request').send({ petId: 'x' })
    expect(res.status).toBe(401)
  })

  it('POST /adoptions/request deve criar solicitação e retornar 201', async () => {
    const petId = await createPet()
    const res = await request(app)
      .post('/adoptions/request')
      .set('Authorization', `Bearer ${requesterToken}`)
      .send({ petId, message: 'Tenho quintal grande.' })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('adoption')
    expect(res.body.adoption.status).toBe('pending')
    expect(res.body.adoption.requester).toBe(requesterId)
  })

  it('POST /adoptions/request para pet inexistente deve retornar 404', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()
    const res = await request(app)
      .post('/adoptions/request')
      .set('Authorization', `Bearer ${requesterToken}`)
      .send({ petId: fakeId })

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Pet não encontrado!')
  })

  it('POST /adoptions/request do próprio dono deve retornar 422', async () => {
    const petId = await createPet()
    const res = await request(app)
      .post('/adoptions/request')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ petId })

    expect(res.status).toBe(422)
    expect(res.body.message).toBe('O dono não pode adotar o próprio pet!')
  })

  it('PATCH /adoptions/:id/decision deve aprovar quando solicitado pelo dono', async () => {
    const petId = await createPet()
    const created = await request(app)
      .post('/adoptions/request')
      .set('Authorization', `Bearer ${requesterToken}`)
      .send({ petId })

    const adoptionId = created.body.adoption.id
    const res = await request(app)
      .patch(`/adoptions/${adoptionId}/decision`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ decision: 'approved' })

    expect(res.status).toBe(200)
    expect(res.body.adoption.status).toBe('approved')
  })

  it('PATCH /adoptions/:id/decision por quem não é dono deve retornar 403', async () => {
    const petId = await createPet()
    const created = await request(app)
      .post('/adoptions/request')
      .set('Authorization', `Bearer ${requesterToken}`)
      .send({ petId })

    const adoptionId = created.body.adoption.id
    const intruderToken = makeAuthToken(new mongoose.Types.ObjectId().toString(), 'Intruso')
    const res = await request(app)
      .patch(`/adoptions/${adoptionId}/decision`)
      .set('Authorization', `Bearer ${intruderToken}`)
      .send({ decision: 'approved' })

    expect(res.status).toBe(403)
  })

  it('GET /adoptions/mine deve listar adoções do solicitante', async () => {
    const petId = await createPet()
    await request(app)
      .post('/adoptions/request')
      .set('Authorization', `Bearer ${requesterToken}`)
      .send({ petId })

    const res = await request(app)
      .get('/adoptions/mine')
      .set('Authorization', `Bearer ${requesterToken}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.adoptions)).toBe(true)
    expect(res.body.adoptions).toHaveLength(1)
  })
})