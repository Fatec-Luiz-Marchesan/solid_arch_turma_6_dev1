// backend/src/domain/entities/__tests__/Profile.spec.js
const { Profile } = require('../Profile')

describe('Entidade Profile (regras de negocio)', () => {
  const makeValid = (overrides = {}) => ({
    user: 'user-id',
    bio: 'Amo animais',
    phone: '11999999999',
    ...overrides,
  })

  it('deve criar um Profile valido', () => {
    const profile = new Profile(makeValid())
    expect(profile.user).toBe('user-id')
    expect(profile.bio).toBe('Amo animais')
    expect(profile.phone).toBe('11999999999')
  })

  it('deve lancar erro se o user nao for informado', () => {
    expect(() => new Profile(makeValid({ user: undefined })))
      .toThrow('O usuario e obrigatorio!')
  })

  it('deve lancar erro se a bio passar de 300 caracteres', () => {
    expect(() => new Profile(makeValid({ bio: 'A'.repeat(301) })))
      .toThrow('A bio e muito longa!')
  })

  it('deve lancar erro se o phone tiver formato invalido', () => {
    expect(() => new Profile(makeValid({ phone: 'abc123' })))
      .toThrow('Telefone invalido!')
  })

  it('deve permitir bio vazia (campo opcional)', () => {
    const profile = new Profile(makeValid({ bio: undefined }))
    expect(profile.bio).toBe('')
  })
})
