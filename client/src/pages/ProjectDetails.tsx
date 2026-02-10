import { useParams, Link, useLocation } from "wouter";
import { useProject } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import { useSocket } from "@/hooks/use-socket";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, Wifi, WifiOff } from "lucide-react";

const COLUMNS = [
  { id: "todo", title: "To Do", color: "bg-slate-100/80 border-slate-200" },
  { id: "in_progress", title: "In Progress", color: "bg-blue-50/80 border-blue-200" },
  { id: "done", title: "Done", color: "bg-green-50/80 border-green-200" },
];

export default function ProjectDetails() {
  const params = useParams();
  const projectId = Number(params.id);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { data: project, isLoading: projectLoading, error } = useProject(projectId);
  const { data: tasks, isLoading: tasksLoading } = useTasks(projectId);
  const { isConnected } = useSocket(projectId);

  if (!user) {
    setLocation("/login");
    return null;
  }

  if (projectLoading) {
    return (
      <div className="container max-w-7xl mx-auto p-8 space-y-8">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-[500px] rounded-2xl" />
          <Skeleton className="h-[500px] rounded-2xl" />
          <Skeleton className="h-[500px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <Button asChild><Link href="/">Go Back</Link></Button>
      </div>
    );
  }

  const tasksByStatus = (status: string) => {
    return tasks?.filter((t) => t.status === status) || [];
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur z-20 sticky top-0">
        <div className="container max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <div className="p-2 rounded-lg hover:bg-muted/80">
                <ArrowLeft className="w-5 h-5" />
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold font-display leading-tight">{project.name}</h1>
              <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">{project.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border ${
              isConnected 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? "Live Updates" : "Reconnecting..."}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-[1600px] mx-auto p-4 sm:p-6 overflow-x-auto">
        <div className="flex gap-6 min-w-[1000px] h-full">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex-1 min-w-[320px] flex flex-col h-full">
              <div className={`flex items-center justify-between p-3 mb-4 rounded-xl border ${column.color}`}>
                <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground/80 pl-2">
                  {column.title}
                </h3>
                <span className="bg-white/50 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                  {tasksByStatus(column.id).length}
                </span>
              </div>
              
              <div className="space-y-3 flex-1">
                {tasksLoading ? (
                  <Skeleton className="h-24 w-full rounded-xl" />
                ) : (
                  <>
                    {tasksByStatus(column.id).map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                    {column.id === 'todo' && <CreateTaskDialog projectId={projectId} />}
                  </>
                )}
                
                {!tasksLoading && tasksByStatus(column.id).length === 0 && column.id !== 'todo' && (
                  <div className="text-center py-12 border-2 border-dashed border-border/60 rounded-xl">
                    <p className="text-sm text-muted-foreground">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
