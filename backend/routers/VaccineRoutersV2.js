const router = require('express').Router()

const { VaccineController } = require('../src/adapters/controllers/VaccineController')
const { CreateVaccine } = require('../src/use-cases/CreateVaccine')
const { ListVaccines } = require('../src/use-cases/ListVaccines')
const { GetVaccineById } = require('../src/use-cases/GetVaccineById')
const { UpdateVaccine } = require('../src/use-cases/UpdateVaccine')
const { DeleteVaccine } = require('../src/use-cases/DeleteVaccine')
const { VaccineMongoRepository } = require('../src/external/repositories/VaccineMongoRepository')

const vaccineRepository = new VaccineMongoRepository()

const createVaccine = new CreateVaccine(vaccineRepository)
const listVaccines = new ListVaccines(vaccineRepository)
const getVaccineById = new GetVaccineById(vaccineRepository)
const updateVaccine = new UpdateVaccine(vaccineRepository)
const deleteVaccine = new DeleteVaccine(vaccineRepository)

const vaccineController = new VaccineController(
  createVaccine,
  listVaccines,
  getVaccineById,
  updateVaccine,
  deleteVaccine
)

router.post('/', vaccineController.create.bind(vaccineController))
router.get('/', vaccineController.findAll.bind(vaccineController))
router.get('/:id', vaccineController.findById.bind(vaccineController))
router.patch('/:id', vaccineController.update.bind(vaccineController))
router.delete('/:id', vaccineController.delete.bind(vaccineController))

module.exports = router