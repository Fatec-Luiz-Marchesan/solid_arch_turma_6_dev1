class InputSanitizer {
    static sanitize(payload) {
    if (!payload || typeof payload !== 'object') {
      return {}
    }

    const result = {}
    for (const key of Object.keys(payload)) {
      const value = payload[key]
      if (typeof value === 'string') {
        let sanitized = value
         let previous
         do {
           previous = sanitized
           sanitized = sanitized
            
             .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
            
             .replace(/<[^>]*>/g, '')
         } while (sanitized !== previous)
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