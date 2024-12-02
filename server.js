const express = require('express');
const cors = require('cors');
const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000',  // Permitir solo solicitudes desde el frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos HTTP permitidos
  credentials: true,  // Permitir el envío de cookies, si es necesario
}));

// Rutas de la API (ejemplo)
app.get('/edificios', (req, res) => {
  res.json({ message: 'Obteniendo edificios...' });
});

// Configuración del servidor para escuchar en el puerto 8080
const PORT = 8080; // Cambiar el puerto
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

