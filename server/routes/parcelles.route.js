import express from 'express'
import { getAllParcelles, getParcelleById, createParcelle, updateParcelle, deleteParcelle } from '../controllers/parcelles.controller.js'

const router = express.Router()

router.get('/', getAllParcelles)
router.get('/:id', getParcelleById)
router.post('/', createParcelle)
router.put('/:id', updateParcelle)
router.delete('/:id', deleteParcelle)

export default router
