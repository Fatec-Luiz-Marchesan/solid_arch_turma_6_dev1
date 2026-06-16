// backend/src/adapters/controllers/__tests__/AdminController.integration.spec.js
const request = require('supertest')
const app = require('../../../external/frameworks/app')

describe('Contrato da API de Admin (integração)', () => {
  const validAdmin = {
    name: 'Root Admin',
    email: 'root@admin.com',
    password: '123456',
  }

  it('POST /admins/create deve criar um admin e retornar 201 sem expor a senha', async () => {
    const res = await request(app).post('/admins/create').send(validAdmin)

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('admin')
    expect(res.body.admin.email).toBe('root@admin.com')
    expect(res.body.admin.password).toBeUndefined()
  })

  it('POST /admins/create sem email deve retornar 422 (validação de schema)', async () => {
    const res = await request(app)
      .post('/admins/create')
      .send({ name: 'Sem Email', password: '123456' })

    expect(res.status).toBe(422)
    expect(res.body.message).toBe('O email é obrigatório!')
  })

  it('POST /admins/create com senha curta deve retornar 422', async () => {
    const res = await request(app)
      .post('/admins/create')
      .send({ name: 'Senha Curta', email: 'curta@admin.com', password: '123' })

    expect(res.status).toBe(422)
    expect(res.body.message).toBe('A senha deve ter no mínimo 6 caracteres!')
  })

  it('POST /admins/create com email duplicado deve retornar 409', async () => {
    await request(app).post('/admins/create').send(validAdmin)
    const res = await request(app).post('/admins/create').send(validAdmin)

    expect(res.status).toBe(409)
    expect(res.body.message).toBe('Já existe um admin com este email!')
  })

  it('GET /admins deve retornar 200 e a lista de admins', async () => {
    await request(app).post('/admins/create').send(validAdmin)
    const res = await request(app).get('/admins')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('admins')
    expect(Array.isArray(res.body.admins)).toBe(true)
    expect(res.body.admins).toHaveLength(1)
    expect(res.body.admins[0].password).toBeUndefined()
  })

  it('POST /admins/create com role inválida deve retornar 422', async () => {
    const res = await request(app)
      .post('/admins/create')
      .send({ ...validAdmin, role: 'hacker' })
    expect(res.status).toBe(422)
    expect(res.body.message).toBe('Role inválida!')
  })

  it('POST /admins/create com role válida deve retornar 201', async () => {
    const res = await request(app)
      .post('/admins/create')
      .send({ name: 'Super', email: 'super@admin.com', password: '123456', role: 'super-admin' })
    expect(res.status).toBe(201)
    expect(res.body.admin.role).toBe('super-admin')
  })

it('POST /admins/create com name omitido deve retornar 500', async () => {
    const res = await request(app)
      .post('/admins/create')
      .send({ email: 'semnome@admin.com', password: 'password123' })

    expect(res.status).toBe(500)
    expect(res.body.message).toBe('Erro interno ao criar admin.') 
  })

  it('POST /admins/create com dados enviados que não forem um objeto deve retornar 400', async () => {
    const res = await request(app)
      .post('/admins/create')
      .send("isso é uma string")
      .set('Content-Type', 'application/json')

    expect(res.status).toBe(400)
  })


it('GET /admins não deve expor a senha dos administradores', async () => {
    await request(app).post('/admins/create').send({
      name: 'Admin Teste',
      email: `seguranca_${Date.now()}@teste.com`,
      password: 'password123'
    })
    
    const res = await request(app).get('/admins')

    res.body.admins.forEach(admin => {
      expect(admin).not.toHaveProperty('password')
    })
  })

it('POST /admins/create seguido de GET /admins deve persistir o admin no banco', async () => {
    const newAdmin = {
      name: 'Admin Persistente',
      email: `persistente_${Date.now()}@teste.com`,
      password: 'password123',
      role: 'admin'
    }

    await request(app).post('/admins/create').send(newAdmin)

    const res = await request(app).get('/admins')

    const adminList = res.body.admins || res.body; 
    
    const adminFound = Array.isArray(adminList) 
      ? adminList.find(a => a.email === newAdmin.email)
      : null;
    
    expect(adminFound).toBeDefined()
    expect(adminFound.name).toBe('Admin Persistente')
  })
})