class Vaccine {
  constructor({ id, name, manufacturer, description, requiredDoses, intervalDays }) {
    if (!name) {
      throw new Error('O nome da vacina é obrigatório!')
    }

    if (!manufacturer) {
      throw new Error('O fabricante da vacina é obrigatório!')
    }

    if (!requiredDoses || requiredDoses <= 0) {
      throw new Error('A quantidade de doses deve ser maior que zero!')
    }

    if (intervalDays !== undefined && intervalDays < 0) {
      throw new Error('O intervalo entre doses não pode ser negativo!')
    }

    this.id = id
    this.name = name
    this.manufacturer = manufacturer
    this.description = description
    this.requiredDoses = requiredDoses
    this.intervalDays = intervalDays || 0
  }
}

module.exports = { Vaccine }