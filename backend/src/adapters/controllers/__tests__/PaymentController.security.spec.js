// backend/src/adapters/controllers/__tests__/PaymentController.security.spec.js

// Mocka o use-case para inspecionar exatamente o que o controller repassa
const mockExecute = jest.fn().mockResolvedValue({
  id: 'payment-id',
  payer: 'user-id',
  amount: 100,
  currency: 'BRL',
  status: 'pending',
})

jest.mock('../../../use-cases/CreatePayment', () => ({
  CreatePayment: jest.fn().mockImplementation(() => ({
    execute: mockExecute,
  })),
}))

jest.mock('../../../external/repositories/PaymentMongoRepository', () => ({
  PaymentMongoRepository: jest.fn().mockImplementation(() => ({})),
}))

const PaymentController = require('../PaymentController')

const makeRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('PaymentController.create (seguranca de payload)', () => {
  beforeEach(() => {
    mockExecute.mockClear()
  })

  it('nao deve repassar campos nao permitidos (status injetado) ao use-case', async () => {
    const req = {
      body: {
        payer: 'user-id',
        amount: 100,
        currency: 'BRL',
        status: 'paid', // cliente tentando forcar pagamento aprovado
      },
    }
    const res = makeRes()

    await PaymentController.create(req, res)

    const argRecebido = mockExecute.mock.calls[0][0]
    expect(argRecebido.status).toBeUndefined()
    expect(argRecebido).toEqual({
      payer: 'user-id',
      amount: 100,
      currency: 'BRL',
    })
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it('deve remover espacos das strings antes de delegar', async () => {
    const req = {
      body: { payer: '  user-id  ', amount: 100, currency: ' BRL ' },
    }
    const res = makeRes()

    await PaymentController.create(req, res)

    const argRecebido = mockExecute.mock.calls[0][0]
    expect(argRecebido.payer).toBe('user-id')
    expect(argRecebido.currency).toBe('BRL')
  })
})
