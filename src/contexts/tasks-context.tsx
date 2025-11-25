'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from '@/lib/types';
import { tasks as initialTasks } from '@/lib/data';

interface TasksContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTasks: (newTasks: Task[]) => void;
  toggleTask: (taskId: string, completed: boolean) => void;
  deleteTask: (taskId: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

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
    <TasksContext.Provider value={{ tasks, setTasks, addTasks, toggleTask, deleteTask }}>
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
