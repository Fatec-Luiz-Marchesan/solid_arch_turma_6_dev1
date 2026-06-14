const request = require('supertest')

jest.mock('../../../external/repositories/DietMongoRepository', () => {
    return {
        DietMongoRepository: jest.fn().mockImplementation(() => ({
            create: jest.fn(async (data) => ({ _id: 'fake-id-123', ...data})),
        })),
    }
})

const app = require('../../../external/frameworks/app')

describe('Contrato da API de Diet (integração)', () => {
    const validDiet = {
        name: 'Dieta Premium',
        pet: 'pet-id-1',
        dailyCalories: 350,
        type: 'maintenance',
    }

    it('POST /diets/create deve criar uma dieta e retornar 201', async () => {
        const res = await request(app).post('/diets/create').send(validDiet)

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('message', 'Dieta cadastrada com sucesso!')
        expect(res.body).toHaveProperty('diet')
        expect(res.body.diet.name).toBe(validDiet.name)
    })

    it('POST /diets/create deve assumir o type "maintenance" quando não informado e retornar 201', async () => {
        const { type, ...payloadSemType } = validDiet
        
        const res = await request(app).post('/diets/create').send(payloadSemType)

        expect(res.status).toBe(201)
        expect(res.body.diet.type).toBe('maintenance')
    })

    it('POST /diets/create deve retornar 422 quando o name está ausente', async () => {
        const { name, ...payload } = validDiet
        
        const res = await request(app).post('/diets/create').send(payload)

        expect(res.status).toBe(422)
        expect(res.body).toHaveProperty('message')
    })

    it('POST /diets/create deve retornar 422 quando o pet está ausente', async () => {
        const { pet, ...payload } = validDiet
        
        const res = await request(app).post('/diets/create').send(payload)

        expect(res.status).toBe(422)
        expect(res.body).toHaveProperty('message')
    })

    it('POST /diets/create deve retornar 422 quando dailyCalories não é um número', async () => {      
        const res = await request(app)
            .post('/diets/create')
            .send({ ...validDiet, dailyCalories: 'abc' })

        expect(res.status).toBe(422)
        expect(res.body).toHaveProperty('message')
    })

    it('POST /diets/create deve retornar 422 quando dailyCalories está ausente', async () => {
        const { dailyCalories, ...payload } = validDiet
        
        const res = await request(app).post('/diets/create').send(payload)

        expect(res.status).toBe(422)
        expect(res.body).toHaveProperty('message')
    })

    it('POST /diets/create deve retornar 422 quando dailyCalories é <= 0', async () => {      
        const res = await request(app)
            .post('/diets/create')
            .send({ ...validDiet, dailyCalories: 0 })

        expect(res.status).toBe(422)
        expect(res.body).toHaveProperty('message')
    })

    it('POST /diets/create deve retornar 422 quando o type é inválido', async () => {      
        const res = await request(app)
            .post('/diets/create')
            .send({ ...validDiet, type: 'invalid-type' })

        expect(res.status).toBe(422)
        expect(res.body).toHaveProperty('message')
    })
})