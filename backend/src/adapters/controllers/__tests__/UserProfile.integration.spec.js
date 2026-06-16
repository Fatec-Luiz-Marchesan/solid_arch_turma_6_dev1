const request = require('supertest')
const app = require('../../../external/frameworks/app')
const { makeUserPayload } = require('./helpers/test-factory')

describe('Contrato GET /v2/users/profile/:id (integração)', () => {
    it('deve retornar 200 e o perfil sem a senha quando o usuário existe', async () => {
        // pré-condição: cria um usuário pela rota v2
        const payload = makeUserPayload()
        const created = await request(app).post('/v2/users/register').send(payload)
        const userId = created.body.userId

        const res = await request(app).get(`/v2/users/profile/${userId}`)

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('user')
        expect(res.body.user.email).toBe(payload.email)
        expect(res.body.user.password).toBeUndefined()
    })

    it('deve retornar 404 quando o usuário não existe', async () => {
        const res = await request(app).get('/v2/users/profile/64b8f0c2e1a2b3c4d5e6f7a8')
        expect(res.status).toBe(404)
    })
})