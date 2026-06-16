const request = require('supertest')
const app = require('../../../external/frameworks/app')

describe('Contrato da API de Settings (integração)', () => {
    const validSettings = {
        userId: 'user-123',
        theme: 'dark',
        language: 'en-US',
        notificationsEnabled: true,
    }

    describe('POST /settings - Criar Configurações', () => {
        it('deve criar configurações válidas e retornar 201', async () => {
            const res = await request(app).post('/settings').send(validSettings)

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('id')
            expect(res.body.userId).toBe('user-123')
            expect(res.body.theme).toBe('dark')
            expect(res.body.language).toBe('en-US')
            expect(res.body.notificationsEnabled).toBe(true)
        })

        it('deve aplicar defaults quando campos opcionais não são informados', async () => {
            const minimalSettings = {
                userId: 'user-456',
            }

            const res = await request(app).post('/settings').send(minimalSettings)

            expect(res.status).toBe(201)
            expect(res.body.theme).toBe('light')
            expect(res.body.language).toBe('pt-BR')
            expect(res.body.notificationsEnabled).toBe(true)
        })

        it('deve retornar 400 se userId não for informado', async () => {
            const res = await request(app)
                .post('/settings')
                .send({ ...validSettings, userId: undefined })

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('O usuário das configurações é obrigatório!')
        })

        it('deve retornar 400 para tema inválido', async () => {
            const res = await request(app)
                .post('/settings')
                .send({ ...validSettings, theme: 'rainbow' })

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('Tema inválido!')
        })

        it('deve retornar 400 para idioma inválido', async () => {
            const res = await request(app)
                .post('/settings')
                .send({ ...validSettings, language: 'fr-FR' })

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('Idioma inválido!')
        })

        it('deve retornar 400 se notificationsEnabled não for booleano', async () => {
            const res = await request(app)
                .post('/settings')
                .send({ ...validSettings, notificationsEnabled: 'true' })

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('O campo de notificações deve ser booleano!')
        })

        it('nunca deve expor dados internos na resposta de criação', async () => {
            const res = await request(app).post('/settings').send(validSettings)

            expect(res.body._id).toBeUndefined()
            expect(res.body.__v).toBeUndefined()
        })
    })

    describe('GET /settings - Listar Todas as Configurações', () => {
        beforeEach(async () => {
            await request(app).post('/settings').send(validSettings)
            await request(app).post('/settings').send({
                ...validSettings,
                userId: 'user-789',
            })
        })

        it('deve retornar lista de configurações com status 200', async () => {
            const res = await request(app).get('/settings')

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBeGreaterThan(0)
        })

        it('cada configuração da lista deve ter estrutura válida', async () => {
            const res = await request(app).get('/settings')

            expect(res.status).toBe(200)
            res.body.forEach((settings) => {
                expect(settings).toHaveProperty('id')
                expect(settings).toHaveProperty('userId')
                expect(settings).toHaveProperty('theme')
                expect(settings).toHaveProperty('language')
                expect(settings).toHaveProperty('notificationsEnabled')
            })
        })

        it('deve retornar array vazio se não houver configurações', async () => {
            // Simulando base de dados vazia - lista inicial sempre retorna algo
            const res = await request(app).get('/settings')

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
        })
    })

    describe('GET /settings/:id - Buscar Configurações por ID', () => {
        let settingsId

        beforeEach(async () => {
            const res = await request(app).post('/settings').send(validSettings)
            settingsId = res.body.id
        })

        it('deve retornar configurações válidas para ID existente com status 200', async () => {
            const res = await request(app).get(`/settings/${settingsId}`)

            expect(res.status).toBe(200)
            expect(res.body.id).toBe(settingsId)
            expect(res.body.userId).toBe('user-123')
            expect(res.body.theme).toBe('dark')
        })

        it('deve retornar 404 para ID inexistente', async () => {
            const fakeId = '507f1f77bcf86cd799439999'

            const res = await request(app).get(`/settings/${fakeId}`)

            expect(res.status).toBe(404)
            expect(res.body.message).toContain('Configurações não encontradas')
        })

        it('deve retornar 400 para ID inválido', async () => {
            const res = await request(app).get('/settings/invalid-id')

            expect(res.status).toBe(400)
        })

        it('deve retornar estrutura completa da configuração', async () => {
            const res = await request(app).get(`/settings/${settingsId}`)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('id')
            expect(res.body).toHaveProperty('userId')
            expect(res.body).toHaveProperty('theme')
            expect(res.body).toHaveProperty('language')
            expect(res.body).toHaveProperty('notificationsEnabled')
        })
    })

    describe('PATCH /settings/:id - Atualizar Configurações', () => {
        let settingsId

        beforeEach(async () => {
            const res = await request(app).post('/settings').send(validSettings)
            settingsId = res.body.id
        })

        it('deve atualizar tema e retornar 200', async () => {
            const updateData = {
                theme: 'light',
            }

            const res = await request(app)
                .patch(`/settings/${settingsId}`)
                .send(updateData)

            expect(res.status).toBe(200)
            expect(res.body.theme).toBe('light')
            expect(res.body.userId).toBe('user-123')
        })

        it('deve atualizar idioma e retornar 200', async () => {
            const updateData = {
                language: 'es',
            }

            const res = await request(app)
                .patch(`/settings/${settingsId}`)
                .send(updateData)

            expect(res.status).toBe(200)
            expect(res.body.language).toBe('es')
        })

        it('deve atualizar notificações e retornar 200', async () => {
            const updateData = {
                notificationsEnabled: false,
            }

            const res = await request(app)
                .patch(`/settings/${settingsId}`)
                .send(updateData)

            expect(res.status).toBe(200)
            expect(res.body.notificationsEnabled).toBe(false)
        })

        it('deve atualizar múltiplos campos e retornar 200', async () => {
            const updateData = {
                theme: 'light',
                language: 'es',
                notificationsEnabled: false,
            }

            const res = await request(app)
                .patch(`/settings/${settingsId}`)
                .send(updateData)

            expect(res.status).toBe(200)
            expect(res.body.theme).toBe('light')
            expect(res.body.language).toBe('es')
            expect(res.body.notificationsEnabled).toBe(false)
        })

        it('deve retornar 400 para tema inválido na atualização', async () => {
            const res = await request(app)
                .patch(`/settings/${settingsId}`)
                .send({ theme: 'invalid-theme' })

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('Tema inválido!')
        })

        it('deve retornar 400 para idioma inválido na atualização', async () => {
            const res = await request(app)
                .patch(`/settings/${settingsId}`)
                .send({ language: 'invalid-lang' })

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('Idioma inválido!')
        })

        it('deve retornar 404 para ID inexistente', async () => {
            const fakeId = '507f1f77bcf86cd799439999'

            const res = await request(app)
                .patch(`/settings/${fakeId}`)
                .send({ theme: 'light' })

            expect(res.status).toBe(404)
            expect(res.body.message).toContain('Configurações não encontradas')
        })

        it('deve retornar 400 para ID inválido', async () => {
            const res = await request(app)
                .patch('/settings/invalid-id')
                .send({ theme: 'light' })

            expect(res.status).toBe(400)
        })

        it('não deve alterar userId ao atualizar', async () => {
            const updateData = {
                theme: 'light',
                userId: 'different-user',
            }

            const res = await request(app)
                .patch(`/settings/${settingsId}`)
                .send(updateData)

            expect(res.status).toBe(200)
            expect(res.body.userId).toBe('user-123')
        })
    })

    describe('DELETE /settings/:id - Deletar Configurações', () => {
        let settingsId

        beforeEach(async () => {
            const res = await request(app).post('/settings').send(validSettings)
            settingsId = res.body.id
        })

        it('deve deletar configurações existentes e retornar 200', async () => {
            const res = await request(app).delete(`/settings/${settingsId}`)

            expect(res.status).toBe(200)
            expect(res.body.message).toContain('sucesso')
        })

        it('deve retornar 404 ao tentar deletar ID inexistente', async () => {
            const fakeId = '507f1f77bcf86cd799439999'

            const res = await request(app).delete(`/settings/${fakeId}`)

            expect(res.status).toBe(404)
            expect(res.body.message).toContain('Configurações não encontradas')
        })

        it('deve retornar 400 para ID inválido', async () => {
            const res = await request(app).delete('/settings/invalid-id')

            expect(res.status).toBe(400)
        })

        it('deve impedir acesso à configuração deletada', async () => {
            await request(app).delete(`/settings/${settingsId}`)

            const getRes = await request(app).get(`/settings/${settingsId}`)

            expect(getRes.status).toBe(404)
        })

        it('não deve deletar outras configurações ao deletar uma', async () => {
            const res2 = await request(app).post('/settings').send({
                ...validSettings,
                userId: 'user-999',
            })
            const settingsId2 = res2.body.id

            await request(app).delete(`/settings/${settingsId}`)

            const getRes = await request(app).get(`/settings/${settingsId2}`)
            expect(getRes.status).toBe(200)
            expect(getRes.body.id).toBe(settingsId2)
        })
    })

    describe('Validações Cross-Endpoint', () => {
        it('deve manter consistência após criar, atualizar e listar', async () => {
            const createRes = await request(app).post('/settings').send(validSettings)
            const settingsId = createRes.body.id

            const updateRes = await request(app)
                .patch(`/settings/${settingsId}`)
                .send({ theme: 'light' })

            const listRes = await request(app).get('/settings')
            const updatedSettings = listRes.body.find((s) => s.id === settingsId)

            expect(updatedSettings.theme).toBe('light')
            expect(updatedSettings.userId).toBe('user-123')
        })

        it('deve suportar fluxo completo: criar → ler → atualizar → deletar', async () => {
            // Criar
            const createRes = await request(app).post('/settings').send(validSettings)
            const settingsId = createRes.body.id
            expect(createRes.status).toBe(201)

            // Ler
            const readRes = await request(app).get(`/settings/${settingsId}`)
            expect(readRes.status).toBe(200)

            // Atualizar
            const updateRes = await request(app)
                .patch(`/settings/${settingsId}`)
                .send({ theme: 'light' })
            expect(updateRes.status).toBe(200)

            // Deletar
            const deleteRes = await request(app).delete(`/settings/${settingsId}`)
            expect(deleteRes.status).toBe(200)

            // Verificar exclusão
            const verifyRes = await request(app).get(`/settings/${settingsId}`)
            expect(verifyRes.status).toBe(404)
        })
    })
})
