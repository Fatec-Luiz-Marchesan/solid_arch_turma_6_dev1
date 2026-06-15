const { PRIORITY_BY_TYPE } = require('../domain/entities/helpers/report-priority')
const { Report } = require('../domain/entities/Report')

class CreateReport {

  constructor(reportRepository) {
    this.reportRepository = reportRepository
  }

  async execute({ title, description, type, reporterId }) {

    const report = new Report({ title, description, type, reporterId })

    const created = await this.reportRepository.create({
      title: report.title,
      description: report.description,
      type: report.type,
      status: report.status,
      priority: report.priority,
      reporterId: report.reporterId,
    })

    return created
  }
}

module.exports = { CreateReport }