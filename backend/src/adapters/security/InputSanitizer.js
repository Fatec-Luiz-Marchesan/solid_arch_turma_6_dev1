class InputSanitizer {
    static sanitize(payload) {
    if (!payload || typeof payload !== 'object') {
      return {}
    }

    const result = {}
    for (const key of Object.keys(payload)) {
      const value = payload[key]
      if (typeof value === 'string') {
        result[key] = value
          // remove blocos perigosos junto com seu conteúdo (script/style)
          .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
          // remove quaisquer tags remanescentes, preservando o texto legítimo
          .replace(/<[^>]*>/g, '')
          .trim()
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