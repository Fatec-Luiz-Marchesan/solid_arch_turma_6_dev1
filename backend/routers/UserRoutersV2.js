const router = require('express').Router()
const UserController = require('../src/adapters/controllers/UserController')
const { sanitizePayload } = require('../src/adapters/middlewares/sanitizePayload')

// 1. Defina a constante de campos no topo para melhor organização
const REGISTER_FIELDS = ['name', 'email', 'phone', 'password', 'confirmpassword']

// 2. Mantenha apenas a rota /register que utiliza o middleware de segurança
router.post(
  '/register',
  sanitizePayload(REGISTER_FIELDS),
  UserController.register,
)

// 3. Mantenha a rota de perfil que veio da sua branch feat
router.get('/profile/:id', UserController.profile)

module.exports = router