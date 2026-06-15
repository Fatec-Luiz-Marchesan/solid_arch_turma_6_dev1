class Admin {
  constructor({ name, email, password, role }) {
    if (!email) {
      throw new Error('O email é obrigatório!')
    }
    if (!password || password.length < 6) {
      throw new Error('A senha deve ter no mínimo 6 caracteres!')
    }

    const allowedRoles = ['admin', 'super-admin', 'moderator']
    const finalRole = role || 'admin'
    if (!allowedRoles.includes(finalRole)) {
      throw new Error('Papel de admin inválido!')
    }

    this.name = name
    this.email = email
    this.password = password
    this.role = finalRole
  }
}

module.exports = { Admin }