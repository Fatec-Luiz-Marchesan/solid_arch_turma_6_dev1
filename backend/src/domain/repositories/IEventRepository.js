class IEventRepository {

  async create(eventData) {
    throw new Error('Método create não implementado')
  }
}

module.exports = { IEventRepository }