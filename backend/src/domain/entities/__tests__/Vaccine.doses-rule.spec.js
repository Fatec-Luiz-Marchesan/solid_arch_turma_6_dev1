const { Vaccine } = require('../Vaccine')

describe('Entidade Vaccine (regra de coerência de doses — #55)', () => {
  const makeValidData = (overrides = {}) => ({
    id: 'vac-1',
    name: 'Antirrábica',
    manufacturer: 'Lab Pet',
    description: 'Vacina contra raiva',
    requiredDoses: 2,
    intervalDays: 21,
    ...overrides,
  })


  it('deve aceitar múltiplas doses quando há intervalo positivo', () => {
    const vaccine = new Vaccine(makeValidData({ requiredDoses: 3, intervalDays: 30 }))
    expect(vaccine.requiredDoses).toBe(3)
    expect(vaccine.intervalDays).toBe(30)
  })

  it('deve lançar erro para múltiplas doses sem intervalo (intervalDays = 0)', () => {
    expect(() => new Vaccine(makeValidData({ requiredDoses: 2, intervalDays: 0 })))
      .toThrow('O intervalo entre doses deve ser maior que zero quando há mais de uma dose!')
  })

  it('deve lançar erro para múltiplas doses com intervalo não informado', () => {
    expect(() => new Vaccine(makeValidData({ requiredDoses: 2, intervalDays: undefined })))
      .toThrow('O intervalo entre doses deve ser maior que zero quando há mais de uma dose!')
  })


  it('deve aceitar dose única com intervalo zero', () => {
    const vaccine = new Vaccine(makeValidData({ requiredDoses: 1, intervalDays: 0 }))
    expect(vaccine.intervalDays).toBe(0)
  })

  it('deve aceitar dose única sem intervalo informado', () => {
    const vaccine = new Vaccine(makeValidData({ requiredDoses: 1, intervalDays: undefined }))
    expect(vaccine.intervalDays).toBe(0)
  })

  it('deve aceitar dose única mesmo com intervalo positivo (não obrigatório, mas válido)', () => {
    const vaccine = new Vaccine(makeValidData({ requiredDoses: 1, intervalDays: 15 }))
    expect(vaccine.intervalDays).toBe(15)
  })


  it('deve barrar intervalo negativo antes da regra de coerência', () => {
    expect(() => new Vaccine(makeValidData({ requiredDoses: 2, intervalDays: -5 })))
      .toThrow('O intervalo entre doses não pode ser negativo!')
  })
})