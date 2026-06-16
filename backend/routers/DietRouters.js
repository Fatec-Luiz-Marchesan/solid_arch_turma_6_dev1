const router = require('express').Router()
const DietController = require('../src/adapters/controllers/DietController')

router.post('/create', DietController.create)
router.get('/', DietController.getAll)
router.get('/:id', DietController.getById)
router.patch('/:id', DietController.update)
router.delete('/:id', DietController.remove)

module.exports = router