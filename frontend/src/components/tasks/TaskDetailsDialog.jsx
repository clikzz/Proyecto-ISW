import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/helpers/dates';
import { capitalize } from '@/helpers/capitalize';
import { DollarSign, Tag, CreditCard, Clock, UserPlus } from 'lucide-react';

export default function TaskDetailsDialog({
  task,
  isOpen,
  onClose,
  userRole,
  staff,
  onAssignTask,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task.name_service}</DialogTitle>
          <DialogDescription>Detalles completos de la tarea</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Tag className="h-4 w-4 col-span-1" />
            <span className="col-span-3">{capitalize(task.category)}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <DollarSign className="h-4 w-4 col-span-1" />
            <span className="col-span-3">
              {task.price_service?.toLocaleString('es-CL')}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <CreditCard className="h-4 w-4 col-span-1" />
            <span className="col-span-3">
              {capitalize(task.payment_method_service)}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Clock className="h-4 w-4 col-span-1" />
            <span className="col-span-3">{formatDate(task.created_at)}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-semibold col-span-4">Descripción:</span>
            <p className="col-span-4">{capitalize(task.description_service)}</p>
          </div>
          {userRole === 'admin' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold col-span-4">Asignar a:</span>
              <div className="col-span-4">
                <Select
                  onValueChange={onAssignTask}
                  defaultValue={task.employee_rut}
                >
                  <SelectTrigger className="w-full">
                    {task.employee_name ? (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.profile_picture} />
                          <AvatarFallback>
                            {task.employee_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{task.employee_name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <UserPlus className="h-4 w-4" />
                        <span>Asignar</span>
                      </div>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((staffMember) => (
                      <SelectItem key={staffMember.rut} value={staffMember.rut}>
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
              </div>
            </div>
          )}
        </div>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogContent>
    </Dialog>
  );
}
