
const { requiresReview } = require('../../domain/entities/helpers/payment-review')
const { CreatePayment } = require('../CreatePayment')

describe('CreatePayment Use Case', () => {
  const makePaymentRepository = () => ({
    create: jest.fn().mockImplementation(async (data) => ({
      id: 'payment-id',
      payer: data.payer,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      requiresReview: data.requiresReview,
    })),
  })

  const makeSut = () => {
    const paymentRepository = makePaymentRepository()
    const sut = new CreatePayment(paymentRepository)
    return { sut, paymentRepository }
  }

  const validInput = {
    payer: 'user-id',
    amount: 100.5,
    currency: 'BRL',
  }

  it('deve lançar erro de validação vindo da entidade (valor inválido)', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, amount: -10 }))
      .rejects.toThrow('O valor deve ser maior que zero!')
  })

  it('deve persistir o pagamento com status pending', async () => {
    const { sut, paymentRepository } = makeSut()
    await sut.execute(validInput)

    expect(paymentRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        payer: 'user-id',
        amount: 100.5,
        currency: 'BRL',
        status: 'pending',
      })
    )
  })

  it('deve retornar o pagamento criado com id', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(validInput)

    expect(result).toHaveProperty('id', 'payment-id')
    expect(result.status).toBe('pending')
  })

  it('não deve exigir revisão para pagamentos abaixo do limiar', async () =>{
    const {sut, paymentRepository} = makeSut()
    await sut.execute({...validInput, amount: 100, currency: 'BRL'})

    expect(paymentRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({requiresReview: false})
    )
  })

  it('deve exigir revisão para pagamentos em BRL acima do limiar', async () =>{
    const {sut, paymentRepository} = makeSut()
    await sut.execute({...validInput, amount: 6000, currency: 'BRL'})

    expect(paymentRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({requiresReview: true})
    )
  })

  it('deve exigir revisão para pagamentos em USD acima do limiar', async () => {
    const {sut, paymentRepository} = makeSut()
    await sut.execute({...validInput, amount: 1500, currency: 'USD'})

      expect(paymentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({requiresReview: true})
      )
  })
})