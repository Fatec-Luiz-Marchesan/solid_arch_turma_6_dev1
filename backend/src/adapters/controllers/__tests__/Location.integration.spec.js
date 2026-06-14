const request = require('supertest')
const app = require('../../../external/frameworks/app')

describe('Contrato da API de Location (integração)', () => {
    const validLocation = {
        name: 'Parque Central',
        latitude: -23.55,
        longitude: -46.63,
    }

    it('POST /locations/create deve criar uma localização e retornar 201', async () => {
        const res = await request(app).post('/locations/create').send(validLocation)

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('location')
        expect(res.body.location.name).toBe(validLocation.name)
    })

    it('POST /locations/create sem nome deve retornar 422', async () => {
        const res = await request(app)
            .post('/locations/create')
            .send({ ...validLocation, name: undefined})
        
        expect(res.status).toBe(422)
        expect(res.body).toHaveProperty('message')
    })

    it('POST /locations/create com coordenadas não numéricas deve retornar 422', async () => {
        const res = await request(app)
            .post('/locations/create')
            .send({ name: 'Local X', latitude: 'abc', longitude: 'def'})

        expect(res.status).toBe(422)
        expect(res.body).toHaveProperty('message')
    })

    it('GET /locations/nearby com parâmetros válidos deve retornar 200 e uma lista', async () => {
        await request(app).post('/locations/create').send(validLocation)

        const res = await request(app)
            .get('/locations/nearby')
            .query({ lat: -23.55, lng: -46.63, radius: 10})

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('locations')
        expect(Array.isArray(res.body.locations)).toBe(true)
    })

    it('GET /locations/nearby com raio inválido (0) deve retornar 422', async () => {
        const res = await request(app)
            .get('/locations/nearby')
            .query({ lat: -23.55, lng: -46.63, radius: 0 })

        expect(res.status).toBe(422)
        expect(res.body).toHaveProperty('message')
    })
})