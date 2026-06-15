const NotificationModel = require('../NotificationModel')

describe('NotificationModel (Schema)', () => {
  it('deve ter os campos obrigatórios recipientId e message', () => {
    const notification = new NotificationModel({})
    const err = notification.validateSync()

    expect(err.errors.recipientId).toBeDefined()
    expect(err.errors.message).toBeDefined()
  })

  it('deve aplicar read=false por padrão', () => {
    const notification = new NotificationModel({
      recipientId: 'user-id',
      message: 'Olá!',
    })

    expect(notification.read).toBe(false)
  })

  it('não deve apresentar erro de validação quando recipientId e message são informados', () => {
    const notification = new NotificationModel({
      recipientId: 'user-id',
      message: 'Olá!',
    })
    const err = notification.validateSync()

    expect(err).toBeUndefined()
  })

  it('deve aceitar prioridade high', () => {
    const notification = new NotificationModel({
      recipientId: 'user-id',
      message: 'Urgente!',
      priority: 'high',
    })
    const err = notification.validateSync()
    expect(err).toBeUndefined()
  })

  it('deve falhar se a prioridade for inválida', () => {
    const notification = new NotificationModel({
      recipientId: 'user-id',
      message: 'Erro de prioridade',
      priority: 'invalida',
    })
    const err = notification.validateSync()
    expect(err.errors.priority).toBeDefined()
  })  
})