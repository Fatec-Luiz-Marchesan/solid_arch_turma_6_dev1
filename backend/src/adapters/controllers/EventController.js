const { CreateEvent } = require('../../use-cases/CreateEvent')
const { EventMongoRepository } = require('../../external/repositories/EventMongoRepository')
const { SystemClock } = require('../../external/adapters/SystemClock')

module.exports = class EventController {
  // POST /events/create
  static async create(req, res) {
    const { title, startsAt, endsAt, organizerId } = req.body

    const eventRepository = new EventMongoRepository()
    const clock = new SystemClock()
    const createEvent = new CreateEvent(eventRepository, clock)

    try {
      const event = await createEvent.execute({ title, startsAt, endsAt, organizerId })
      return res.status(201).json({
        message: 'Evento criado com sucesso!',
        event,
      })
    } catch (error) {
      return res.status(422).json({ message: error.message })
    }
  }
}