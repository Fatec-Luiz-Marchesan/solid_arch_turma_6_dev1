const request = require('supertest')
const app = require('../../../external/frameworks/app')

describe('Contrato da API de Review (integração)', () => {
    const validReview = {
        rating: 5,
        comment: 'Pet maravilhoso, adoção tranquila!',
        petId: 'pet-1',
        authorId: 'user-1',
    }

    it('POST /reviews/create deve criar uma avaliação e retornar 201', async () => {
        const res = await request(app).post('/reviews/create').send(validReview)

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('review')
        expect(res.body.review.rating).toBe(5)
    })

    it('POST /reviews/create sem nota deve retornar 422', async () => {
        const res = await request(app)
            .post('/reviews/create')
            .send({ ...validReview, rating: undefined })

        expect(res.status).toBe(422)
        expect(res.body.message).toBe('A nota da avaliação é obrigatória!')
    })

    it('POST /reviews/create com nota fora do intervalo deve retornar 422', async () => {
        const res = await request(app)
            .post('/reviews/create')
            .send({ ...validReview, rating: 6 })

        expect(res.status).toBe(422)
        expect(res.body.message).toBe('A nota deve estar entre 1 e 5!')
    })

    it('POST /reviews/create sem comentário deve retornar 422', async () => {
        const res = await request(app)
            .post('/reviews/create')
            .send({ ...validReview, comment: undefined })

        expect(res.status).toBe(422)
        expect(res.body.message).toBe('O comentário da avaliação é obrigatório!')
    })

    it('GET /reviews deve retornar 200 e a lista de avaliações', async () => {
        await request(app).post('/reviews/create').send(validReview)

        const res = await request(app).get('/reviews')

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('reviews')
        expect(Array.isArray(res.body.reviews)).toBe(true)
    })
})