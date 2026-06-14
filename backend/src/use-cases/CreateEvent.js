const { Event } = require('../domain/entities/Event')

class CreateEvent {
  // Injeção de dependência via construtor (Dependency Inversion):
  // repositório + relógio (clock) injetável para testes determinísticos.
  constructor(eventRepository, clock = { now: () => new Date() }) {
    this.eventRepository = eventRepository
    this.clock = clock
  }

  async execute({ title, startsAt, endsAt, organizerId }) {
    const event = new Event(
      { title, startsAt, endsAt, organizerId },
      this.clock.now()
    )

    const created = await this.eventRepository.create({
      title: event.title,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      organizerId: event.organizerId,
    })

    return created
  }
}

module.exports = { CreateEvent }