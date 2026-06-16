const {
  Notification,
  VALID_PRIORITIES,
  VALID_TYPES,
  MAX_MESSAGE_LENGTH,
} = require('../Notification')

describe('Notification — validações e contrato (unidade)', () => {
  const makeValid = (overrides = {}) => ({
    recipientId: 'user-1',
    message: 'Seu pet foi adotado!',
    ...overrides,
  })

  describe('Contrato de constantes de validação', () => {
    it('deve expor as prioridades válidas esperadas', () => {
      // Arrange / Act / Assert
      expect(VALID_PRIORITIES).toEqual(['low', 'normal', 'high'])
    })

    it('deve expor os tipos válidos esperados', () => {
      expect(VALID_TYPES).toEqual(['system', 'promo', 'alert'])
    })

    it('deve definir o limite máximo de mensagem como 500', () => {
      expect(MAX_MESSAGE_LENGTH).toBe(500)
    })
  })

  describe('Método isExpired()', () => {
    it('deve retornar false quando não há data de expiração', () => {
      // Arrange
      const notif = new Notification(makeValid({ expiresAt: undefined }))
      // Act
      const result = notif.isExpired()
      // Assert
      expect(result).toBe(false)
    })

    it('deve retornar false quando a data de expiração está no futuro', () => {
      const futuro = new Date(Date.now() + 60_000)
      const notif = new Notification(makeValid({ expiresAt: futuro }))

      expect(notif.isExpired()).toBe(false)
    })

    it('deve retornar true quando a data de expiração já passou', () => {
      const passado = new Date(Date.now() - 60_000)
      const notif = new Notification(makeValid({ expiresAt: passado }))

      expect(notif.isExpired()).toBe(true)
    })
  })

  describe('Atribuição de campos opcionais', () => {
    it('deve definir expiresAt como null quando não informado', () => {
      const notif = new Notification(makeValid())

      expect(notif.expiresAt).toBeNull()
    })

    it('deve respeitar read=true quando informado explicitamente', () => {
      const notif = new Notification(makeValid({ read: true }))

      expect(notif.read).toBe(true)
    })

    it('deve aceitar todas as prioridades válidas sem lançar erro', () => {
      for (const priority of VALID_PRIORITIES) {
        const notif = new Notification(makeValid({ priority }))
        expect(notif.priority).toBe(priority)
      }
    })
  })
})