// backend/src/routes/dayCoffeeRoutes.js
const express = require('express');
const router = express.Router();
const dayCoffeeController = require('../controllers/dayCoffeeController');

// Rota para buscar todos os cafés do dia
router.get('/', dayCoffeeController.getAllDayCoffees);

// Rota para criar um novo café do dia
router.post('/', dayCoffeeController.createDayCoffee);

module.exports = router;