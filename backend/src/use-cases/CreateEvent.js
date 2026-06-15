const { Event } = require('../domain/entities/Event')

class CreateEvent {
  constructor(eventRepository, clock = { now: () => new Date() }) {
    this.eventRepository = eventRepository
    this.clock = clock
  }

  async execute({
    title,
    startsAt,
    endsAt,
    organizerId,
    location,
    capacity,
    status,
    category,
  }) {
    const event = new Event(
      {
        title,
        startsAt,
        endsAt,
        organizerId,
        location,
        capacity,
        status,
        category,
      },
      this.clock.now()
    )

    const created = await this.eventRepository.create({
      title: event.title,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      organizerId: event.organizerId,
      location: event.location,
      capacity: event.capacity,
      status: event.status,
      category: event.category,
    })

    return created
  }
}

module.exports = { CreateEvent }