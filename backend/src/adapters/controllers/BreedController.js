const { CreateBreed } = require('../../use-cases/CreateBreed')
const { BreedMongoRepository } = require('../../external/repositories/BreedMongoRepository')

const ERROR_STATUS_MAP = {
  'Já existe uma raça com este nome!': 409,
  'O nome da raça é obrigatório!': 422,
  'A espécie é obrigatória!': 422,
  'Espécie inválida!': 422,
  'Porte inválido!': 422,
}

module.exports = class BreedController {
  static async create(req, res) {
    const { name, species, description, size } = req.body
    const repository = new BreedMongoRepository()
    const createBreed = new CreateBreed(repository)

    try {
      const breed = await createBreed.execute({ name, species, description, size })
      return res.status(201).json({
        message: 'Raça cadastrada com sucesso!',
        breed,
      })
    } catch (error) {
      const status = ERROR_STATUS_MAP[error.message] || 500
      const message =
        status === 500 ? 'Erro interno ao criar raça.' : error.message
      return res.status(status).json({ message })
    }
  }

  static async getAll(req, res) {
    const repository = new BreedMongoRepository()

    try {
      const breeds = await repository.findAll()
      return res.status(200).json({ breeds })
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno ao listar raças.' })
    }
  }
}