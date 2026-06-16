const { Vaccine } = require('../Vaccine')

describe('Entidade Vaccine (cenários complementares)', () => {
  const makeValidData = (overrides = {}) => ({
    id: 'vac-1',
    name: 'Antirrábica',
    manufacturer: 'Lab Pet',
    description: 'Vacina contra raiva',
    requiredDoses: 2,
    intervalDays: 21,
    ...overrides,
  })


  it('deve preservar o id quando informado', () => {
    const vaccine = new Vaccine(makeValidData())
    expect(vaccine.id).toBe('vac-1')
  })

  it('deve preservar a description quando informada', () => {
    const vaccine = new Vaccine(makeValidData({ description: 'Reforço anual' }))
    expect(vaccine.description).toBe('Reforço anual')
  })

  it('deve aceitar description ausente (campo opcional)', () => {
    const vaccine = new Vaccine(makeValidData({ description: undefined }))
    expect(vaccine.description).toBeUndefined()
  })


  it('deve assumir intervalDays = 0 quando não informado (dose única)', () => {
    const vaccine = new Vaccine(makeValidData({ requiredDoses: 1, intervalDays: undefined }))
    expect(vaccine.intervalDays).toBe(0)
  })

  it('deve aceitar intervalDays = 0 explicitamente (dose única)', () => {
    const vaccine = new Vaccine(makeValidData({ requiredDoses: 1, intervalDays: 0 }))
    expect(vaccine.intervalDays).toBe(0)
  })

  it('deve aceitar um intervalDays positivo grande', () => {
    const vaccine = new Vaccine(makeValidData({ intervalDays: 365 }))
    expect(vaccine.intervalDays).toBe(365)
  })


  it('deve aceitar requiredDoses igual a 1 (mínimo válido)', () => {
    const vaccine = new Vaccine(makeValidData({ requiredDoses: 1 }))
    expect(vaccine.requiredDoses).toBe(1)
  })

  it('deve lançar erro se requiredDoses for exatamente zero', () => {
    expect(() => new Vaccine(makeValidData({ requiredDoses: 0 })))
      .toThrow('A quantidade de doses deve ser maior que zero!')
  })

  it('deve lançar erro se requiredDoses for negativo', () => {
    expect(() => new Vaccine(makeValidData({ requiredDoses: -1 })))
      .toThrow('A quantidade de doses deve ser maior que zero!')
  })

  it('deve lançar erro se requiredDoses não for informado', () => {
    expect(() => new Vaccine(makeValidData({ requiredDoses: undefined })))
      .toThrow('A quantidade de doses deve ser maior que zero!')
  })


  it('deve criar instâncias independentes', () => {
    const a = new Vaccine(makeValidData({ name: 'Vacina A' }))
    const b = new Vaccine(makeValidData({ name: 'Vacina B' }))
    expect(a.name).toBe('Vacina A')
    expect(b.name).toBe('Vacina B')
    expect(a).not.toBe(b)
  })
})