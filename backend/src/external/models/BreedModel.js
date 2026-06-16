const mongoose = require('../../../db/conn')
const { Schema } = mongoose
const breedSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: [100, 'O nome da raca e muito longo!'],
      // aceita letras (com acento), espacos e hifen; bloqueia HTML/script
      match: [/^[a-zA-ZÀ-ÿ\s-]+$/, 'Nome de raca invalido!'],
    },
    species: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'A especie e muito longa!'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'A descricao e muito longa!'],
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