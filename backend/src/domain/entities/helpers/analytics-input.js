const LIMITS = {
  TITLE_MAX: 120,        
  DESCRIPTION_MAX: 2000,  
}

function sanitizeText(value) {
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

module.exports = { sanitizeText, assertMaxLength, LIMITS }