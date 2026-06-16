const VALID_PRIORITIES = ['low', 'normal', 'high']
const VALID_TYPES = ['system', 'promo', 'alert']
const MAX_MESSAGE_LENGTH = 500

class Notification {
    constructor({ recipientId, message, priority, type, read, expiresAt }) {
        if (!recipientId) {
            throw new Error('O destinatário da notificação é obrigatório!')
        }
        if (!message) {
            throw new Error('A mensagem da notificação é obrigatória!')
        }
        if (message.length > MAX_MESSAGE_LENGTH) {
            throw new Error('A mensagem da notificação é muito longa!')
        }

        const finalPriority = priority || 'normal'
        if (!VALID_PRIORITIES.includes(finalPriority)) {
            throw new Error ('Prioridade inválida!')
        }

        const finalType = type || 'system'
        if (!VALID_TYPES.includes(finalType)) {
            throw new Error('Tipo de notificação inválido!')
        }

        this.recipientId = recipientId
        this.message = message
        this.priority = finalPriority
        this.type = finalType
        this.read = read || false
        this.expiresAt = expiresAt || null
    }

    isExpired() {
        if (!this.expiresAt) return false
        return new Date(this.expiresAt).getTime() < Date.now()
    }

    markAsRead() {
        if (this.isExpired()) {
            throw new Error('Não é possível ler uma notificação expirada!')
        }
        this.read = true
    }
}

module.exports = { Notification, VALID_PRIORITIES, VALID_TYPES, MAX_MESSAGE_LENGTH }