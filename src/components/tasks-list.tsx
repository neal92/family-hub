"use client";

import type { Task } from '@/lib/types';
import { familyMembers as allFamilyMembers } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '@/contexts/tasks-context';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

type TasksListProps = {
  tasks: Task[];
};

export function TasksList({ tasks }: TasksListProps) {
  const { toggleTask, deleteTask } = useTasks();

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tasks.map(task => {
          const member = allFamilyMembers.find(m => m.id === task.assignedTo);
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
              layout
            >
              <Card className={cn(
                "transition-all",
                task.completed ? "bg-muted/60" : "bg-card"
              )}>
                <CardContent className="p-4 flex items-center gap-4">
                  <Checkbox
                    id={`task-list-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={(checked) => toggleTask(task.id, !!checked)}
                    className="h-5 w-5"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`task-list-${task.id}`}
                      className={cn(
                        "font-medium cursor-pointer",
                        task.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {task.title}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Échéance: {format(task.dueDate, 'd MMM yyyy', { locale: fr })}
                    </p>
                  </div>
                  {member && (
                    <div className="flex items-center gap-2">
                       <span className="text-sm hidden sm:inline">{member.name}</span>
                       <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                   {task.completed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => deleteTask(task.id)}
                      aria-label="Supprimer la tâche"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
