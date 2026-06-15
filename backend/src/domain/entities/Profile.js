class Profile {
  constructor({ user, bio, phone }) {
    if (!user) {
      throw new Error('O usuario e obrigatorio!')
    }
    if (bio && bio.length > 300) {
      throw new Error('A bio e muito longa!')
    }
    if (phone && !/^[0-9]{10,11}$/.test(phone)) {
      throw new Error('Telefone invalido!')
    }

    this.user = user
    this.bio = bio || ''
    this.phone = phone || ''
  }
}

module.exports = { Profile }