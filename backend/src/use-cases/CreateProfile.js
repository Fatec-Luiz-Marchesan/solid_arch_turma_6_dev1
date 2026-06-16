const { Profile } = require('../domain/entities/Profile')

class CreateProfile {
  constructor(profileRepository) {
    this.profileRepository = profileRepository
  }

  async execute({ user, bio, phone }) {
    const profile = new Profile({ user, bio, phone })

    const exists = await this.profileRepository.findByUser(profile.user)
    if (exists) {
      throw new Error('Este usuario ja possui um profile!')
    }

    const created = await this.profileRepository.create({
      user: profile.user,
      bio: profile.bio,
      phone: profile.phone,
    })

    return created
  }
}

module.exports = { CreateProfile }