const mysql = require('mysql2');
// Configuración por defecto de XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // XAMPP usa 'root' por defecto
    password: '',      // XAMPP no tiene contraseña por defecto
    database: 'vitalgym_db'
});
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la Base de Datos:', err);
    } else {
        console.log('¡Conectado exitosamente a MySQL (XAMPP)!');
    }
});
module.exports = db;