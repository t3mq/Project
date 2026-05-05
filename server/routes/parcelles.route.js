const express = require('express');
const router = express.Router();

const parcelleController = require('../controllers/parcelles.controller');

// GET
router.get('/', parcelleController.getAllParcelles);
router.get('/:id', parcelleController.getParcelleById);

// POST
router.post('/', parcelleController.createParcelle);

// PUT
router.put('/:id', parcelleController.updateParcelle);

// DELETE
router.delete('/:id', parcelleController.deleteParcelle);

module.exports = router;