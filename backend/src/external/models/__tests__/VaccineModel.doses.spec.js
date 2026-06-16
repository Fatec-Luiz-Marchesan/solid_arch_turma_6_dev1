const VaccineModel = require('../VaccineModel')

describe('VaccineModel (coerencia de doses - #55)', () => {
  const makeValid = (overrides = {}) => ({
    name: 'Antirrabica',
    manufacturer: 'Lab Pet',
    requiredDoses: 2,
    intervalDays: 21,
    ...overrides,
  })

  it('deve validar uma vacina com multiplas doses e intervalo positivo', () => {
    const vaccine = new VaccineModel(makeValid())
    const err = vaccine.validateSync()
    expect(err).toBeUndefined()
  })

  it('deve validar uma vacina de dose unica com intervalo zero', () => {
    const vaccine = new VaccineModel(makeValid({ requiredDoses: 1, intervalDays: 0 }))
    const err = vaccine.validateSync()
    expect(err).toBeUndefined()
  })

  it('deve invalidar multiplas doses sem intervalo (intervalDays = 0)', () => {
    const vaccine = new VaccineModel(makeValid({ requiredDoses: 2, intervalDays: 0 }))
    const err = vaccine.validateSync()
    expect(err.errors.intervalDays).toBeDefined()
  })

  it('deve invalidar multiplas doses sem intervalo informado', () => {
    const vaccine = new VaccineModel({
      name: 'Vacina X', manufacturer: 'Lab', requiredDoses: 3,
    })
    const err = vaccine.validateSync()
    expect(err.errors.intervalDays).toBeDefined()
  })
})