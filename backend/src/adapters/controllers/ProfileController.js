const { CreateProfile } = require('../../use-cases/CreateProfile')
const { ProfileMongoRepository } = require('../../external/repositories/ProfileMongoRepository')

const ERROR_STATUS_MAP = {
  'Este usuario ja possui um profile!': 409,
  'O usuario e obrigatorio!': 422,
  'A bio e muito longa!': 422,
  'Telefone invalido!': 422,
}

module.exports = class ProfileController {
  static async create(req, res) {
    const { user, bio, phone } = req.body
    const repository = new ProfileMongoRepository()
    const createProfile = new CreateProfile(repository)

    try {
      const profile = await createProfile.execute({ user, bio, phone })
      return res.status(201).json({
        message: 'Profile criado com sucesso!',
        profile,
      })
    } catch (error) {
      const status = ERROR_STATUS_MAP[error.message] || 500
      const message =
        status === 500 ? 'Erro interno ao criar profile.' : error.message
      return res.status(status).json({ message })
    }
  }
}