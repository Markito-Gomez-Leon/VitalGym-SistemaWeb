const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Archivos estáticos (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// ---> RUTAS <---
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes); 

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes); 

const socioRoutes = require('./routes/socioRoutes');
app.use('/api/socio', socioRoutes);
// -----------------------------------------

// Ruta de prueba Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});