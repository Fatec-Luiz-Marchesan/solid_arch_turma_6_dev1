const { IProfileRepository } = require('../../domain/repositories/IProfileRepository')
const ProfileModel = require('../models/ProfileModel')

class ProfileMongoRepository extends IProfileRepository {
  async findByUser(user) {
    const doc = await ProfileModel.findOne({ user: { $eq: user } })
    if (!doc) return null
    return {
      id: doc._id.toString(),
      user: doc.user.toString(),
      bio: doc.bio,
      phone: doc.phone,
    }
  }

  async create(profileData) {
    const doc = await ProfileModel.create(profileData)
    return {
      id: doc._id.toString(),
      user: doc.user.toString(),
      bio: doc.bio,
      phone: doc.phone,
    }
  }
}

module.exports = { ProfileMongoRepository }