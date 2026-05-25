const express = require('express');
const router = express.Router();
const socioController = require('../controllers/socioController');

router.get('/planes', socioController.listarPlanesDisponibles); // Nueva ruta para el <select>
router.get('/:id', socioController.obtenerPerfil);
router.post('/:id/pagar', socioController.pagarMembresia);
router.put('/:id', socioController.actualizarPerfil); // Usamos PUT para actualizar
// Ruta para pedir los recibos de pago
router.get('/:id/historial', socioController.obtenerHistorial);

module.exports = router;