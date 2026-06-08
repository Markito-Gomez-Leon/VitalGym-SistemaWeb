const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Cuando el formulario haga POST a /login, ejecuta la función del controlador
router.post('/login', authController.login);
router.post('/registro', authController.registro);
module.exports = router;