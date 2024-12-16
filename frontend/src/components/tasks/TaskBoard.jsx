import { DragDropContext } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import TaskColumn from './TaskColumn';
import { useAlert } from '@context/alertContext';

const columnsOrder = {
  admin: ['unassigned', 'in_progress', 'done'],
  employee: ['in_progress', 'done']
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function TaskBoard({ tasks, fetchTasks, updateTaskStatus, userRole }) {
  const { showAlert } = useAlert();
  const getColumnTasks = (columnId) => {
    return tasks.filter((task) => task.status_service === columnId);
  };

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

    const task = tasks.find((t) => t.id_service.toString() === draggableId);

    if (
      source.droppableId === 'unassigned' &&
      destination.droppableId === 'in_progress'
    ) {
      if (!task.employee_name) {
        showAlert('Debes asignar un trabajador primero.', 'error');
        return;
      }
    }

    if (
      source.droppableId === 'unassigned' &&
      destination.droppableId === 'done'
    ) {
      if (!task.employee_name) {
        showAlert('Debes asignar un trabajador primero.', 'error');
        return;
      }
    }

    if (
      source.droppableId === 'in_progress' &&
      destination.droppableId === 'done'
    ) {
      if (!task.employee_name) {
        showAlert('Debes asignar un trabajador primero.', 'error');
        return;
      }
    }

    if (
      source.droppableId === 'in_progress' &&
      destination.droppableId === 'unassigned'
    ) {
      showAlert(
        'No puedes mover una tarea en progreso a sin asignar.',
        'error'
      );
      return;
    }

    updateTaskStatus(task.id_service, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {columnsOrder[userRole].map((columnId) => (
          <TaskColumn
            key={columnId}
            columnId={columnId}
            tasks={getColumnTasks(columnId)}
            fetchTasks={fetchTasks}
            updateTaskStatus={updateTaskStatus}
            userRole={userRole}
          />
        ))}
      </motion.div>
    </DragDropContext>
  );
}

