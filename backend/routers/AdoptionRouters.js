const router = require('express').Router()
 const rateLimit = require('express-rate-limit')
const AdoptionController = require('../src/adapters/controllers/AdoptionController')
const verifyToken = require('../helpers/check-token')

const adoptionLimiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   standardHeaders: true,
   legacyHeaders: false
 })
 router.post('/request', adoptionLimiter, verifyToken, AdoptionController.request)
 router.patch('/review/:id', adoptionLimiter, verifyToken, AdoptionController.review)

module.exports = router