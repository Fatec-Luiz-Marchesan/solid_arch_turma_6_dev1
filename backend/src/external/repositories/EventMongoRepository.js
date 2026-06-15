const { IEventRepository } = require('../../domain/repositories/IEventRepository')
const EventModel = require('../models/EventModel')

class EventMongoRepository extends IEventRepository {
  async create(eventData) {
    const doc = await EventModel.create(eventData)

    return {
      id: doc._id.toString(),
      title: doc.title,
      startsAt: doc.startsAt,
      endsAt: doc.endsAt,
      organizerId: doc.organizerId,
      location: doc.location,
      capacity: doc.capacity,
      status: doc.status,
      category: doc.category,
    }
  }
}

module.exports = { EventMongoRepository }