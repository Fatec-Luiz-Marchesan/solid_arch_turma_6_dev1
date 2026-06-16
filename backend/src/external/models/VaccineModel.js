const mongoose = require('mongoose')

const VaccineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'O nome da vacina e muito longo!'],
    match: [/^[a-zA-ZÀ-ÿ0-9\s-]+$/, 'Nome de vacina invalido!'],
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'O fabricante e muito longo!'],
  },
  description: {
    type: String,
    default: '',
    trim: true,
    maxlength: [500, 'A descricao e muito longa!'],
  },
  requiredDoses: {
    type: Number,
    required: true,
    min: 1,
    max: [50, 'Numero de doses invalido!'],
  },
  intervalDays: {
    type: Number,
    default: 0,
    min: 0,
    max: [3650, 'Intervalo invalido!'],
    validate: {
      validator: function (value) {
        if (this.requiredDoses > 1) {
          return value > 0
        }
        return true
      },
      message: 'O intervalo entre doses deve ser maior que zero quando ha mais de uma dose!',
    },
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Vaccine', VaccineSchema)