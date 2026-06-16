const VALID_SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'other']

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 100

function parseBreedQuery({species, page, limit} =
    {}) {
        const result = {species: undefined, page: DEFAULT_PAGE, limit: DEFAULT_LIMIT}

        if(species !== undefined) {
            if (!VALID_SPECIES.includes(species)){
                throw new Error('Espécie inválida!')
            }

            result.species = species
        }

        if(page !== undefined){
            const parsedPage = Number(page)
            if(!Number.isInteger(parsedPage) ||parsedPage < 1){
                throw new Error('Parâmetro page inválido!')
            }
            result.page = parsedPage
        }
        if (limit !== undefined) {
            const parsedLimit = Number(limit)
            if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > MAX_LIMIT) {
                throw new Error('Parâmetro limit inválido!')
            }
            result.limit = parsedLimit
        }

        result.skip = (result.page - 1) * result.limit
        return result
    }
module.exports = { parseBreedQuery, DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT }