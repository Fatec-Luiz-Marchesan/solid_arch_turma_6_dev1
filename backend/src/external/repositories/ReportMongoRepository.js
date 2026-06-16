const { IReportRepository } = require('../../domain/repositories/IReportRepository')
const ReportModel = require('../models/ReportModel')

class ReportMongoRepository extends IReportRepository {
  _serialize(doc) {
    if (!doc) return null
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      type: doc.type,
      status: doc.status,
      priority: doc.priority,
      reporterId: doc.reporterId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  async create(reportData) {
    const doc = await ReportModel.create(reportData)
    return this._serialize(doc)
  }

  async findAll() {
    const docs = await ReportModel.find().sort('-createdAt')
    return docs.map((doc) => this._serialize(doc))
  }
}

module.exports = { ReportMongoRepository }