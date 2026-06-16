const { IDietRepository } = require('../../domain/repositories/IDietRepository')
const DietModel = require('../models/DietModel')

class DietMongoRepository extends IDietRepository {
  async create(dietData) {
    const doc = await DietModel.create(dietData)
    return {
      id: doc._id.toString(),
      name: doc.name,
      pet: doc.pet,
      dailyCalories: doc.dailyCalories,
      type: doc.type,
      mealsPerDay: doc.mealsPerDay,
    }
  }

  async findAll() {
    const docs = await DietModel.find().sort('-createdAt')
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      pet: doc.pet,
      dailyCalories: doc.dailyCalories,
      type: doc.type,
      mealsPerDay: doc.mealsPerDay,
    }))
  }

  async findById(id) {
    const doc = await DietModel.findById(id)
    if (!doc) {
      return null
    }
    return this._toDTO(doc)
  }

  async update(id, data) {
    const doc = await DietModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
    if (!doc) {
      return null
    }
    return this._toDTO(doc)
  }

  async delete(id) {
    const doc = await DietModel.findByIdAndDelete(id)
    if (!doc) {
      return null
    }
    return this._toDTO(doc)
  }

  _toDTO(doc) {
    return {
      id: doc._id.toString(),
      name: doc.name,
      pet: doc.pet,
      dailyCalories: doc.dailyCalories,
      type: doc.type,
      mealsPerDay: doc.mealsPerDay,
    }
  }
}

module.exports = { DietMongoRepository }