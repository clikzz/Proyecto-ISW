import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskBoard from '../components/tasks/TaskBoard';

// Simulated data - replace with actual data fetching in your implementation
const initialTasks = [
  {
    id: 'task1',
    content: 'Reparación de cadena',
    status: 'pendiente',
    assignee: null,
  },
  {
    id: 'task2',
    content: 'Cambio de neumáticos',
    status: 'en_progreso',
    assignee: { name: 'Juan', avatar: '/placeholder.svg?height=32&width=32' },
  },
  {
    id: 'task3',
    content: 'Ajuste de frenos',
    status: 'completado',
    assignee: { name: 'María', avatar: '/placeholder.svg?height=32&width=32' },
  },
];

export default function TareasPage() {
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    // Aquí deberías hacer una llamada a tu API para obtener las tareas
    // setTasks(tasksFromAPI)
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

    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(source.index, 1);
    reorderedItem.status = destination.droppableId;
    newTasks.splice(destination.index, 0, reorderedItem);

    setTasks(newTasks);

    // Aquí deberías hacer una llamada a tu API para actualizar el estado de la tarea
    // updateTaskStatus(draggableId, destination.droppableId)
  };

  const assignTask = (taskId, userId) => {
    // Aquí deberías hacer una llamada a tu API para asignar la tarea
    // Por ahora, solo actualizaremos el estado local
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              assignee: {
                name: 'Nuevo Usuario',
                avatar: '/placeholder.svg?height=32&width=32',
              },
              status: 'en_progreso',
            }
          : task
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Tareas del Taller
      </h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <TaskBoard tasks={tasks} assignTask={assignTask} />
      </DragDropContext>
    </div>
  );
}
