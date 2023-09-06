const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(express.json());

// Configuración de CORS
app.use(cors({
  origin: 'http://127.0.0.1:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/todo-list', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB'));
db.once('open', () => {
  console.log('Conectado a la base de datos MongoDB');
});

// Rutas
app.use('/api/tasks', taskRoutes);

// Iniciar servidor
app.listen(5000, () => {
  console.log('Servidor en ejecución en el puerto 5000');
});
