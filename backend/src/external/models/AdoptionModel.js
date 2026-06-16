const mongoose = require('../../../db/conn')
const { Schema } = mongoose

const AdoptionModel = mongoose.model(
  'Adoption',
  new Schema(
    {
      pet: {
        type: Schema.Types.ObjectId,
        ref: 'Pet',
        required: true,
      },
      requester: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending',
      },
      message: {
        type: String,
        default: '',
      },
    },
    { timestamps: true }
  )
)

module.exports = AdoptionModel