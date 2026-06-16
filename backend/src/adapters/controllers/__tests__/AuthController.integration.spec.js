const request = require('supertest')
const app = require('../../../external/frameworks/app')

describe('AuthController (Integração - Login)', () => {

    it('POST /auth/login deve falhar com 422 para credenciais inválidas', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'inexistente@teste.com',
                password: 'wrongpassword'
            })
        expect(res.status).toBe(422)
    })

    it('POST /auth/login deve falhar se o email estiver faltando', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ password: 'password123' })

        expect(res.status).toBe(422)
    })
})