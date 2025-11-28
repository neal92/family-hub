import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { token, name, email, password, age } = await req.json();

    if (!token || !name || !email || !password) {
      return NextResponse.json({ error: 'Informations manquantes' }, { status: 400 });
    }

    // Vérifier le token d'invitation
    const invitation = await prisma.invitation.findUnique({
      where: { token }
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation non trouvée' }, { status: 404 });
    }

    if (invitation.used) {
      return NextResponse.json({ error: 'Cette invitation a déjà été utilisée' }, { status: 400 });
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Cette invitation a expiré' }, { status: 400 });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Un compte avec cet email existe déjà' }, { status: 400 });
    }

    // Validation du mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({
        error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
      }, { status: 400 });
    }

    // Créer l'utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        age: age ? parseInt(age) : null,
        role: 'member'
      }
    });

    // Marquer l'invitation comme utilisée
    await prisma.invitation.update({
      where: { token },
      data: { used: true }
    });

    return NextResponse.json({
      message: 'Compte créé avec succès',
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}