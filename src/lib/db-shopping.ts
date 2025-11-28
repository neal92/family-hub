import { prisma } from './prisma';

export async function getShoppingItemsByUser(userId: string) {
  return prisma.shoppingItem.findMany({ where: { userId } });
}

export async function createShoppingItem(data: {
  name: string;
  category: string;
  purchased?: boolean;
  userId: string;
}) {
  return prisma.shoppingItem.create({ data });
}

export async function updateShoppingItem(id: string, data: Partial<{ name: string; category: string; purchased: boolean; }>) {
  return prisma.shoppingItem.update({ where: { id }, data });
}

export async function deleteShoppingItem(id: string) {
  return prisma.shoppingItem.delete({ where: { id } });
}
