const mongoose = require('../../../db/conn')
const { Schema } = mongoose

const BackupModel = mongoose.model(
  'Backup',
  new Schema(
    {
      filename: {
        type: String,
        required: true,
        trim: true,
        // bloqueia path traversal e separadores de diretorio (seguranca)
        match: [/^[^/\\]+$/, 'Nome de arquivo invalido!'],
      },
      triggeredBy: {
        type: String,
        required: true,
        trim: true,
      },
      sizeInBytes: {
        type: Number,
        min: [0, 'O tamanho nao pode ser negativo!'],
        default: 0,
      },
      status: {
        type: String,
        enum: ['pending', 'running', 'completed', 'failed'],
        default: 'pending',
      },
    },
    { timestamps: true }
  )
)

module.exports = BackupModel