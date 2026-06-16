const SettingsModel = require('../models/SettingsModel')

class SettingsMongoRepository {
  _serialize(doc) {
    if (!doc) return null
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      theme: doc.theme,
      language: doc.language,
      notificationsEnabled: doc.notificationsEnabled,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  async create(settings) {
    const doc = await SettingsModel.create(settings)
    return this._serialize(doc)
  }

  async findAll() {
    const docs = await SettingsModel.find()
    return docs.map((doc) => this._serialize(doc))
  }

  async findById(id) {
    const doc = await SettingsModel.findById(id)
    return this._serialize(doc)
  }

  async findByUserId(userId) {
    const doc = await SettingsModel.findOne({ userId })
    return this._serialize(doc)
  }

  async update(id, data) {
    const doc = await SettingsModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
    return this._serialize(doc)
  }

  async delete(id) {
    const doc = await SettingsModel.findByIdAndDelete(id)
    return this._serialize(doc)
  }
}

module.exports = { SettingsMongoRepository }