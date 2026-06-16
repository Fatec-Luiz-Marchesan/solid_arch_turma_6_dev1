const ADOPTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
}

const VALID_STATUSES = Object.values(ADOPTION_STATUS)

const ALLOWED_TRANSITIONS = {
  pending: ['approved', 'rejected', 'cancelled'],
  approved: [],
  rejected: [],
  cancelled: [],
}

function canTransition(from, to) {
  const allowed = ALLOWED_TRANSITIONS[from]
  if (!allowed) {
    return false
  }
  return allowed.includes(to)
}

module.exports = { ADOPTION_STATUS, VALID_STATUSES, ALLOWED_TRANSITIONS, canTransition }