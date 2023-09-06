const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  todoNombre: String,
  todoDescripcion: String,
  todoEstado: String,
});

module.exports = mongoose.model('Task', taskSchema);