const taskService = require('../services/task.service');

exports.getTasks = async (res) => {
  try {
    const tasks = await taskService.getTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({
      message: 'Error al obtener las tareas',
      error: err.message,
    });
  }
};

exports.assignTask = async (req, res) => {
  try {
    console.log(req.params.id, req.body.rut);

    const task = await taskService.assignTask(req.params.id, req.body.rut);
    res.json(task);
  } catch (err) {
    res.status(500).json({
      message: 'Error al asignar la tarea',
      error: err.message,
    });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await taskService.updateTaskStatus(
      req.params.id,
      req.body.status
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({
      message: 'Error al actualizar el estado de la tarea',
      error: err.message,
    });
  }
};
