const { Vaccine } = require('../Vaccine')

describe('Vaccine Entity', () => {
  it('deve criar uma vacina válida', () => {
    const vaccine = new Vaccine({
      name: 'Antirrábica',
      manufacturer: 'VetLab',
      description: 'Vacina contra raiva',
      requiredDoses: 1,
      intervalDays: 0,
    })

    expect(vaccine.name).toBe('Antirrábica')
    expect(vaccine.manufacturer).toBe('VetLab')
    expect(vaccine.description).toBe('Vacina contra raiva')
    expect(vaccine.requiredDoses).toBe(1)
    expect(vaccine.intervalDays).toBe(0)
  })

  it('deve lançar erro se o nome não for informado', () => {
    expect(() => new Vaccine({
      manufacturer: 'VetLab',
      requiredDoses: 1,
    })).toThrow('O nome da vacina é obrigatório!')
  })

  it('deve lançar erro se o fabricante não for informado', () => {
    expect(() => new Vaccine({
      name: 'Antirrábica',
      requiredDoses: 1,
    })).toThrow('O fabricante da vacina é obrigatório!')
  })

  it('deve lançar erro se requiredDoses for menor ou igual a zero', () => {
    expect(() => new Vaccine({
      name: 'Antirrábica',
      manufacturer: 'VetLab',
      requiredDoses: 0,
    })).toThrow('A quantidade de doses deve ser maior que zero!')
  })

  it('deve lançar erro se intervalDays for negativo', () => {
    expect(() => new Vaccine({
      name: 'Antirrábica',
      manufacturer: 'VetLab',
      requiredDoses: 1,
      intervalDays: -1,
    })).toThrow('O intervalo entre doses não pode ser negativo!')
  })
})