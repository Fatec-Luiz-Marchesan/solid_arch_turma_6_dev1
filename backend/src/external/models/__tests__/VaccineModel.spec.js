// backend/src/external/models/__tests__/VaccineModel.spec.js
const VaccineModel = require('../VaccineModel')

describe('VaccineModel (aprimoramento de seguranca)', () => {
  const makeValid = (overrides = {}) => ({
    name: 'V10',
    manufacturer: 'Zoetis',
    requiredDoses: 3,
    ...overrides,
  })

  it('deve manter os campos obrigatorios name, manufacturer e requiredDoses', () => {
    const vaccine = new VaccineModel({})
    const err = vaccine.validateSync()

    expect(err.errors.name).toBeDefined()
    expect(err.errors.manufacturer).toBeDefined()
    expect(err.errors.requiredDoses).toBeDefined()
  })

  it('deve remover espacos do name (trim - contrato existente)', () => {
    const vaccine = new VaccineModel(makeValid({ name: '  V10  ' }))
    expect(vaccine.name).toBe('V10')
  })

  it('deve rejeitar name com tags HTML/script', () => {
    const vaccine = new VaccineModel(makeValid({ name: 'V10<script>alert(1)</script>' }))
    const err = vaccine.validateSync()

    expect(err.errors.name).toBeDefined()
  })

  it('deve rejeitar name acima do tamanho maximo', () => {
    const vaccine = new VaccineModel(makeValid({ name: 'A'.repeat(101) }))
    const err = vaccine.validateSync()

    expect(err.errors.name).toBeDefined()
  })

  it('deve rejeitar manufacturer acima do tamanho maximo', () => {
    const vaccine = new VaccineModel(makeValid({ manufacturer: 'A'.repeat(101) }))
    const err = vaccine.validateSync()

    expect(err.errors.manufacturer).toBeDefined()
  })

  it('deve rejeitar description acima do tamanho maximo', () => {
    const vaccine = new VaccineModel(makeValid({ description: 'A'.repeat(501) }))
    const err = vaccine.validateSync()

    expect(err.errors.description).toBeDefined()
  })

  it('deve rejeitar requiredDoses absurdamente alto (limite superior)', () => {
    const vaccine = new VaccineModel(makeValid({ requiredDoses: 1000 }))
    const err = vaccine.validateSync()

    expect(err.errors.requiredDoses).toBeDefined()
  })

  it('deve manter o min de requiredDoses (contrato existente)', () => {
    const vaccine = new VaccineModel(makeValid({ requiredDoses: 0 }))
    const err = vaccine.validateSync()

    expect(err.errors.requiredDoses).toBeDefined()
  })

  it('nao deve apresentar erro quando os dados sao validos', () => {
    const vaccine = new VaccineModel(makeValid({
      name: 'Antirrabica',
      manufacturer: 'MSD',
      description: 'Dose anual',
      requiredDoses: 1,
      intervalDays: 365,
    }))
    const err = vaccine.validateSync()

    expect(err).toBeUndefined()
  })
})
