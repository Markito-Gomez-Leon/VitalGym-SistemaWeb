const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/clientes', adminController.listarClientes);

// NUEVA RUTA PARA BORRAR (Usa el método DELETE y recibe un ID)
router.delete('/clientes/:id', adminController.borrarCliente);
// NUEVA RUTA PARA CREAR
router.post('/clientes', adminController.crearCliente);
// Rutas para Membresías
router.get('/membresias', adminController.listarMembresias);
router.post('/membresias', adminController.crearMembresia);
router.delete('/membresias/:id', adminController.borrarMembresia);
router.get('/pagos', adminController.obtenerTodosLosPagos);

module.exports = router;