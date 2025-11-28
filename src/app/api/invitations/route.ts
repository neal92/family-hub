import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier que l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Générer un token unique
    const token = crypto.randomBytes(32).toString('hex');

    // Créer l'invitation dans la base de données
    const invitation = await prisma.invitation.create({
      data: {
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expire dans 7 jours
        createdBy: session.user.email
      }
    });

    return NextResponse.json({ token: invitation.token });
  } catch (error) {
    console.error('Erreur lors de la création de l\'invitation:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}