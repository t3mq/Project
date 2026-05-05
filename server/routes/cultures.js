import express from 'express'
import { getAllCultures, getCultureById, createCulture, updateCulture, deleteCulture } from '../controllers/cultures.controller.js'

const router = express.Router()

router.get('/', getAllCultures)
router.get('/:id', getCultureById)
router.post('/', createCulture)
router.put('/:id', updateCulture)
router.delete('/:id', deleteCulture)

export default router