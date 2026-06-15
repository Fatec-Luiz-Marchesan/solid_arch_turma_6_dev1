const PRIORITY_BY_TYPE = {
  fraud: 'high',
  abuse: 'high',
  spam: 'medium',
  other: 'low',
}

const VALID_PRIORITIES = ['low', 'medium', 'high']

function resolvePriority(type) {
  return PRIORITY_BY_TYPE[type] || 'low'
}

module.exports = { resolvePriority, VALID_PRIORITIES, PRIORITY_BY_TYPE }
