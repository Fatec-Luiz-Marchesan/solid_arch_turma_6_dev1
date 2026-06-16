class IReviewRepository {
    async create(reviewData) {
        throw new Error('Método create não implementado')
    }

    async findAll(){
        throw new Error('Método findAll não implementado')
    }

    async findByPet(petId){
        throw new Error('Método findByPet não implementado')
    }
}

module.exports = { IReviewRepository }