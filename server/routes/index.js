import express from 'express'
import culturesRouter from './cultures.route.js'
import parcellesRouter from './parcelles.route.js'
import observationsRouter from './observations.js'
import meteoRouter from './meteo.js'
import alertesRouter from './alertes'

const router = express.Router()

router.use('/cultures', culturesRouter)
router.use('/parcelles', parcellesRouter)
router.use('/observations', observationsRouter)
router.use('/meteo', meteoRouter)
router.use('/alertes', alertesRouter)

export default router