const { ReportValidator } = require('../validators/ReportValidator')

class ReportController {
  constructor(createReport, listReports) {
    this.createReport = createReport
    this.listReports = listReports
  }

  async create(req, res) {
    const schemaError = ReportValidator.validateCreate(req.body)
    if (schemaError) {
      return res.status(422).json({ message: schemaError })
    }

    const { title, description, type, reporterId } = req.body

    try {
      const report = await this.createReport.execute({ title, description, type, reporterId })
      return res.status(201).json({
        message: 'Report criado com sucesso!',
        report,
      })
    } catch (error) {
      return res.status(422).json({ message: error.message })
    }
  }

  async getAll(req, res) {
    try {
      const reports = await this.listReports.execute()
      return res.status(200).json({ reports })
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno ao listar reports.' })
    }
  }
}

module.exports = { ReportController }