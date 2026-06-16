const router = require('express').Router()
const PetController = require('../controllers/PetController')
const verifyToken = require('../helpers/check-token')
const { uploadService } = require('../src/external/upload')
const { apiLimiter } = require('../src/adapters/middlewares/rateLimiter')

router.use(apiLimiter)

router.post(
    '/create',
    verifyToken,
    uploadService.array('images'),
    PetController.create,
)
router.get('/', PetController.getAll)
router.get('/mypets', PetController.getAllUserPets)
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)
router.get('/:id', PetController.getPetById)
router.delete('/:id', verifyToken, PetController.removePetById)
router.patch('/schedule/:id', verifyToken, PetController.schedule)
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)

module.exports = router