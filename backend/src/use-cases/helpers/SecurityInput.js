
const LIMITS = {
  EMAIL_MAX: 254,  
  PASSWORD_MAX: 128,
}

function sanitizeInput(value) {
  if (typeof value !== 'string') {
    return value
  }
  return value
    .trim()
    .replace(/[\u0000-\u001F\u007F]/g, '')
}

function assertMaxLength(value, max, fieldName) {
  if (typeof value === 'string' && Buffer.byteLength(value, 'utf8') > max) {
    throw new Error(`O campo ${fieldName} excede o tamanho máximo permitido!`)
  }
}

module.exports = { sanitizeInput, assertMaxLength, LIMITS }