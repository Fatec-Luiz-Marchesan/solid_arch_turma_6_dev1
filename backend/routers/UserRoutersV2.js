const router = require('express').Router()
const UserController = require('../src/adapters/controllers/UserController')
const { sanitizePayload } = require('../src/adapters/middlewares/sanitizePayload')

const REGISTER_FIELDS = ['name', 'email', 'phone', 'password', 'confirmpassword']

router.post(
  '/register',
  sanitizePayload(REGISTER_FIELDS),
  UserController.register,
)

module.exports = router