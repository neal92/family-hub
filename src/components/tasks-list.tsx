"use client";

import { useState } from 'react';
import type { Task, User } from '@/lib/types';
import { familyMembers as allFamilyMembers } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type TasksListProps = {
  initialTasks: Task[];
};

export function TasksList({ initialTasks }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleTaskCompletion = (taskId: string, completed: boolean) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, completed } : task));
  };

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
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskCompletion(task.id, !!checked)}
                    className="h-5 w-5"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`task-${task.id}`}
                      className={cn(
                        "font-medium cursor-pointer",
                        task.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {task.title}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Due: {format(task.dueDate, 'MMM d, yyyy')}
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
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
