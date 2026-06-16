const router = require('express').Router()

const { ReportController } = require('../src/adapters/controllers/ReportController')
const { CreateReport } = require('../src/use-cases/CreateReport')
const { ListReports } = require('../src/use-cases/ListReports')
const { ReportMongoRepository } = require('../src/external/repositories/ReportMongoRepository')
const { apiLimiter } = require('../src/adapters/middlewares/rateLimiter')
const { sanitizePayload } = require('../src/adapters/middlewares/sanitizePayload')

const reportRepository = new ReportMongoRepository()

const createReport = new CreateReport(reportRepository)
const listReports = new ListReports(reportRepository)

const reportController = new ReportController(createReport, listReports)

const reportFields = ['title', 'description', 'type', 'reporterId']

// RESTful routes
router.post('/', apiLimiter, sanitizePayload(reportFields), reportController.create.bind(reportController))
router.get('/', apiLimiter, reportController.getAll.bind(reportController))

// Legacy route – Open/Closed Principle: mantém contrato anterior
router.post('/create', apiLimiter, sanitizePayload(reportFields), reportController.create.bind(reportController))

module.exports = router