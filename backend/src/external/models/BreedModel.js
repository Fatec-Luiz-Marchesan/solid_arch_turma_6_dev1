const mongoose = require('../../../db/conn')
const { Schema } = mongoose

const breedSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    species: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
  },
  { timestamps: true }
)

const BreedModel = mongoose.model('Breed', breedSchema)

module.exports = BreedModel