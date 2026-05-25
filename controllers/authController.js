const db = require('../models/db');

exports.login = (req, res) => {
    const { correo, password } = req.body; 

    // Validar que llegaron los datos
    if (!correo || !password) {
        return res.status(400).json({ mensaje: 'Por favor, ingrese correo y contraseña' });
    }

    const query = 'SELECT * FROM usuarios WHERE correo = ? AND password = ?';
    
    db.query(query, [correo, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensaje: 'Error interno del servidor' });
        }

        if (results.length > 0) {
            const usuario = results[0]; 
            // Respondemos con JSON (Éxito)
            res.status(200).json({
                mensaje: 'Login exitoso',
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    rol: usuario.rol
                }
            });
        } else {
             // Respondemos con JSON (Error)
            res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
        }
    });
};
// Registro público de clientes
exports.registro = (req, res) => {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    // Insertamos al usuario como 'cliente'. 
    // fecha_vencimiento y membresia_id quedarán en NULL automáticamente (Sin plan).
    const query = "INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, 'cliente')";

    db.query(query, [nombre, correo, password], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ mensaje: 'Este correo ya está registrado. Por favor, inicie sesión.' });
            }
            return res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
        res.status(201).json({ mensaje: '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.' });
    });
};