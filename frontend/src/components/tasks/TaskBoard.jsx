import { motion } from 'framer-motion';
import TaskColumn from './TaskColumn';

const columnsOrder = ['pendiente', 'en_progreso', 'completado'];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function TaskBoard({ tasks, assignTask }) {
  const getColumnTasks = (columnId) => {
    return tasks.filter(task => task.status === columnId);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {columnsOrder.map(columnId => (
        <TaskColumn
          key={columnId}
          columnId={columnId}
          tasks={getColumnTasks(columnId)}
          assignTask={assignTask}
        />
      ))}
    </motion.div>
  );
}
