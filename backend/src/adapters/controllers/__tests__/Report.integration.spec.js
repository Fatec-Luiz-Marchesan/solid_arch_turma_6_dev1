const request = require('supertest')
const app = require('../../../external/frameworks/app')

describe('Contrato da API de Report (integração)', () => {
    const validReport = {
        title: 'Anúncio suspeito',
        description: 'Pet sendo vendido invés de doado.',
        type: 'abuse',
        reporterId: 'user-1',
    }

    it('POST /reports/create deve criar um report e retornar 201', async () => {
        const res = await request(app).post('/reports/create').send(validReport)

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('report')
        expect(res.body.report.type).toBe('abuse')
        expect(res.body.report.status).toBe('open')
    })

    it('POST /reports/create com type inválido deve retornar 422', async () => {
        const res = await request(app)
            .post('/reports/create')
            .send({ ...validReport, type: 'inválido' })

        expect(res.status).toBe(422)
        expect(res.body.message).toBe('Tipo de report inválido!')
    })

    it('POST /reports/create com title não-string deve retornar 422', async () => {
        const res = await request(app)
            .post('/reports/create')
            .send({ ...validReport, title: 123})

        expect(res.status).toBe(422)
        expect(res.body.message).toBe('O título deve ser um texto!')
    })

    it('POST /reports/create sem description deve retornar 422', async () => {
        const { description, ...payload } = validReport

        const res = await request(app).post('/reports/create').send(payload)

        expect(res.status).toBe(422)
        expect(res.body).toHaveProperty('message')

    })
})