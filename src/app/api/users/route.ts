export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, email, name, age, skills } = body;
    if (!id && !email) {
      return NextResponse.json({ error: 'Paramètre id ou email requis' }, { status: 400 });
    }
    const user = await prisma.user.findFirst({
      where: id ? { id } : { email },
    });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        age,
        skills,
      },
    });
    return NextResponse.json({ message: 'Profil mis à jour', user: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const email = searchParams.get('email');
  if (!id && !email) {
    return NextResponse.json({ error: 'Paramètre id ou email requis' }, { status: 400 });
  }
  try {
    const user = await prisma.user.findFirst({
      where: id ? { id } : { email },
      select: { id: true, name: true, email: true, avatarUrl: true, age: true, skills: true, role: true }
    });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
