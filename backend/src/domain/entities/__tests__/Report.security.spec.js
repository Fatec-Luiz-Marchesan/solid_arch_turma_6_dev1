const { Report } = require('../Report')
const { LIMITS } = require('../helpers/analytics-input')

describe('Report - Segurança (payload e sanitização)', () => {
  const validInput = {
    title: 'Anúncio suspeito',
    description: 'Pet sendo vendido em vez de doado.',
    type: 'abuse',
    reporterId: 'user-1',
  }

  it('deve lançar erro se o título exceder o tamanho máximo permitido', () => {
    const hugeTitle = 'a'.repeat(LIMITS.TITLE_MAX + 1)
    expect(() => new Report({ ...validInput, title: hugeTitle }))
      .toThrow('O campo título excede o tamanho máximo permitido!')
  })

  it('deve lançar erro se a descrição exceder o tamanho máximo permitido', () => {
    const hugeDescription = 'a'.repeat(LIMITS.DESCRIPTION_MAX + 1)
    expect(() => new Report({ ...validInput, description: hugeDescription }))
      .toThrow('O campo descrição excede o tamanho máximo permitido!')
  })

  it('deve sanitizar o título removendo espaços nas pontas', () => {
    const report = new Report({ ...validInput, title: '  Anúncio suspeito  ' })
    expect(report.title).toBe('Anúncio suspeito')
  })

  it('deve remover caracteres de controle da descrição', () => {
    const report = new Report({ ...validInput, description: 'Texto\u0000 com\t controle' })
    expect(report.description).toBe('Texto com controle')
  })

  it('deve tratar título que vira vazio após sanitização como obrigatório', () => {
    expect(() => new Report({ ...validInput, title: '   ' }))
      .toThrow('O título do report é obrigatório!')
  })

  it('deve aceitar título exatamente no limite máximo', () => {
    const limitTitle = 'a'.repeat(LIMITS.TITLE_MAX)
    const report = new Report({ ...validInput, title: limitTitle })
    expect(report.title).toBe(limitTitle)
  })

  it('deve manter o contrato existente intacto (sem regressão)', () => {
    const report = new Report(validInput)
    expect(report.title).toBe('Anúncio suspeito')
    expect(report.status).toBe('open')
    expect(report.reporterId).toBe('user-1')
  })
})