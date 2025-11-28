import { prisma } from './prisma';

export async function getTasksByUser(userId: string) {
  return prisma.task.findMany({ where: { userId } });
}

export async function createTask(data: {
  title: string;
  assignedTo: string;
  dueDate: Date;
  completed?: boolean;
  userId: string;
}) {
  return prisma.task.create({ data });
}

export async function updateTask(id: string, data: Partial<{ title: string; assignedTo: string; dueDate: Date; completed: boolean; }>) {
  return prisma.task.update({ where: { id }, data });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({ where: { id } });
}
