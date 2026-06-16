const mongoose = require('../../../db/conn')
const { Schema } = mongoose

const PaymentModel = mongoose.model(
  'Payment',
  new Schema(
    {
      payer: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: [0.01, 'O valor do pagamento deve ser maior que zero!'],
      },
      currency: {
        type: String,
        required: true,
        enum: ['BRL', 'USD', 'EUR'],
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
      requiresReview: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
)

module.exports = PaymentModel