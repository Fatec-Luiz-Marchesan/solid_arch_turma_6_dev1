const PaymentModel = require('../PaymentModel')

describe('PaymentModel (schema Mongoose) — restrição de valor', () => {
  const makeValid = (overrides = {}) => ({
    payer: 'user-1',
    amount: 100,
    currency: 'BRL',
    ...overrides,
  })

  it('deve validar um pagamento com valor positivo', () => {
    const payment = new PaymentModel(makeValid())
    const err = payment.validateSync()
    expect(err).toBeUndefined()
  })

  it('deve aplicar status "pending" por padrão', () => {
    const payment = new PaymentModel(makeValid())
    expect(payment.status).toBe('pending')
  })

  it('deve rejeitar amount igual a zero (validação de mínimo)', () => {
    const payment = new PaymentModel(makeValid({ amount: 0 }))
    const err = payment.validateSync()
    expect(err.errors.amount).toBeDefined()
  })

  it('deve rejeitar amount negativo (validação de mínimo)', () => {
    const payment = new PaymentModel(makeValid({ amount: -50 }))
    const err = payment.validateSync()
    expect(err.errors.amount).toBeDefined()
  })

  it('deve aceitar um valor fracionário pequeno (0.01)', () => {
    const payment = new PaymentModel(makeValid({ amount: 0.01 }))
    const err = payment.validateSync()
    expect(err).toBeUndefined()
  })

  it('deve rejeitar uma moeda fora do enum', () => {
    const payment = new PaymentModel(makeValid({ currency: 'JPY' }))
    const err = payment.validateSync()
    expect(err.errors.currency).toBeDefined()
  })
})