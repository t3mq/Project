const express = require('express');
const router = express.Router();

const alerteController = require('../controllers/alertes.controller');

// GET toutes les alertes
router.get('/', alerteController.getAlertes);

// POST lancer génération alertes
router.post('/run', alerteController.runAlertes);

module.exports = router;