const router = require('express').Router()
const PaymentController = require('../src/adapters/controllers/PaymentController')
const { apiLimiter } = require('../src/adapters/middlewares/rateLimiter')

router.use(apiLimiter)

router.post('/create', PaymentController.create)
router.post('/:id/process', PaymentController.process)

module.exports = router