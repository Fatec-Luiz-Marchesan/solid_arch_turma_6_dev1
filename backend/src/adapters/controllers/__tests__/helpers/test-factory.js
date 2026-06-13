const jwt = require('jsonwebtoken')

function makeAuthToken(userId = '64b8f0c2e1a2b3c4d5e6f7a8', name = 'Tester') {
    return jwt.sign({ id: userId, name }, 'nossosecret')
} 

function makePetPayload(overrides = {}) {
    return {
        name: 'Rex',
        age: 2,
        weight: 8,
        color: 'preto',
        description: 'Cão dócil',
        ...overrides,
    }
}

function makeUserPayload(overrides = {}) {
    return {
    name: 'Maria',
    email: `user_${Date.now()}@email.com`,
    phone: '11999999999',
    password: '123456',
    confirmpassword: '123456',
    ...overrides,
    }

}

module.exports = { makeAuthToken, makePetPayload, makeUserPayload }