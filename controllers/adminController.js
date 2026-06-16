const db = require('../models/db');
// 1. Mostrar clientes (Actualizado con fecha_vencimiento)
exports.listarClientes = (req, res) => {
    const query = "SELECT id, nombre, correo, fecha_registro, fecha_vencimiento FROM usuarios WHERE rol = 'cliente'";
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensaje: 'Error al consultar clientes' });
        }
        res.status(200).json(results);
    });
};
// 2. NUEVO: Borrar cliente
exports.borrarCliente = (req, res) => {
    const idCliente = req.params.id; // Capturamos el ID de la URL    
    const query = "DELETE FROM usuarios WHERE id = ? AND rol = 'cliente'"; 
    db.query(query, [idCliente], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensaje: 'Error al borrar el cliente' });
        }
        res.status(200).json({ mensaje: 'Cliente eliminado correctamente' });
    });
};
// 3. NUEVO: Crear un cliente desde el panel
exports.crearCliente = (req, res) => {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    // Calculamos la fecha de vencimiento (1 mes exacto desde hoy)
    const hoy = new Date();
    hoy.setMonth(hoy.getMonth() + 1);
    const fechaVencimiento = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD para MySQL
    const query = "INSERT INTO usuarios (nombre, correo, password, rol, fecha_vencimiento) VALUES (?, ?, ?, 'cliente', ?)";
    db.query(query, [nombre, correo, password, fechaVencimiento], (err, results) => {
        if (err) {
            console.error(err);
            // Si el correo ya existe, MySQL arrojará un error de duplicado (ER_DUP_ENTRY)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ mensaje: 'Este correo ya está registrado' });
            }
            return res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
        res.status(201).json({ mensaje: 'Cliente registrado exitosamente' });
    });
};
// --- FUNCIONES PARA MEMBRESÍAS Y PROMOCIONES ---
// Leer membresías
exports.listarMembresias = (req, res) => {
    const query = "SELECT * FROM membresias";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error al consultar membresías' });
        res.status(200).json(results);
    });
};
// Crear nueva membresía
exports.crearMembresia = (req, res) => {
    const { nombre, precio, duracion_meses } = req.body;
    if (!nombre || !precio || !duracion_meses) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    const query = "INSERT INTO membresias (nombre, precio, duracion_meses) VALUES (?, ?, ?)";
    db.query(query, [nombre, precio, duracion_meses], (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error al crear membresía' });
        res.status(201).json({ mensaje: 'Membresía creada exitosamente' });
    });
};
// Borrar membresía
exports.borrarMembresia = (req, res) => {
    const id = req.params.id;
    // En vez de: "DELETE FROM membresias WHERE id = ?"
    const query = "UPDATE membresias SET estado = 'inactivo' WHERE id = ?";
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error al desactivar la membresía' });
        res.status(200).json({ mensaje: 'Membresía dada de baja (inactiva) correctamente.' });
    });
};
// Habilitar membresía (Cambiar estado a activo)
exports.habilitarMembresia = (req, res) => {
    const id = req.params.id;
    const query = "UPDATE membresias SET estado = 'activo' WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error al habilitar la membresía' });
        res.status(200).json({ mensaje: 'Membresía habilitada y lista para venderse nuevamente.' });
    });
};
// Obtener todos los pagos globales con Filtro de Fechas y Planes
exports.obtenerTodosLosPagos = (req, res) => {
    const { inicio, fin, plan } = req.query; 
    // Usamos WHERE 1=1 como truco de Senior para poder concatenar filtros dinámicamente
    let query = `
        SELECT h.fecha_pago, u.nombre AS cliente, m.nombre AS plan, h.monto 
        FROM historial_pagos h
        JOIN usuarios u ON h.usuario_id = u.id
        JOIN membresias m ON h.membresia_id = m.id
        WHERE 1=1 
    `;
    let queryParams = [];
    // Filtro 1: Rango temporal
    if (inicio && fin) {
        query += " AND DATE(h.fecha_pago) BETWEEN ? AND ? ";
        queryParams.push(inicio, fin);
    }
    // Filtro 2: Tipo de Plan (Desplegable)
    if (plan && plan !== 'todos') {
        query += " AND m.id = ? ";
        queryParams.push(plan);
    }
    query += " ORDER BY h.fecha_pago DESC LIMIT 50";
    
    db.query(query, queryParams, (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error al cargar pagos' });
        res.status(200).json(results);
    });
};