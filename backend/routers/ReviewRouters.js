const router = require('express').Router()
const ReviewController = require('../src/adapter/controllers/ReviewController')

router.post('/create', ReviewController.create)
router.get('/', ReviewController.getAll)
router.get('/pet/petId', ReviewController.getByPet)

module.exports = router