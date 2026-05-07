import express from 'express'
import culturesRouter from './cultures.route.js'
import parcellesRouter from './parcelles.route.js'
import observationsRouter from './observations.route.js'
import meteoRouter from './meteo.route.js'
import alertesRouter from './alertes.route.js'
import typeCulturesRouter from './type_cultures.route.js'
import authRouter from './auth.routes.js'

const router = express.Router()

router.use('/cultures', culturesRouter)
router.use('/parcelles', parcellesRouter)
router.use('/observations', observationsRouter)
router.use('/meteo', meteoRouter)
router.use('/alertes', alertesRouter)
router.use('/type-cultures', typeCulturesRouter)
router.use('/auth', authRouter)

export default router