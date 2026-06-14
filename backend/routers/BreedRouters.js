const router = require('express').Router()
const BreedController = require('../src/adapters/controllers/BreedController')

router.post('/create', BreedController.create)
router.get('/', BreedController.getAll)

module.exports = router