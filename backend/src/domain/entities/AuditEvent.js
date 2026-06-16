class AuditEvent {
  constructor({ action, actorId, targetId, metadata }) {
    if (!action) {
      throw new Error('A ação auditada é obrigatória!')
    }
    if (!actorId) {
      throw new Error('O ator da ação é obrigatório!')
    }

    this.action = action
    this.actorId = actorId
    this.targetId = targetId || null
    this.metadata = metadata || {}
  }
}

module.exports = { AuditEvent }