import { prisma } from './prisma';

export async function getEventsByUser(userId: string) {
  return prisma.event.findMany({ where: { userId } });
}

export async function createEvent(data: {
  title: string;
  date: Date;
  description: string;
  userId: string;
}) {
  return prisma.event.create({ data });
}
