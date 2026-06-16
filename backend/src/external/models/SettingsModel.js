const mongoose = require('../../../db/conn')
const { Schema } = mongoose

const SettingsModel = mongoose.model(
  'Settings',
  new Schema(
    {
      userId: {
        type: String,
        required: true,
        unique: true,
      },
      theme: {
        type: String,
        enum: {
          values: ['light', 'dark'],
          message: 'Tema inválido!',
        },
        default: 'light',
      },
      language: {
        type: String,
        enum: {
          values: ['pt-BR', 'en-US', 'es'],
          message: 'Idioma inválido!',
        },
        default: 'pt-BR',
      },
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  )
)

module.exports = SettingsModel