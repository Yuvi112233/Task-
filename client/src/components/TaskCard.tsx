import { useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowRight, ArrowLeft, Trash2, Clock } from "lucide-react";
import type { Task } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface TaskCardProps {
  task: Task;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
  medium: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
  high: "bg-red-100 text-red-700 hover:bg-red-100/80",
};

export function TaskCard({ task }: TaskCardProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleStatusChange = (newStatus: string) => {
    updateTask.mutate({ id: task.id, status: newStatus });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate({ id: task.id, projectId: task.projectId });
    }
  };

  return (
    <Card className="group card-hover bg-white border-border/50">
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <Badge 
          variant="secondary" 
          className={`capitalize font-medium ${priorityColors[task.priority as keyof typeof priorityColors] || ""}`}
        >
          {task.priority}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <CardTitle className="text-base font-semibold leading-tight mb-2">
          {task.title}
        </CardTitle>
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {task.createdAt && formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
        </div>
        
        <div className="flex gap-1">
          {task.status !== "todo" && (
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full" 
              onClick={() => handleStatusChange(task.status === "done" ? "in_progress" : "todo")}
              title="Move Back"
            >
              <ArrowLeft className="w-3 h-3" />
            </Button>
          )}
          {task.status !== "done" && (
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              onClick={() => handleStatusChange(task.status === "todo" ? "in_progress" : "done")}
              title="Move Forward"
            >
              <ArrowRight className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
