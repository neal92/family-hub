import { tasks } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TasksList } from '@/components/tasks-list';

export default function TasksPage() {
  const allTasks = tasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  const todoTasks = allTasks.filter(task => !task.completed);
  const completedTasks = allTasks.filter(task => task.completed);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Family Tasks" description="Assign and track chores and to-dos.">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </PageHeader>

      <Tabs defaultValue="todo" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="todo">To-Do ({todoTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          <TabsTrigger value="all">All ({allTasks.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <TasksList initialTasks={allTasks} />
        </TabsContent>
        <TabsContent value="todo" className="mt-6">
          <TasksList initialTasks={todoTasks} />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <TasksList initialTasks={completedTasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
