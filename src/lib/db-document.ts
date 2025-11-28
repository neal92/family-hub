import { prisma } from './prisma';

export async function getDocumentsByUser(userId: string) {
  return prisma.document.findMany({ where: { userId } });
}

export async function createDocument(data: {
  name: string;
  category: string;
  dateAdded: Date;
  userId: string;
}) {
  return prisma.document.create({ data });
}
