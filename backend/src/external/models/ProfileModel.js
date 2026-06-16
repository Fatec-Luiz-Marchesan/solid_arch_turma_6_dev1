const mongoose = require('../../../db/conn')
const { Schema } = mongoose

const ProfileModel = mongoose.model(
  'Profile',
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
      },
      bio: {
        type: String,
        default: '',
        maxlength: 300,
      },
      phone: {
        type: String,
        default: '',
      },
    },
    { timestamps: true }
  )
)

module.exports = ProfileModel