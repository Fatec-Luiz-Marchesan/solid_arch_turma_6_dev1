const { Payment } = require('../Payment')

describe('Entidade Payment (cenários complementares)', () => {
  const makeValidData = (overrides = {}) => ({
    payer: 'user-1',
    amount: 100,
    currency: 'BRL',
    ...overrides,
  })


  it('deve aceitar a moeda BRL', () => {
    const payment = new Payment(makeValidData({ currency: 'BRL' }))
    expect(payment.currency).toBe('BRL')
  })

  it('deve aceitar a moeda USD', () => {
    const payment = new Payment(makeValidData({ currency: 'USD' }))
    expect(payment.currency).toBe('USD')
  })

  it('deve aceitar a moeda EUR', () => {
    const payment = new Payment(makeValidData({ currency: 'EUR' }))
    expect(payment.currency).toBe('EUR')
  })

  it('deve rejeitar uma moeda em minúsculas (case-sensitive)', () => {
    expect(() => new Payment(makeValidData({ currency: 'brl' })))
      .toThrow('Moeda não suportada!')
  })


  it('deve aceitar o status "pending"', () => {
    const payment = new Payment(makeValidData({ status: 'pending' }))
    expect(payment.status).toBe('pending')
  })

  it('deve aceitar o status "paid"', () => {
    const payment = new Payment(makeValidData({ status: 'paid' }))
    expect(payment.status).toBe('paid')
  })

  it('deve aceitar o status "failed"', () => {
    const payment = new Payment(makeValidData({ status: 'failed' }))
    expect(payment.status).toBe('failed')
  })

  it('deve aceitar o status "refunded"', () => {
    const payment = new Payment(makeValidData({ status: 'refunded' }))
    expect(payment.status).toBe('refunded')
  })

  it('deve assumir status "pending" quando não informado', () => {
    const payment = new Payment(makeValidData())
    expect(payment.status).toBe('pending')
  })


  it('deve aceitar um valor positivo fracionário', () => {
    const payment = new Payment(makeValidData({ amount: 0.01 }))
    expect(payment.amount).toBe(0.01)
  })

  it('deve lançar erro quando o valor é exatamente zero', () => {
    expect(() => new Payment(makeValidData({ amount: 0 })))
      .toThrow('O valor deve ser maior que zero!')
  })

  it('deve lançar erro quando o valor é negativo', () => {
    expect(() => new Payment(makeValidData({ amount: -50 })))
      .toThrow('O valor deve ser maior que zero!')
  })


  it('deve criar instâncias independentes', () => {
    const a = new Payment(makeValidData({ amount: 100 }))
    const b = new Payment(makeValidData({ amount: 200 }))
    expect(a.amount).toBe(100)
    expect(b.amount).toBe(200)
    expect(a).not.toBe(b)
  })
})