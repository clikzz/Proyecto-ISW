import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreVertical, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TaskCard({ task, index, assignTask }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`border-2 mb-2 transform transition-all duration-200 bg-gray-50 dark:bg-gray-900 dark:border-slate-700 ${
              snapshot.isDragging
                ? 'shadow-lg scale-105 border-blue-400 dark:border-blue-900 rotate-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm'
                : 'hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-1 hover:shadow-md'
            }`}
          >
            <CardHeader className="flex items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center text-sm font-medium justify-between w-full">
                <span className="flex-1">{task.content}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => assignTask(task.id)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Asignar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {task.assignee ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-4"
                >
                  <Avatar className="border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200">
                    <AvatarImage src={task.assignee.avatar} />
                    <AvatarFallback>
                      {task.assignee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {task.assignee.name}
                    </p>
                    <p className="text-sm text-gray-500">Asignado</p>
                  </div>
                </motion.div>
              ) : (
                <p className="text-sm text-gray-500 italic">Sin asignar</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Draggable>
  );
}
