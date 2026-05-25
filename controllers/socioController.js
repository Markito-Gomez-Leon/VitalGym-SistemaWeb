const db = require('../models/db');

// 1. Obtener perfil
exports.obtenerPerfil = (req, res) => {
    const query = `SELECT u.nombre, u.correo, u.fecha_vencimiento, m.nombre AS plan_actual FROM usuarios u LEFT JOIN membresias m ON u.membresia_id = m.id WHERE u.id = ?`;
    db.query(query, [req.params.id], (err, results) => {
        if (err || results.length === 0) return res.status(500).json({ mensaje: 'Error al cargar perfil' });
        res.status(200).json(results[0]);
    });
};

// 2. Obtener planes disponibles
exports.listarPlanesDisponibles = (req, res) => {
    db.query("SELECT id, nombre, precio, duracion_meses FROM membresias WHERE estado = 'activo'", (err, results) => {
        res.status(200).json(results);
    });
};

// 3. Actualizar datos (El que arreglamos)
exports.actualizarPerfil = (req, res) => {
    db.query("UPDATE usuarios SET nombre = ? WHERE id = ?", [req.body.nombre, req.params.id], (err) => {
        res.status(200).json({ mensaje: '¡Perfil actualizado en la Base de Datos!' });
    });
};

// 4. NUEVO: Procesar Pago y Guardar en Historial
exports.pagarMembresia = (req, res) => {
    const idUsuario = req.params.id;
    const idMembresia = req.body.membresia_id;

    // Buscamos cuánto cuesta y cuánto dura el plan elegido
    db.query("SELECT precio, duracion_meses FROM membresias WHERE id = ?", [idMembresia], (err, memRes) => {
        if (err || memRes.length === 0) return res.status(500).json({ mensaje: 'Plan no encontrado' });
        
        const meses = memRes[0].duracion_meses;
        const precio = memRes[0].precio;

        // Actualizamos al usuario
        const queryUpdate = "UPDATE usuarios SET membresia_id = ?, fecha_vencimiento = DATE_ADD(CURDATE(), INTERVAL ? MONTH) WHERE id = ?";
        db.query(queryUpdate, [idMembresia, meses, idUsuario], (err2) => {
            if (err2) return res.status(500).json({ mensaje: 'Error al actualizar usuario' });
            
            // CREAMOS EL RECIBO EN EL HISTORIAL
            const queryInsert = "INSERT INTO historial_pagos (usuario_id, membresia_id, monto) VALUES (?, ?, ?)";
            db.query(queryInsert, [idUsuario, idMembresia, precio], (err3) => {
                res.status(200).json({ mensaje: '¡Pago procesado y guardado en el historial!' });
            });
        });
    });
};

// 5. NUEVO: Obtener el Historial del Cliente
exports.obtenerHistorial = (req, res) => {
    const query = `
        SELECT h.fecha_pago, m.nombre AS plan, h.monto 
        FROM historial_pagos h
        JOIN membresias m ON h.membresia_id = m.id
        WHERE h.usuario_id = ?
        ORDER BY h.fecha_pago DESC
    `;
    db.query(query, [req.params.id], (err, results) => {
        res.status(200).json(results);
    });
};