const { sanitizePayment } = require('./sanitizePayment')

describe('sanitizePayment (validador de seguranca)', () => {
  it('deve manter apenas os campos permitidos (payer, amount, currency)', () => {
    const dirty = {
      payer: 'user-id',
      amount: 100,
      currency: 'BRL',
      status: 'paid',
      isAdmin: true,
    }

    const clean = sanitizePayment(dirty)

    expect(clean).toEqual({ payer: 'user-id', amount: 100, currency: 'BRL' })
    expect(clean.status).toBeUndefined()
    expect(clean.isAdmin).toBeUndefined()
  })

  it('deve remover espacos em branco no inicio e fim das strings', () => {
    const clean = sanitizePayment({
      payer: '  user-id  ',
      amount: 100,
      currency: ' BRL ',
    })

    expect(clean.payer).toBe('user-id')
    expect(clean.currency).toBe('BRL')
  })

  it('deve converter amount de string numerica para numero', () => {
    const clean = sanitizePayment({ payer: 'u', amount: '100.5', currency: 'BRL' })
    expect(clean.amount).toBe(100.5)
  })

  it('deve manter amount como esta se nao for um numero valido', () => {
    const clean = sanitizePayment({ payer: 'u', amount: 'abc', currency: 'BRL' })
    expect(clean.amount).toBe('abc')
  })

  it('nao deve quebrar se o payload vier vazio ou indefinido', () => {
    expect(sanitizePayment(undefined)).toEqual({})
    expect(sanitizePayment({})).toEqual({})
  })
})