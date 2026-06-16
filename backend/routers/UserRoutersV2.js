const router = require('express').Router()
const UserController = require('../src/adapters/controllers/UserController')
const ProfileController = require('../src/adapters/controllers/ProfileController')
const { sanitizePayload } = require('../src/adapters/middlewares/sanitizePayload')
const { apiLimiter } = require('../src/adapters/middlewares/rateLimiter')
const checkToken = require('../helpers/check-token')

const REGISTER_FIELDS = ['name', 'email', 'phone', 'password', 'confirmpassword']

router.post(
  '/register',
  sanitizePayload(REGISTER_FIELDS),
  UserController.register,
)

router.get('/profile/:id', UserController.profile)

router.post('/profile', apiLimiter, checkToken, ProfileController.create)

module.exports = router