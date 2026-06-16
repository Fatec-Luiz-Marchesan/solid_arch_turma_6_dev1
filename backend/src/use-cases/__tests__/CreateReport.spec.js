const { CreateReport } = require('../CreateReport')

describe('CreateReport Use Case', () => {

  const makeReportRepository = () => ({
    create: jest.fn().mockImplementation(async (report) => ({
      id: 'report-id',
      title: report.title,
      description: report.description,
      type: report.type,
      status: report.status,
      priority: report.priority,
      reporterId: report.reporterId,
    })),
  })

  const makeSut = () => {
    const reportRepository = makeReportRepository()
    const sut = new CreateReport(reportRepository)
    return { sut, reportRepository }
  }

  const validInput = {
    title: 'Anúncio suspeito',
    description: 'Pet sendo vendido em vez de doado.',
    type: 'abuse',
    reporterId: 'user-1',
  }

  it('deve lançar erro se o título não for informado', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, title: undefined }))
      .rejects.toThrow('O título do report é obrigatório!')
  })

  it('deve lançar erro se a descrição não for informada', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, description: undefined }))
      .rejects.toThrow('A descrição do report é obrigatória!')
  })

  it('deve lançar erro se o tipo for inválido', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, type: 'invalido' }))
      .rejects.toThrow('Tipo de report inválido!')
  })

  it('deve lançar erro se o autor (reporterId) não for informado', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, reporterId: undefined }))
      .rejects.toThrow('O autor do report é obrigatório!')
  })

  it('deve criar o report com status "open" por padrão', async () => {
    const { sut, reportRepository } = makeSut()
    await sut.execute(validInput)

    expect(reportRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'open' })
    )
  })

  it('deve retornar o report criado com id', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(validInput)

    expect(result).toHaveProperty('id')
    expect(result.title).toBe('Anúncio suspeito')
    expect(result.status).toBe('open')
  })

  it('deve definir priority "high" para reports do tipo fraud', async () => {
    const { sut, reportRepository } = makeSut()
    await sut.execute({ ...validInput, type: 'fraud' })

    expect(reportRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ priority: 'high' })
    )
  })

  it('deve definir priority "high" para reports do tipo abuse', async () => {
    const { sut, reportRepository } = makeSut()
    await sut.execute({ ...validInput, type: 'abuse' })
    
    expect(reportRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ priority: 'high' })
    )
  })

  it('deve definir priority "medium" para reports do tipo spam', async () => {
    const { sut, reportRepository } = makeSut()
    await sut.execute({ ...validInput, type: 'spam' })

    expect(reportRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ priority: 'medium' })
    )
  })

  it('deve definir priority "low" para reports do tipo other', async () => {
    const { sut, reportRepository } = makeSut()
    await sut.execute({ ...validInput, type: 'other' })
    
    expect(reportRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ priority: 'low' })
    )
  })

  it('deve repassar o type informado ao repositório', async () => {
    const { sut, reportRepository } = makeSut()
    await sut.execute({ ...validInput, type: 'fraud' })

    expect(reportRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'fraud' })
    )
  })

})
