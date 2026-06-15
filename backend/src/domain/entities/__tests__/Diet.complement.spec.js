const { Diet } = require('../Diet')

describe('Entidade Diet (cenários complementares)', () => {
  const makeValidData = (overrides = {}) => ({
    name: 'Dieta do Rex',
    pet: 'pet-1',
    dailyCalories: 500,
    ...overrides,
  })


  it('deve aceitar o tipo "weight-loss"', () => {
    const diet = new Diet(makeValidData({ type: 'weight-loss' }))
    expect(diet.type).toBe('weight-loss')
  })

  it('deve aceitar o tipo "maintenance"', () => {
    const diet = new Diet(makeValidData({ type: 'maintenance' }))
    expect(diet.type).toBe('maintenance')
  })

  it('deve aceitar o tipo "weight-gain"', () => {
    const diet = new Diet(makeValidData({ type: 'weight-gain' }))
    expect(diet.type).toBe('weight-gain')
  })

  it('deve aceitar o tipo "medical"', () => {
    const diet = new Diet(makeValidData({ type: 'medical' }))
    expect(diet.type).toBe('medical')
  })

  it('deve rejeitar tipo em formato diferente (case-sensitive)', () => {
    expect(() => new Diet(makeValidData({ type: 'Medical' })))
      .toThrow('Tipo de dieta inválido!')
  })


  it('deve aceitar calorias diárias fracionárias', () => {
    const diet = new Diet(makeValidData({ dailyCalories: 350.5 }))
    expect(diet.dailyCalories).toBe(350.5)
  })

  it('deve lançar erro quando as calorias são exatamente zero', () => {
    expect(() => new Diet(makeValidData({ dailyCalories: 0 })))
      .toThrow('As calorias diárias devem ser maiores que zero!')
  })

  it('deve lançar erro quando as calorias são negativas', () => {
    expect(() => new Diet(makeValidData({ dailyCalories: -100 })))
      .toThrow('As calorias diárias devem ser maiores que zero!')
  })


  it('deve aceitar mealsPerDay = 1 (mínimo válido)', () => {
    const diet = new Diet(makeValidData({ mealsPerDay: 1 }))
    expect(diet.mealsPerDay).toBe(1)
  })

  it('deve aceitar um valor alto de mealsPerDay', () => {
    const diet = new Diet(makeValidData({ mealsPerDay: 6 }))
    expect(diet.mealsPerDay).toBe(6)
  })

  it('deve lançar erro se mealsPerDay for zero', () => {
    expect(() => new Diet(makeValidData({ mealsPerDay: 0 })))
      .toThrow('O número de refeições por dia deve ser no mínimo 1!')
  })

  it('deve lançar erro se mealsPerDay for fracionário', () => {
    expect(() => new Diet(makeValidData({ mealsPerDay: 2.5 })))
      .toThrow('O número de refeições por dia deve ser um inteiro!')
  })


  it('deve criar instâncias independentes', () => {
    const a = new Diet(makeValidData({ name: 'Dieta A' }))
    const b = new Diet(makeValidData({ name: 'Dieta B' }))
    expect(a.name).toBe('Dieta A')
    expect(b.name).toBe('Dieta B')
    expect(a).not.toBe(b)
  })
})