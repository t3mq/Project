import express from 'express'
import * as parcelleController from '../controllers/parcelles.controller.js'

const router = express.Router()

// GET
router.get('/', parcelleController.getAllParcelles)
router.get('/:id', parcelleController.getParcelleById)

// POST
router.post('/', parcelleController.createParcelle)

// PUT
router.put('/:id', parcelleController.updateParcelle)

// DELETE
router.delete('/:id', parcelleController.deleteParcelle)

export default router
