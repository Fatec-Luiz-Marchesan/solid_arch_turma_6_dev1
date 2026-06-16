const request = require('supertest')
const app = require('../../../external/frameworks/app')

describe('Contrato da API de Event (integração)', () => {
    const futureStart = new Date(Date.now() + 86400000).toISOString()
    const futureEnd = new Date(Date.now() + 172800000).toISOString()

    const validEvent = {
        title: 'Feira de Adoção',
        startsAt: futureStart,
        endsAt: futureEnd,
        organizerId: 'ong-123',
        location: 'Parque Central',
        capacity: 50,
        category: 'meetup',
    }

    it('POST /events/create deve agendar uma feira de adoção e retornar 201', async () => {
        const res = await request(app).post('/events/create').send(validEvent)

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('event')
        expect(res.body.event.title).toBe('Feira de Adoção')
    })

    it('POST /events/create sem título deve retornar 422', async () => {
        const res = await request(app)
            .post('/events/create')
            .send({ ...validEvent, title: undefined })

        expect(res.status).toBe(422)
        expect(res.body.message).toBe('O título do evento é obrigatório!')
    })

    it('POST /events/create com capacidade abaixo de 1 deve retornar 422', async () => {
        const res = await request(app)
            .post('/events/create')
            .send({ ...validEvent, capacity: 0 })

        expect(res.status).toBe(422)
        expect(res.body.message).toBe('A capacidade mínima do evento é 1!')
    })

    it('POST /events/create com data de inicio no passado deve retornar 422', async () => {
        const pastDate = new Date(Date.now() - 86400000).toISOString()
        const res = await request(app)
            .post('/events/create')
            .send({ ...validEvent, startsAt: pastDate })

        expect(res.status).toBe(422)
        expect(res.body.message).toBe('O evento não pode começar no passado!')
    })
})