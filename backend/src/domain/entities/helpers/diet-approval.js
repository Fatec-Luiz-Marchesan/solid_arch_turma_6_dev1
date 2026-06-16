const SAFE_CALORIE_RANGE = {
    MIN: 200,
    MAX: 1200,
}

    function requiresVetApproval({type, dailyCalories}){
        if (type === 'medical'){
            return true
    }
    if(dailyCalories < SAFE_CALORIE_RANGE.MIN || dailyCalories > SAFE_CALORIE_RANGE.MAX) {
        return true
    }
    return false
    }
    
module.exports = {requiresVetApproval, SAFE_CALORIE_RANGE}