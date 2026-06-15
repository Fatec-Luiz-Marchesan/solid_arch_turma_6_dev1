const AdminModel = require('../AdminModel')

describe('AdminModel (schema Mongoose)', () => {
  const makeValidData = (overrides = {}) => ({
    name: 'Admin Geral',
    email: `admin${Math.random()}@email.com`,
    password: 'senha123',
    ...overrides,
  })

  it('deve persistir um admin válido com role padrão "admin"', async () => {
    const doc = await AdminModel.create(makeValidData())
    expect(doc._id).toBeDefined()
    expect(doc.role).toBe('admin')
  })

  it('deve aceitar a role "super-admin"', async () => {
    const doc = await AdminModel.create(makeValidData({ role: 'super-admin' }))
    expect(doc.role).toBe('super-admin')
  })

  it('deve aceitar a role "moderator"', async () => {
    const doc = await AdminModel.create(makeValidData({ role: 'moderator' }))
    expect(doc.role).toBe('moderator')
  })

  it('deve rejeitar uma role fora do enum permitido', async () => {
    await expect(
      AdminModel.create(makeValidData({ role: 'hacker' }))
    ).rejects.toThrow()
  })
})