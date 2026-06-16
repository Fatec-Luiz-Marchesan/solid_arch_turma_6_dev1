const mongoose = require('../../../db/conn')
const { Schema } = mongoose

const NotificationModel = mongoose.model(
  'Notification',
  new Schema(
    {
      recipientId: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
        maxlength: [500, 'A mensagem da notificação é muito longa!'],
      },
      priority: {
        type: String,
        enum: ['low', 'normal', 'high'],
        default: 'normal',
      },
      type: {
        type: String,
        enum: {
          values: ['system', 'promo', 'alert'],
          message: 'Tipo de notificação inválido!',
        },
        default: 'system',
      },
      read: {
        type: Boolean,
        default: false,
      },
      expiresAt: {
        type: Date,
        default: null
      },
    },
    { timestamps: true }
  )
)

module.exports = NotificationModel