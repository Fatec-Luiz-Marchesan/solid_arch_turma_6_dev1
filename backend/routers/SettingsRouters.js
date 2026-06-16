const router = require('express').Router()

const { SettingsController } = require('../src/adapters/controllers/SettingsController')
const { CreateSettings } = require('../src/use-cases/CreateSettings')
const { ListSettings } = require('../src/use-cases/ListSettings')
const { GetSettingsById } = require('../src/use-cases/GetSettingsById')
const { UpdateSettings } = require('../src/use-cases/UpdateSettings')
const { DeleteSettings } = require('../src/use-cases/DeleteSettings')
const { SettingsMongoRepository } = require('../src/external/repositories/SettingsMongoRepository')

const settingsRepository = new SettingsMongoRepository()

const createSettings = new CreateSettings(settingsRepository)
const listSettings = new ListSettings(settingsRepository)
const getSettingsById = new GetSettingsById(settingsRepository)
const updateSettings = new UpdateSettings(settingsRepository)
const deleteSettings = new DeleteSettings(settingsRepository)

const settingsController = new SettingsController(
  createSettings,
  listSettings,
  getSettingsById,
  updateSettings,
  deleteSettings
)

router.post('/', settingsController.create.bind(settingsController))
router.get('/', settingsController.findAll.bind(settingsController))
router.get('/:id', settingsController.findById.bind(settingsController))
router.patch('/:id', settingsController.update.bind(settingsController))
router.delete('/:id', settingsController.delete.bind(settingsController))

module.exports = router