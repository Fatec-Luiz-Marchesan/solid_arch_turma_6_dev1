class ListReports {
  constructor(reportRepository) {
    this.reportRepository = reportRepository
  }

  async execute() {
    return this.reportRepository.findAll()
  }
}

module.exports = { ListReports }