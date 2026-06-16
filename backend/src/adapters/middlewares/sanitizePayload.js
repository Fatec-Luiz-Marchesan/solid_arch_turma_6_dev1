const { InputSanitizer } = require('../security/InputSanitizer')

function sanitizePayload(allowedKeys) {
  return (req, res, next) => {
    const cleaned = InputSanitizer.sanitize(req.body)
    req.body = InputSanitizer.pick(cleaned, allowedKeys)
    next()
  }
}

module.exports = { sanitizePayload }