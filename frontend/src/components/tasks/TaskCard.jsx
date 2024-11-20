import { Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TaskCard({ task, index, assignTask }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="border-none mb-2"
        >
          <CardHeader className="flex items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center text-sm font-medium justify-between w-full">
              <span className="flex-1">{task.content}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => assignTask(task.id)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Asignar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {task.assignee ? (
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={task.assignee.avatar} />
                  <AvatarFallback>
                    {task.assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {task.assignee.name}
                  </p>
                  <p className="text-sm">Asignado</p>
                </div>
              </div>
            ) : (
              <p className="text-sm">Sin asignar</p>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}
