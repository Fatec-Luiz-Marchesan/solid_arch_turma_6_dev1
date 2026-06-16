const request = require('supertest')
const app = require('../../../external/frameworks/app')

describe('Contrato da API de Report (integração)', () => {
    const validReport = {
        title: 'Anúncio suspeito',
        description: 'Pet sendo vendido invés de doado.',
        type: 'abuse',
        reporterId: 'user-1',
    }

    describe('POST /reports/create (rota legada)', () => {
        it('deve criar um report e retornar 201', async () => {
            const res = await request(app).post('/reports/create').send(validReport)

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('report')
            expect(res.body.report.type).toBe('abuse')
            expect(res.body.report.status).toBe('open')
        })

        it('com type inválido deve retornar 422', async () => {
            const res = await request(app)
                .post('/reports/create')
                .send({ ...validReport, type: 'inválido' })

            expect(res.status).toBe(422)
            expect(res.body.message).toBe('Tipo de report inválido!')
        })

        it('com title não-string deve retornar 422', async () => {
            const res = await request(app)
                .post('/reports/create')
                .send({ ...validReport, title: 123 })

            expect(res.status).toBe(422)
            expect(res.body.message).toBe('O título deve ser um texto!')
        })

        it('sem description deve retornar 422', async () => {
            const { description, ...payload } = validReport

            const res = await request(app).post('/reports/create').send(payload)

            expect(res.status).toBe(422)
            expect(res.body).toHaveProperty('message')
        })
    })

    describe('POST /reports (rota RESTful)', () => {
        it('deve criar um report e retornar 201', async () => {
            const res = await request(app).post('/reports').send(validReport)

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('report')
            expect(res.body.report.type).toBe('abuse')
            expect(res.body.report.status).toBe('open')
        })

        it('deve retornar priority no report criado', async () => {
            const res = await request(app).post('/reports').send(validReport)

            expect(res.status).toBe(201)
            expect(res.body.report).toHaveProperty('priority')
            expect(res.body.report.priority).toBe('high')
        })

        it('deve retornar createdAt e updatedAt no report criado', async () => {
            const res = await request(app).post('/reports').send(validReport)

            expect(res.status).toBe(201)
            expect(res.body.report).toHaveProperty('createdAt')
            expect(res.body.report).toHaveProperty('updatedAt')
        })

        it('com type inválido deve retornar 422', async () => {
            const res = await request(app)
                .post('/reports')
                .send({ ...validReport, type: 'inválido' })

            expect(res.status).toBe(422)
            expect(res.body.message).toBe('Tipo de report inválido!')
        })

        it('sem description deve retornar 422', async () => {
            const { description, ...payload } = validReport

            const res = await request(app).post('/reports').send(payload)

            expect(res.status).toBe(422)
            expect(res.body).toHaveProperty('message')
        })

        it('deve ignorar chaves extras no payload (mass-assignment mitigation)', async () => {
            const payloadWithExtras = {
                ...validReport,
                admin: true,
                status: 'closed',
                __proto__: { polluted: true },
                extraField: 'valor_injetado',
            }

            const res = await request(app).post('/reports').send(payloadWithExtras)

            expect(res.status).toBe(201)
            expect(res.body.report.status).toBe('open')
            // campos extras não devem aparecer no retorno
            expect(res.body.report.admin).toBeUndefined()
            expect(res.body.report.extraField).toBeUndefined()
        })

        it('não deve expor _id ou __v internos do Mongo na resposta', async () => {
            const res = await request(app).post('/reports').send(validReport)

            expect(res.status).toBe(201)
            expect(res.body.report._id).toBeUndefined()
            expect(res.body.report.__v).toBeUndefined()
        })
    })

    describe('GET /reports (listagem RESTful)', () => {
        it('deve retornar 200 e um array de reports', async () => {
            const res = await request(app).get('/reports')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('reports')
            expect(Array.isArray(res.body.reports)).toBe(true)
        })

        it('cada report listado deve conter os campos serializados', async () => {
            // Garante que há ao menos um report criado antes de listar
            await request(app).post('/reports').send(validReport)

            const res = await request(app).get('/reports')

            expect(res.status).toBe(200)
            expect(res.body.reports.length).toBeGreaterThan(0)

            const report = res.body.reports[0]
            expect(report).toHaveProperty('id')
            expect(report).toHaveProperty('title')
            expect(report).toHaveProperty('description')
            expect(report).toHaveProperty('type')
            expect(report).toHaveProperty('status')
            expect(report).toHaveProperty('priority')
            expect(report).toHaveProperty('reporterId')
            expect(report).toHaveProperty('createdAt')
            expect(report).toHaveProperty('updatedAt')
        })

        it('reports listados não devem expor _id ou __v do Mongo', async () => {
            await request(app).post('/reports').send(validReport)

            const res = await request(app).get('/reports')

            expect(res.status).toBe(200)
            res.body.reports.forEach((report) => {
                expect(report._id).toBeUndefined()
                expect(report.__v).toBeUndefined()
            })
        })
    })
})