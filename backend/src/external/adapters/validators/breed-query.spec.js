const {parseBreedQuery, DEFAULT_PAGE, DEFAULT_LIMIT} = require ('./breed-query')

describe('parseBreedQuery', () => {
    it('deve retornar valores padrão quando a query é vazia', () => {
        const result = parseBreedQuery({})

        expect(result.species).toBeUndefined()
        expect(result.page).toBe(DEFAULT_PAGE)
        expect(result.limit).toBe(DEFAULT_LIMIT)
        expect(result.skip).toBe(0)
    })

    it('deve aceitar uma espécie válida', () =>{
        const result = parseBreedQuery({species: 'dog'})
        expect(result.species).toBe('dog')
        expect(result.page).toBe(DEFAULT_PAGE)
        expect(result.limit).toBe(DEFAULT_LIMIT)
        expect(result.skip).toBe(0)
    })


    it('deve lançar erro para espécie inválida', () =>{
        expect(() => parseBreedQuery({species: 'dinossauro'}))
        .toThrow('Espécie inválida!')
    })

    it('deve calcular o skip a partir de page limit', () =>{
    const result = parseBreedQuery({page: '3', limit: '10'})

    expect(result.page).toBe(3)
    expect(result.limit).toBe(10)
    expect(result.skip).toBe(20)
    })

    it('deve lançar erro para page inválido', () => {
        expect(() => parseBreedQuery({page: '0'}))
        .toThrow('Parâmetro page inválido!')
        expect(() => parseBreedQuery({page: 'abc'}))
        .toThrow('Parâmetro page inválido!')
    })

    it('deve lançar erro para limit inválido', () => {
        expect(() => parseBreedQuery({limit: '0'}))
        .toThrow('Parâmetro limit inválido!')
        expect(() => parseBreedQuery({limit: '500'}))
        .toThrow('Parâmetro limit inválido!')
    })
})