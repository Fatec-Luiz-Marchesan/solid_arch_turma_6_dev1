const mongoose = require('mongoose')

const VaccineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  requiredDoses: {
    type: Number,
    required: true,
    min: 1,
  },
  intervalDays: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Vaccine', VaccineSchema)