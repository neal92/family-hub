'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '@/lib/types';
import { useSession } from 'next-auth/react';

interface TasksContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTasks: (newTasks: Task[]) => void;
  toggleTask: (taskId: string, completed: boolean) => void;
  deleteTask: (taskId: string) => void;
  loading: boolean;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch('/api/tasks')
        .then(res => res.json())
        .then(data => {
          const tasksWithDates = data.map((task: any) => ({
            ...task,
            dueDate: new Date(task.dueDate)
          }));
          setTasks(tasksWithDates);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  const addTasks = (newTasks: Task[]) => {
    setTasks(prevTasks => [...prevTasks, ...newTasks]);
  };
  
  const toggleTask = (taskId: string, completed: boolean) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    <TasksContext.Provider value={{ tasks, setTasks, addTasks, toggleTask, deleteTask, loading }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
