import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import TaskBoard from '../components/tasks/TaskBoard';
import { ClipboardCheck } from 'lucide-react';
import { getServices } from '@/api/service';
import { updateTaskStatus as updTaskStatus } from '@/api/task';

export default function TareasPage() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const tasks = await getServices();
    setTasks(tasks);
  };

  useEffect(() => {
    try {
      fetchTasks();
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
    }
  }, []);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Encontrar la tarea que se está moviendo
    const taskToMove = tasks.find((task) => task.id === draggableId);

    if (!taskToMove) return;

    // Crear una nueva lista de tareas sin la tarea que se está moviendo
    const newTasks = tasks.filter((task) => task.id !== draggableId);

    // Encontrar todas las tareas en la columna de destino
    const tasksInDestination = newTasks.filter(
      (task) => task.service_status === destination.droppableId
    );

    // Insertar la tarea en la posición correcta
    const updatedTasks = [
      ...newTasks.filter(
        (task) => task.service_status !== destination.droppableId
      ),
      ...tasksInDestination.slice(0, destination.index),
      { ...taskToMove, service_status: destination.droppableId },
      ...tasksInDestination.slice(destination.index),
    ];

    setTasks(updatedTasks);
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      console.log('Updating task status:', taskId, status);
      await updTaskStatus(taskId, status);
      fetchTasks();
    } catch (error) {
      console.error('Error al actualizar el estado del servicio:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex items-center mb-8"
      >
        <ClipboardCheck size="32" className="mr-2" />
        <h1 className="text-2xl font-bold">Tareas</h1>
      </motion.div>
      <DragDropContext onDragEnd={onDragEnd}>
        <TaskBoard
          tasks={tasks}
          fetchTasks={fetchTasks}
          updateTaskStatus={updateTaskStatus}
        />
      </DragDropContext>
    </motion.div>
  );
}
