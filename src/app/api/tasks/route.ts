import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json([]); // Retourne une liste vide si non connecté
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json([]);
    }
    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { dueDate: 'asc' }
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const tasks = await req.json();
    const createdTasks = await prisma.task.createMany({
      data: tasks.map((task: any) => ({
        title: task.title,
        assignedTo: task.assignedTo,
        dueDate: new Date(task.dueDate),
        completed: task.completed || false,
        userId: (session.user as any).id
      }))
    });

    return NextResponse.json({ message: 'Tâches ajoutées', count: createdTasks.count });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}