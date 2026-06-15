const { Vaccine } = require('../domain/entities/Vaccine')
const { sanitizeInput, assertMaxLength } = require('./helpers/SecurityInput')

class CreateVaccine {
  constructor(vaccineRepository) {
    this.vaccineRepository = vaccineRepository
  }

  async execute(data) {
    const sanitizedData = {
      name: sanitizeInput(data.name),
      manufacturer: sanitizeInput(data.manufacturer),
      description: sanitizeInput(data.description),
      requiredDoses: data.requiredDoses,
      intervalDays: data.intervalDays,
    }

    assertMaxLength(sanitizedData.name, 100, 'Nome')
    assertMaxLength(sanitizedData.manufacturer, 100, 'Fabricante')
    assertMaxLength(sanitizedData.description, 500, 'Descrição')

    const vaccine = new Vaccine(sanitizedData)

    return this.vaccineRepository.create(vaccine)
  }
}

module.exports = { CreateVaccine }