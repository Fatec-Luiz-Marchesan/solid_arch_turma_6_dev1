const ALLOWED_FIELDS = ['payer', 'amount', 'currency']

function sanitizePayment(payload) {
  if (!payload || typeof payload !== 'object') {
    return {}
  }

  const clean = {}

  for (const field of ALLOWED_FIELDS) {
    if (payload[field] === undefined) continue

    let value = payload[field]

    if (typeof value === 'string') {
      value = value.trim()
    }

    clean[field] = value
  }

  if (typeof clean.amount === 'string') {
    const parsed = Number(clean.amount)
    if (!Number.isNaN(parsed)) {
      clean.amount = parsed
    }
  }

  return clean
}

module.exports = { sanitizePayment }