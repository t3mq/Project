import express from 'express'
import { getAllTypeCultures, createTypeCulture, updateTypeCulture, deleteTypeCulture } from '../controllers/type_cultures.controller.js'

const router = express.Router()

router.get('/', getAllTypeCultures)
router.post('/', createTypeCulture)
router.put('/:id', updateTypeCulture)
router.delete('/:id', deleteTypeCulture)

export default router
