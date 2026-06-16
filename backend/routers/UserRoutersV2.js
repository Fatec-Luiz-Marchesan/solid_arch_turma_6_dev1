const router = require('express').Router()
const UserController = require('../src/adapters/controllers/UserController')

router.post('/register', UserController.register)
router.get('/profile/:id', UserController.profile)

module.exports = router