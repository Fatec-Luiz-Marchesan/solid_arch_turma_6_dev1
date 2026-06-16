const request = require('supertest')
const app = require('../../../external/frameworks/app')

    describe('Contrato da API de User (integração)', () => {
        const validUser = {
            name: 'Maria',
            email: 'maria@email.com',
            phone: '11999999999',
            password: '123456',
            confirmpassword: '123456',
        }

        it('POST /v2/users/register deve criar usuário e retornar token (201)', async () => {
            const res = await request(app).post('/v2/users/register').send(validUser)

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('token')
            expect(res.body).toHaveProperty('userId')
            expect(res.body.message).toBe('Você está autenticado!')
        })

        it('POST /v2/users/register sem nome deve retornar 422', async () => {
            const res = await request(app)
                .post('/v2/users/register')
                .send({ ...validUser, name: undefined }  )

            expect(res.status).toBe(422)
            expect(res.body.message).toBe('O nome é obrigatório!')
        })

        it('POST /v2/users/register com senhas diferentes deve retornar 422', async () => {
            const res = await request(app)
                .post('/v2/users/register')
                .send({ ...validUser, confirmpassword: 'outra'})

            expect(res.status).toBe(422)
            expect(res.body.message).toBe('A senha e a confirmação precisam ser iguais!')
        })

        it('POST /v2/users/register com senha menor que 6 caracteres deve retornar 422', async () => {
            const res = await request(app)
                .post('/v2/users/register')
                .send({ ...validUser, password: '123', confirmpassword: '123' })
            
            expect(res.status).toBe(422)
            expect(res.body.message).toBe('A senha deve ter no mínimo 6 caracteres!')
        })

        it('POST /v2/users/register com email duplicado deve retornar 422', async () => {
            await request(app).post('/v2/users/register').send(validUser)
            const res = await request(app).post('/v2/users/register').send(validUser)

            expect(res.status).toBe(422)
            expect(res.body.message).toBe('Por favor, utilize outro e-mail!')
        })

        it('o retorno do cadastro nunca deve expor a senha', async () => {
            const res = await request(app).post('/v2/users/register').send(validUser)
            expect(res.body.password).toBeUndefined()
        })
    })