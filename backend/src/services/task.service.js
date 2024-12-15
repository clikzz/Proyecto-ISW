const Service = require('../models/Service');

const taskService = {
  async getTasks() {
    return Service.findAll();
  },

  async assignTask(taskId, workerId) {
    return Service.assignEmployee(taskId, workerId);
  },

  async updateTaskStatus(taskId, status) {
    return Service.updateStatus(taskId, status);
  },
};

module.exports = taskService;
