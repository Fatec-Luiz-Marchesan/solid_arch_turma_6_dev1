const { sanitizeInput, assertMaxLength } = require('./helpers/SecurityInput')

class UpdateVaccine {
  constructor(vaccineRepository) {
    this.vaccineRepository = vaccineRepository
  }

  async execute(id, data) {
    if (!id) {
      throw new Error('O id da vacina é obrigatório!')
    }

    const sanitizedData = {}

    if (data.name !== undefined) {
      sanitizedData.name = sanitizeInput(data.name)
      assertMaxLength(sanitizedData.name, 100, 'Nome')
    }

    if (data.manufacturer !== undefined) {
      sanitizedData.manufacturer = sanitizeInput(data.manufacturer)
      assertMaxLength(sanitizedData.manufacturer, 100, 'Fabricante')
    }

    if (data.description !== undefined) {
      sanitizedData.description = sanitizeInput(data.description)
      assertMaxLength(sanitizedData.description, 500, 'Descrição')
    }

    if (data.requiredDoses !== undefined) {
      if (data.requiredDoses <= 0) {
        throw new Error('A quantidade de doses deve ser maior que zero!')
      }

      sanitizedData.requiredDoses = data.requiredDoses
    }

    if (data.intervalDays !== undefined) {
      if (data.intervalDays < 0) {
        throw new Error('O intervalo entre doses não pode ser negativo!')
      }

      sanitizedData.intervalDays = data.intervalDays
    }

    return this.vaccineRepository.update(id, sanitizedData)
  }
}

module.exports = { UpdateVaccine }