const mongoose = require('../../../db/conn')
const { Schema } = mongoose

const DietModel = mongoose.model(
  'Diet',
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      pet: {
        type: String,
        required: true,
      },
      dailyCalories: {
        type: Number,
        required: true,
        min: [1, 'As calorias diárias devem ser maiores que zero!'],
      },
      type: {
        type: String,
        enum: ['weight-loss', 'maintenance', 'weight-gain', 'medical'],
        default: 'maintenance',
      },
      mealsPerDay: {
        type: Number,
        default: 2,
        min: [1, 'O número de refeições por dia deve ser no mínimo 1!'],
      },
      requiresVetApproval: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
)

module.exports = DietModel