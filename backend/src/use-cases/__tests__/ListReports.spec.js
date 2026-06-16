const { ListReports } = require('../ListReports')

describe('ListReports Use Case', () => {

  const makeReportRepository = (reports = []) => ({
    findAll: jest.fn().mockResolvedValue(reports),
  })

  const makeSut = (reports) => {
    const reportRepository = makeReportRepository(reports)
    const sut = new ListReports(reportRepository)
    return { sut, reportRepository }
  }

  it('deve retornar uma lista vazia quando não há reports', async () => {
    const { sut } = makeSut([])
    const result = await sut.execute()
    expect(result).toEqual([])
  })

  it('deve retornar todos os reports do repositório', async () => {
    const fakeReports = [
      {
        id: 'report-1',
        title: 'Anúncio suspeito',
        description: 'Pet sendo vendido em vez de doado.',
        type: 'abuse',
        status: 'open',
        priority: 'high',
        reporterId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'report-2',
        title: 'Spam identificado',
        description: 'Usuário enviando mensagens repetidas.',
        type: 'spam',
        status: 'open',
        priority: 'medium',
        reporterId: 'user-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const { sut, reportRepository } = makeSut(fakeReports)
    const result = await sut.execute()

    expect(reportRepository.findAll).toHaveBeenCalledTimes(1)
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('report-1')
    expect(result[1].id).toBe('report-2')
  })

  it('deve delegar a busca ao repositório sem modificar os dados', async () => {
    const fakeReports = [
      {
        id: 'report-1',
        title: 'Test',
        description: 'Desc',
        type: 'fraud',
        status: 'in_review',
        priority: 'high',
        reporterId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const { sut, reportRepository } = makeSut(fakeReports)
    const result = await sut.execute()

    expect(result).toEqual(fakeReports)
    expect(reportRepository.findAll).toHaveBeenCalledTimes(1)
  })

  it('deve propagar erros do repositório', async () => {
    const reportRepository = {
      findAll: jest.fn().mockRejectedValue(new Error('Falha na conexão com o banco')),
    }
    const sut = new ListReports(reportRepository)

    await expect(sut.execute()).rejects.toThrow('Falha na conexão com o banco')
  })
})