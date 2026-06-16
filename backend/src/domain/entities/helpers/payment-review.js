const REVIEW_THRESHOLD_BY_CURRENCY = {
    BRL: 5000,
    USD: 1000,
    EUR: 1000,
}

function requiresReview({amount, currency}) {
    const threhold = REVIEW_THRESHOLD_BY_CURRENCY[currency]
    if (threhold === undefined){
        return false
    }
    return amount > threhold
}

module.exports = {requiresReview, REVIEW_THRESHOLD_BY_CURRENCY}