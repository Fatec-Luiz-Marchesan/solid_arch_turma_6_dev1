const router = require('express').Router()
const UserController = require('../src/adapters/controllers/UserController')
const ProfileController = require('../src/adapters/controllers/ProfileController')
const { sanitizePayload } = require('../src/adapters/middlewares/sanitizePayload')
const checkToken = require('../helpers/check-token')

// Defina a constante de campos no topo para melhor organização
const REGISTER_FIELDS = ['name', 'email', 'phone', 'password', 'confirmpassword']

// Rota de registro com middleware de segurança
router.post(
  '/register',
  sanitizePayload(REGISTER_FIELDS),
  UserController.register,
)

// Rota de perfil (consulta por id)
router.get('/profile/:id', UserController.profile)

// Rota protegida: exige token válido antes de criar o profile
router.post('/profile', checkToken, ProfileController.create)

module.exports = router