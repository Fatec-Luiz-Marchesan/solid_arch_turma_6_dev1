class ListAdmins {
  constructor(adminRepository) {
    this.adminRepository = adminRepository
  }

  async execute() {
    // O repositório já retorna os admins sem a senha (.select('-password')).
    const admins = await this.adminRepository.findAll()
    return admins
  }
}

module.exports = { ListAdmins }