import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  User,
  DollarSign,
  Tag,
  FileText,
  Calendar,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { getUsers } from '@/api/user';

export default function TaskCard({ task, index, assignTask }) {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    console.log(task);

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

  const handleAssignTask = (value) => {
    assignTask(task.id_service, value);
    task.rut_user = value;
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {task.name_service}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Select onValueChange={handleAssignTask}>
                  <SelectTrigger className="h-8 w-8 p-0">
                    <User className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((staffMember) => (
                      <SelectItem key={staffMember.rut} value={staffMember.rut}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={staffMember.profile_picture} />
                          </Avatar>
                          <span>{staffMember.name_user}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    <DropdownMenuItem className="bg-background text-foreground cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                      <FileText />
                      <span>Ver detalles</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <Tag className="mr-1 h-3 w-3" />
                  <span className="truncate">{task.category}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-3 w-3" />
                  <span>{task.price_service}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>{task.payment_method_service}</span>
                </div>
                {task.rut_user && (
                  <div className="flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    <span className="truncate">RUT: {task.rut_user}</span>
                  </div>
                )}
              </div>
              <p
                className="mt-2 text-xs text-gray-600 line-clamp-2"
                title={task.description_service}
              >
                {task.description_service}
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
