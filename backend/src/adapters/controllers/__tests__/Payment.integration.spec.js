const request = require('supertest')
const app = require('../../../external/frameworks/app')

describe('Contrato da API  de Payment (integração)', () => {
    const validPayment = {
        payer: 'Maria',
        amount: 100,
        currency: 'BRL',
    }

    it('POST /payments/create deve registrar um pagamento e retornar 201', async () => {
        const res = await request(app).post('/payments/create').send(validPayment)

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('payment')
        expect(res.body.payment.payer).toBe(validPayment.payer)
    })

    it('POST /payments/create deve nascer com status pending', async () => {
        const res = await request(app).post('/payments/create').send(validPayment)

        expect(res.status).toBe(201)
        expect(res.body.payment.status).toBe('pending')
    })

    it('POST /payments/create sem pagador deve retornar 422', async () => {
        const res = await request(app)
            .post('/payments/create')
            .send({ ...validPayment, payer: undefined })

        expect(res.status).toBe(422)
        expect(res.body).toHaveProperty('message')
    })

    it('POST /payments/create com valor <= 0 deve retornar 422', async () => {
        const res = await request(app)
            .post('/payments/create')
            .send({ ...validPayment, amount: 0 })

        expect(res.status).toBe(422)
        expect(res.body).toHaveProperty('message')
    })

    it('POST /payments/create com moeda não suportada deve retornar 422', async () => {
        const res = await request(app)
            .post('/payments/create')
            .send({ ...validPayment, currency: 'XYZ' })

        expect(res.status).toBe(422)
        expect(res.body).toHaveProperty('message')
    })

    it('POST /payments/:id/process com id inexistente deve retornar 404', async () => {
        const res = await request(app)
            .post('/payments/64b8f0c2e1a2b3c4d5e6f7a8/process')

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('message')
    })

    it('POST /payments/:id/process deve processar um pagamento pendente (200)', async () => {
        const created = await request(app).post('/payments/create').send(validPayment)
        const paymentId = created.body.payment.id

        const res = await request(app).post(`/payments/${paymentId}/process`)

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('payment')
        expect(['paid', 'failed']).toContain(res.body.payment.status)
    })

    it('POST /payments/:id/process duas vezes deve retornar 422 na segunda', async () => {
        const created = await request(app).post('/payments/create').send(validPayment)
        const paymentId = created.body.payment.id

        await request(app).post(`/payments/${paymentId}/process`)
        const res = await request(app).post(`/payments/${paymentId}/process`)

        expect(res.status).toBe(422)
        expect(res.body).toHaveProperty('message')
    })
})