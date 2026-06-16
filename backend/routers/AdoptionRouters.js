const router = require('express').Router()
const AdoptionController = require('../src/adapters/controllers/AdoptionController')
const verifyToken = require('../helpers/check-token')

router.post('/request', verifyToken, AdoptionController.request)
router.patch('/review/:id', verifyToken, AdoptionController.review)

module.exports = router