const { AuditEvent } = require('../domain/entities/AuditEvent')

class RecordAuditEvent {
  constructor(auditRepository) {
    this.auditRepository = auditRepository
  }

  async execute({ action, actorId, targetId, metadata }) {
    const event = new AuditEvent({ action, actorId, targetId, metadata })

    const recorded = await this.auditRepository.record({
      action: event.action,
      actorId: event.actorId,
      targetId: event.targetId,
      metadata: event.metadata,
    })

    return recorded
  }
}

module.exports = { RecordAuditEvent }