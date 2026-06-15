// backend/src/external/models/__tests__/BreedModel.spec.js
const BreedModel = require('../BreedModel')

describe('BreedModel (aprimoramento de seguranca)', () => {
  const makeValid = (overrides = {}) => ({
    name: 'Labrador',
    species: 'dog',
    ...overrides,
  })

  it('deve manter os campos obrigatorios name e species', () => {
    const breed = new BreedModel({})
    const err = breed.validateSync()

    expect(err.errors.name).toBeDefined()
    expect(err.errors.species).toBeDefined()
  })

  it('deve remover espacos em branco do name (trim)', () => {
    const breed = new BreedModel(makeValid({ name: '  Labrador  ' }))
    expect(breed.name).toBe('Labrador')
  })

  it('deve rejeitar name com tags HTML/script (caracteres invalidos)', () => {
    const breed = new BreedModel(makeValid({ name: 'Labrador<script>alert(1)</script>' }))
    const err = breed.validateSync()

    expect(err.errors.name).toBeDefined()
  })

  it('deve rejeitar name acima do tamanho maximo permitido', () => {
    const breed = new BreedModel(makeValid({ name: 'A'.repeat(101) }))
    const err = breed.validateSync()

    expect(err.errors.name).toBeDefined()
  })

  it('deve rejeitar description acima do tamanho maximo permitido', () => {
    const breed = new BreedModel(makeValid({ description: 'A'.repeat(501) }))
    const err = breed.validateSync()

    expect(err.errors.description).toBeDefined()
  })

  it('deve manter o enum de size funcionando (contrato existente)', () => {
    const breed = new BreedModel(makeValid({ size: 'gigante' }))
    const err = breed.validateSync()

    expect(err.errors.size).toBeDefined()
  })

  it('nao deve apresentar erro quando os dados sao validos', () => {
    const breed = new BreedModel(makeValid({
      name: 'Golden Retriever',
      species: 'dog',
      description: 'Raca docil',
      size: 'large',
    }))
    const err = breed.validateSync()

    expect(err).toBeUndefined()
  })
})
