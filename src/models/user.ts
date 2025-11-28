// Type Prisma User
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function findUserByEmail(email: string): Promise<User | null> {
  if (!email) throw new Error("Email requis");
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: string, password: string, name?: string, age?: number): Promise<User> {
  if (!email || !password) throw new Error("Email et mot de passe requis");
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Utilisateur déjà existant");
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { email, password: hashed, name: name ?? "", age },
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}
