import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  User,
  DollarSign,
  Tag,
  Calendar,
  Clock,
  CreditCard,
  Info,
  UserPlus,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { getUsers } from '@/api/user';
import { assignTask } from '@/api/task';
import { formatDate } from '@/helpers/dates';
import { capitalize } from '@/helpers/capitalize';

export default function TaskCard({
  task,
  index,
  columnId,
  fetchTasks,
  updateTaskStatus,
  userRole,
}) {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    try {
      const fetchStaff = async () => {
        const staff = await getUsers();
        setStaff(staff);
      };

      fetchStaff();
    } catch (error) {
      console.error('Error al obtener el personal:', error);
    }
  }, []);

  const handleAssignTask = async (value) => {
    try {
      await assignTask(task.id_service, value);
      fetchTasks();
    } catch (error) {
      console.error('Error al asignar la tarea:', error);
    }
  };

  return (
    <Draggable draggableId={String(task.id_service)} index={index}>
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
            <CardHeader className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 pb-2 px-4 w-full box-border">
              <div className="flex flex-col justify-between sm:flex-row items-start gap-2 sm:items-center w-full">
                <CardTitle className="text-sm font-medium truncate">
                  {task.name_service}
                </CardTitle>
                <div className="flex flex-col sm:flex-row space-x-2 items-center text-xs justify-between w-full sm:w-auto">
                  <Button size="sm" className="ml-auto">
                    <Info className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Detalles</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {userRole === 'admin' && (
                  <Select onValueChange={handleAssignTask}>
                    <SelectTrigger className="h-8 p-1 flex items-center space-x-2">
                      {task.employee_name ? (
                        <>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={task.profile_picture} />
                            <AvatarFallback>
                              {task.employee_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs truncate max-w-[100px]">
                            {task.employee_name}
                          </span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          <span className="text-xs">Asignar</span>
                        </>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((staffMember) => (
                        <SelectItem
                          key={staffMember.rut}
                          value={staffMember.rut}
                        >
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={staffMember.profile_picture} />
                              <AvatarFallback>
                                {staffMember.name_user.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{staffMember.name_user}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <Tag className="mr-1 h-3 w-3" />
                    <span className="truncate">
                      {capitalize(task.category)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-1 h-3 w-3" />
                    <span>{task.price_service?.toLocaleString('es-CL')}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 items-end">
                  <div className="flex items-center">
                    <CreditCard className="mr-1 h-3 w-3" />
                    <span>{capitalize(task.payment_method_service)}</span>
                  </div>
                  {task.rut_user && (
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      <span className="truncate">
                        {formatDate(task.created_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {capitalize(task.description_service)}
              </p>
              {task.assignee && (
                <div className="mt-2 flex items-center space-x-2">
                  <Avatar className="h-6 w-6 border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200">
                    <AvatarImage src={task.assignee.avatar} />
                    <AvatarFallback>
                      {task.assignee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">
                    {task.assignee.name}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Draggable>
  );
}
