import { Droppable } from '@hello-pangea/dnd'
import { Clipboard, ClipboardCheck, Clock } from 'lucide-react'
import TaskCard from './TaskCard'

export default function TaskColumn({ columnId, tasks, assignTask }) {
  const getColumnIcon = (columnId) => {
    switch (columnId) {
      case 'pendiente':
        return <Clipboard className="mr-2 h-4 w-4" />
      case 'en_progreso':
        return <Clock className="mr-2 h-4 w-4" />
      case 'completado':
        return <ClipboardCheck className="mr-2 h-4 w-4" />
      default:
        return null
    }
  }

  const getColumnTitle = (columnId) => {
    switch (columnId) {
      case 'pendiente':
        return 'Pendientes'
      case 'en_progreso':
        return 'En Progreso'
      case 'completado':
        return 'Completados'
      default:
        return ''
    }
  }

  return (
    <div className="p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        {getColumnIcon(columnId)}
        {getColumnTitle(columnId)}
      </h2>
      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
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
          </div>
        )}
      </Droppable>
    </div>
  )
}
