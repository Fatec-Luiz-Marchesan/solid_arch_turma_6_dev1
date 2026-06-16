const { RegisterUser } = require('../../use-cases/RegisterUser')
const { UserMongoRepository } = require('../../external/repositories/UserMongoRepository')
const { BcryptHasher } = require('../../external/adapters/BcryptHasher')
const { JwtTokenGenerator } = require('../../external/adapters/JwtTokenGenerator')
const { GetUserProfile } = require('../../use-cases/GetUserProfile')

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body

    if (password && password.length < 6) {
      return res.status(422).json({ message: 'A senha deve ter no mínimo 6 caracteres!'})
    }

    // Composição das dependências (Composition Root)
    const userRepository = new UserMongoRepository()
    const hasher = new BcryptHasher()
    const tokenGenerator = new JwtTokenGenerator()
    const registerUser = new RegisterUser(userRepository, hasher, tokenGenerator)

    try {
      const result = await registerUser.execute({
        name,
        email,
        phone,
        password,
        confirmpassword,
      })
      return res.status(201).json(result)
    } catch (error) {
      return res.status(422).json({ message: error.message })
    }
  }

  static async profile(req, res) {
    const { id } = req.params
    const userRepository = new UserMongoRepository()
    const getUserProfile = new GetUserProfile(userRepository)

    try {
      const user = await getUserProfile.execute(id)
      return res.status(200).json({ user })
    } catch (error) {
      const status = error.statusCode || 422
      return res.status(status).json({ message: error.message })
    }
  }
}