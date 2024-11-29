import { Droppable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Clipboard, ClipboardCheck, Clock } from 'lucide-react';
import TaskCard from './TaskCard';

const columnConfig = {
  pendiente: {
    icon: Clipboard,
    title: 'Pendientes',
    color: 'bg-violet-50 dark:bg-violet-950/40',
    borderColor: 'border-violet-200 dark:border-violet-800/40',
    hoverColor: 'hover:bg-violet-50 dark:hover:bg-violet-900/40',
  },
  en_progreso: {
    icon: Clock,
    title: 'En Progreso',
    color: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800/40',
    hoverColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/40',
  },
  completado: {
    icon: ClipboardCheck,
    title: 'Completados',
    color: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-800/40',
    hoverColor: 'hover:bg-green-50 dark:hover:bg-green-900/40',
  },
};

export default function TaskColumn({ columnId, tasks, assignTask }) {
  const config = columnConfig[columnId];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`p-4 rounded-lg ${config.color} border-2 ${config.borderColor} transition-colors duration-300`}
    >
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Icon className="mr-2 h-5 w-5" />
        {config.title}
      </h2>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-2 min-h-[200px] transition-colors duration-300 rounded-lg p-2 ${
              snapshot.isDraggingOver
                ? 'bg-white/50 border-2 border-dashed border-blue-400'
                : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                assignTask={assignTask}
              />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="text-center py-4 text-gray-500 italic">
                No hay tareas
              </div>
            )}
          </div>
        )}
      </Droppable>
    </motion.div>
  );
}
