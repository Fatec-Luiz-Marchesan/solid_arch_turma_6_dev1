const SettingsModel = require('../models/SettingsModel')

class SettingsMongoRepository {
  async create(settings) {
    return SettingsModel.create(settings)
  }

  async findAll() {
    return SettingsModel.find()
  }

  async findById(id) {
    return SettingsModel.findById(id)
  }

  async findByUserId(userId) {
    return SettingsModel.findOne({ userId })
  }

  async update(id, data) {
    return SettingsModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
  }

  async delete(id) {
    return SettingsModel.findByIdAndDelete(id)
  }
}

module.exports = { SettingsMongoRepository }