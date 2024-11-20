import TaskColumn from './TaskColumn'

const columnsOrder = ['pendiente', 'en_progreso', 'completado']

export default function TaskBoard({ tasks, assignTask }) {
  const getColumnTasks = (columnId) => {
    return tasks.filter(task => task.status === columnId)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columnsOrder.map(columnId => (
        <TaskColumn
          key={columnId}
          columnId={columnId}
          tasks={getColumnTasks(columnId)}
          assignTask={assignTask}
        />
      ))}
    </div>
  )
}
