const router = require('express').Router()
const EventController = require('../src/adapters/controllers/EventController')

router.post('/create', EventController.create)

module.exports = router