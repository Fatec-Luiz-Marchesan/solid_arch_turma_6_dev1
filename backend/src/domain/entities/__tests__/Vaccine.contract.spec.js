const { Vaccine } = require('../Vaccine')

describe('Entidade Vaccine (contratos e precedência de validação)', () => {
  const makeValidData = (overrides = {}) => ({
    id: 'vac-1',
    name: 'Antirrábica',
    manufacturer: 'Lab Pet',
    description: 'Vacina contra raiva',
    requiredDoses: 2,
    intervalDays: 21,
    ...overrides,
  })


  it('deve priorizar o erro de nome quando nome e fabricante faltam', () => {
    expect(() => new Vaccine(makeValidData({ name: undefined, manufacturer: undefined })))
      .toThrow('O nome da vacina é obrigatório!')
  })

  it('deve cobrar o fabricante antes das doses quando ambos faltam', () => {
    expect(() => new Vaccine(makeValidData({ manufacturer: undefined, requiredDoses: undefined })))
      .toThrow('O fabricante da vacina é obrigatório!')
  })


  it('deve aceitar nome composto com espaços', () => {
    const vaccine = new Vaccine(makeValidData({ name: 'V10 Múltipla Canina' }))
    expect(vaccine.name).toBe('V10 Múltipla Canina')
  })

  it('deve aceitar fabricante com caracteres especiais', () => {
    const vaccine = new Vaccine(makeValidData({ manufacturer: 'Lab & Cia. Ltda.' }))
    expect(vaccine.manufacturer).toBe('Lab & Cia. Ltda.')
  })


  it('deve aceitar requiredDoses fracionário maior que zero', () => {
    const vaccine = new Vaccine(makeValidData({ requiredDoses: 1.5 }))
    expect(vaccine.requiredDoses).toBe(1.5)
  })

  it('deve aceitar um número alto de doses', () => {
    const vaccine = new Vaccine(makeValidData({ requiredDoses: 10 }))
    expect(vaccine.requiredDoses).toBe(10)
  })

  it('deve aceitar vacina sem id (id não é obrigatório)', () => {
    const vaccine = new Vaccine(makeValidData({ id: undefined }))
    expect(vaccine.id).toBeUndefined()
    expect(vaccine.name).toBe('Antirrábica')
  })


  it('deve aceitar intervalDays exatamente no limite inferior válido (0) com dose única', () => {
    const vaccine = new Vaccine(makeValidData({ requiredDoses: 1, intervalDays: 0 }))
    expect(vaccine.intervalDays).toBe(0)
  })


  it('deve expor exatamente os campos esperados em uma vacina válida', () => {
    const vaccine = new Vaccine(makeValidData())
    expect(vaccine).toEqual(
      expect.objectContaining({
        id: 'vac-1',
        name: 'Antirrábica',
        manufacturer: 'Lab Pet',
        description: 'Vacina contra raiva',
        requiredDoses: 2,
        intervalDays: 21,
      })
    )
  })

  it('deve manter os campos numéricos como números após a criação', () => {
    const vaccine = new Vaccine(makeValidData({ requiredDoses: 3, intervalDays: 30 }))
    expect(typeof vaccine.requiredDoses).toBe('number')
    expect(typeof vaccine.intervalDays).toBe('number')
  })
})