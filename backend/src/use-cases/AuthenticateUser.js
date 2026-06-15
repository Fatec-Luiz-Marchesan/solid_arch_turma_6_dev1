const { sanitizeInput, assertMaxLength, LIMITS} = require('./helpers/SecurityInput')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

class AuthenticateUser {

  constructor(userRepository, hashComparer, tokenGenerator) {
    this.userRepository = userRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async execute({ email, password }) {

    assertMaxLength(email, LIMITS.EMAIL_MAX, 'E-mail')
    assertMaxLength(password, LIMITS.PASSWORD_MAX, 'Senha')

    email = sanitizeInput(email)

    if (!email) {
      throw new Error('O e-mail é obrigatório!')
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new Error('Formato de e-mail inválido!')
    }
    if (!password) {
      throw new Error('A senha é obrigatória!')
    }

    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new Error('Não há usuário cadastrado com este e-mail!')
    }

    const passwordMatches = await this.hashComparer.compare(password, user.password)
    if (!passwordMatches) {
      throw new Error('Senha inválida')
    }

    const token = this.tokenGenerator.generate({ id: user.id, name: user.name })

    return {
      message: 'Você está autenticado!',
      token,
      userId: user.id,
    }
  }
}

module.exports = { AuthenticateUser }