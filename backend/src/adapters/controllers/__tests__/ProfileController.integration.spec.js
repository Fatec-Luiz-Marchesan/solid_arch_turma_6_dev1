const request = require('supertest')
const app = require('../../../external/frameworks/app')
const { makeAuthToken, makeUserPayload } = require('./helpers/test-factory')
const { ProfileMongoRepository } = require('../../../external/repositories/ProfileMongoRepository')

describe('Contrato POST /v2/users/profile (integração)', () => {
  async function createUserAndToken() {
    const payload = makeUserPayload()
    const created = await request(app).post('/v2/users/register').send(payload)
    const userId = created.body.userId
    const token = makeAuthToken(userId)
    return { userId, token }
  }

  it('deve retornar 401 quando não há token (rota protegida)', async () => {
    const res = await request(app)
      .post('/v2/users/profile')
      .send({ bio: 'Sem token', phone: '11999999999' })

    expect(res.status).toBe(401)
  })

  it('deve criar o profile e retornar 201 quando autenticado', async () => {
    const { userId, token } = await createUserAndToken()

    const res = await request(app)
      .post('/v2/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ user: userId, bio: 'Amo animais', phone: '11999999999' })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('profile')
    expect(res.body.profile.user).toBe(userId)
    expect(res.body.profile.bio).toBe('Amo animais')
    expect(res.body.profile).toHaveProperty('id')
  })

  it('deve retornar 422 quando a bio passa de 300 caracteres', async () => {
    const { userId, token } = await createUserAndToken()

    const res = await request(app)
      .post('/v2/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ user: userId, bio: 'A'.repeat(301), phone: '11999999999' })

    expect(res.status).toBe(422)
    expect(res.body.message).toBe('A bio e muito longa!')
  })

  it('deve retornar 409 quando o usuário já possui um profile', async () => {
    const { userId, token } = await createUserAndToken()
    const payload = { user: userId, bio: 'Primeiro', phone: '11999999999' }

    await request(app)
      .post('/v2/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)

    const res = await request(app)
      .post('/v2/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)

    expect(res.status).toBe(409)
    expect(res.body.message).toBe('Este usuario ja possui um profile!')
  })

  it('deve retornar 422 quando o telefone tem menos de 10 dígitos', async () => {
    const { userId, token } = await createUserAndToken()

    const res = await request(app)
      .post('/v2/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ user: userId, bio: 'Amo animais', phone: '123456789' })

    expect(res.status).toBe(422)
    expect(res.body.message).toBe('O telefone deve ter no mínimo 10 dígitos!')
  })

  it('deve retornar 500 em caso de erro interno não mapeado no banco', async () => {
    const { userId, token } = await createUserAndToken()

    jest.spyOn(ProfileMongoRepository.prototype, 'create').mockRejectedValueOnce(new Error('Erro Crítico DB'))

    const res = await request(app)
      .post('/v2/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ user: userId, bio: 'Tentando salvar', phone: '11999999999' })

    expect(res.status).toBe(500)
    expect(res.body.message).toBe('Erro interno ao criar profile.')

    jest.restoreAllMocks()
  })
})