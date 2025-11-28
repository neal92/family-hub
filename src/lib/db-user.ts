import { prisma } from './prisma';

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  age?: number;
  skills?: string;
  availability?: string;
  role?: string;
}) {
  return prisma.user.create({ data });
}
