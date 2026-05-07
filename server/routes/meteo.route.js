import express from 'express'
import { getMeteo, getLatestMeteo } from '../controllers/meteo.controller.js'

const router = express.Router()

router.get('/', getMeteo)
router.get('/latest', getLatestMeteo)

export default router
