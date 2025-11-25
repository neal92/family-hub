'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TasksList } from '@/components/tasks-list';
import { useTasks } from '@/contexts/tasks-context';

export default function TasksPage() {
  const { tasks } = useTasks();

  const allTasks = [...tasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  const todoTasks = allTasks.filter(task => !task.completed);
  const completedTasks = allTasks.filter(task => task.completed);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Tâches familiales" description="Assignez et suivez les corvées et les choses à faire.">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle tâche
        </Button>
      </PageHeader>

      <Tabs defaultValue="todo" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="todo">À faire ({todoTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Terminées ({completedTasks.length})</TabsTrigger>
          <TabsTrigger value="all">Toutes ({allTasks.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <TasksList tasks={allTasks} />
        </TabsContent>
        <TabsContent value="todo" className="mt-6">
          <TasksList tasks={todoTasks} />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <TasksList tasks={completedTasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
