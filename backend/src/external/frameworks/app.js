const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.static('public'))

const PetRoutes = require('../../../routers/PetRouters')
const UserRoutes = require('../../../routers/UserRouters')
const AdminRoutes = require('../../../routers/AdminRouters')
const UserRoutesV2 = require('../../../routers/UserRoutersV2')
const LocationRoutes = require('../../../routers/LocationRouters')
const PaymentRoutes = require('../../../routers/PaymentRouters')
const DietRoutes = require('../../../routers/DietRouters')
const EventRoutes = require('../../../routers/EventRouters')
const BreedRoutes = require('../../../routers/BreedRouters')
const AdoptionRoutes = require('../../../routers/AdoptionRouters')

app.use('/events', EventRoutes)
app.use('/diets', DietRoutes)
const AuthRoutes = require('../../../routers/Authrouters')

app.use('/breeds', BreedRoutes)

app.use('/auth', AuthRoutes)

app.use('/payments', PaymentRoutes)

app.use('/locations', LocationRoutes)
const ReportRoutes = require('../../../routers/ReportRouters')

app.use('/v2/users', UserRoutesV2)

const ReviewRoutes = require('../../../routers/ReviewRouters')

const VaccineRoutesV2 = require('../../../routers/VaccineRoutersV2')

app.use('/v2/vaccines', VaccineRoutesV2)

app.use('/admins', AdminRoutes)
app.use('/reports', ReportRoutes)
app.use('/reviews', ReviewRoutes)
app.use('/adoptions', AdoptionRoutes)

const SettingsRoutes = require('../../../routers/SettingsRouters')
const { Adoption } = require('../../domain/entities/Adoption')
app.use('/settings', SettingsRoutes)

app.use('/pets', PetRoutes)
app.use('/users', UserRoutes)

module.exports = app