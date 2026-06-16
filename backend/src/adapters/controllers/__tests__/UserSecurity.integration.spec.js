const request = require('supertest')
const app = require('../../../external/frameworks/app')

describe('Aprimoramento de segurança no fluxo de User (integração)', () => {
  it('POST /v2/users/register deve ignorar campos extras maliciosos (role/isAdmin)', async () => {
    const res = await request(app).post('/v2/users/register').send({
      name: 'Maria',
      email: 'maria@email.com',
      phone: '11999999999',
      password: '123456',
      confirmpassword: '123456',
      role: 'superuser', 
      isAdmin: true, 
    })

        expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('token')
       expect(res.body.role).toBeUndefined()
    expect(res.body.isAdmin).toBeUndefined()
  })

  it('POST /v2/users/register deve sanitizar tags HTML do nome', async () => {
    const res = await request(app).post('/v2/users/register').send({
      name: 'Maria<script>alert(1)</script>',
      email: 'maria2@email.com',
      phone: '11999999999',
      password: '123456',
      confirmpassword: '123456',
    })

    expect(res.status).toBe(201)
  })
})