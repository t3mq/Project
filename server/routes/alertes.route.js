import express from 'express'
import { getAllAlertes, getAlerteById, resolveAlerte, triggerAlertes } from '../controllers/alertes.controller.js'

const router = express.Router()

router.get('/', getAllAlertes)
router.get('/:id', getAlerteById)
router.put('/:id/resolve', resolveAlerte)
router.post('/run', triggerAlertes)

export default router