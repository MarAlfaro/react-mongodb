const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const mongoose = require('mongoose');
// Ruta para crear una nueva tarea
router.post('/create', async (req, res) => {
  try {
    const { todoNombre, todoDescripcion, todoEstado } = req.body;
    const task = new Task({ todoNombre, todoDescripcion, todoEstado });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea.' });
  }
});

// Ruta para obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas.' });
  }
});

// Ruta para obtener una tarea por ID
router.get('/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada.' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tarea.' });
  }
});

// Ruta para actualizar una tarea por ID
router.put('/:taskId', async (req, res) => {
  try {
    const { todoNombre, todoDescripcion, todoEstado } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { todoNombre, todoDescripcion, todoEstado },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada.' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ error: 'Error al actualizar la tarea.' });
  }
});


// Ruta para eliminar una tarea por ID
router.delete('/:taskId', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea.' });
  }
});

module.exports = router;
