import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcrypt';

async function createAdmin() {
  try {
    const hashed = await bcrypt.hash('Admin123!', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: { role: 'admin' },
      create: {
        email: 'admin@example.com',
        password: hashed,
        name: 'Admin',
        age: 30,
        role: 'admin'
      },
    });
    console.log('Admin user created/updated:', admin);
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();