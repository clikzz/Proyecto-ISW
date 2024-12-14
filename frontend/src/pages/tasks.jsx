import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import TaskBoard from "../components/tasks/TaskBoard";
import { ClipboardCheck } from "lucide-react";
import { getServices } from "../api/service";

export default function TareasPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    try {
      const fetchServices = async () => {
        const tasks = await getServices();
        console.log(tasks);
        setTasks(tasks);
      };

      fetchServices();
    } catch (error) {
      console.error("Error al obtener los servicios:", error);
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

  const assignTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              assignee: {
                name: "Nuevo Usuario",
                avatar: "/placeholder.svg?height=32&width=32",
              },
              service_status: "in_progress",
            }
          : task
      )
    );
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
        <TaskBoard tasks={tasks} assignTask={assignTask} />
      </DragDropContext>
    </motion.div>
  );
}
