const VaccineModel = require('../models/VaccineModel')

class VaccineMongoRepository {
  async create(vaccine) {
    return VaccineModel.create(vaccine)
  }

  async findAll() {
    return VaccineModel.find()
  }

  async findById(id) {
    return VaccineModel.findById(id)
  }

  async update(id, data) {
    return VaccineModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
  }

  async delete(id) {
    return VaccineModel.findByIdAndDelete(id)
  }
}

module.exports = { VaccineMongoRepository }