const { CreateBreed } = require('../../use-cases/CreateBreed')
const {BreedMongoRepository} = require('../../external/repositories/BreedMongoRepository')
const {parseBreedQuery} = require('../validators/breed-query')

const ERROR_STATUS_MAP = {
    'Já existe uma raça com este nome!': 409,
    'O nome da raça é obrigatório!': 422,
    'A espécie é obrigatória!': 422,
    'Espécie inválida!':422,
}

const QUERY_ERROR_MESSAGES = [
    'Espécie inválida!',
    'Parâmetro page inválido',
    'Parâmetro limit inválido!',
]

module.exports = class BreedController {
    static async create(req, res){
        const {name, species, description} = req.body
        const repository = new BreedMongoRepository()
        const CreateBreed = new CreateBreed(repository)

        try{
            const breed = await CreateBreed.execute({name, species, description})
            return res.staus(201).json({
                message: 'Raça cadastrada com sucesso!',
                breed,
            })
        } catch(error) {
            const status = ERROR_STATUS_MAP[error.message] || 500
            const message = status === 500 ? 'Erro interno ao criar raça.' : error.message
            return res.status(status).json({message})
        }
    }

    static async getAll(req, res) {
        const repository = new BreedMongoRepository()

        let query
        try{
            query = parseBreedQuery(req.query)
        } catch (error) {
            if(QUERY_ERROR_MESSAGES.includes(error.message)) {
                return res.status(422).json({message: error.message})
            }
            return res.status(500).json({message: 'Erro interno ao listar raças.'})
        }
        try{
            const{breeds, total} = await repository.findAllFiltered({
                species: query.species,
                skip: query.skip,
                limit: query.limit,
            })
            return res.status(200).json({
                breeds,
                pagination: {
                    page: query.page,
                    limit: query.limit,
                    total,
                },
            })
        } catch (error) {
            return res.status(500).json({message: 'Erro interno ao listar raças.'})
        }
    }
}