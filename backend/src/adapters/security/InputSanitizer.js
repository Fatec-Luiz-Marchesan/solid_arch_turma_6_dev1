const sanitizeHtml = require('sanitize-html')

class InputSanitizer {
    static sanitize(payload) {
    if (!payload || typeof payload !== 'object') {
      return {}
    }

    const result = {}
    for (const key of Object.keys(payload)) {
      const value = payload[key]
      if (typeof value === 'string') {
       const sanitized = sanitizeHtml(value, {
           allowedTags: [],
           allowedAttributes: {}
         })
         result[key] = sanitized.trim()
      } else {
        result[key] = value
      }
    }
    return result
  }

  static pick(payload, allowedKeys) {
    if (!payload || typeof payload !== 'object') {
      return {}
    }

    const result = {}
    for (const key of allowedKeys) {
      if (payload[key] !== undefined) {
        result[key] = payload[key]
      }
    }
    return result
  }
}

module.exports = { InputSanitizer }