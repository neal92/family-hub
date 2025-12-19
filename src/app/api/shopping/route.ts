import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.shoppingItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const items = await prisma.shoppingItem.findMany({
      select: {
        id: true,
        name: true,
        purchased: true,
      }
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const item = await prisma.shoppingItem.create({
      data: {
        name,
        purchased: false,
      }
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  } 
}

export async function PATCH(req: Request) {
  try {
    const { id, purchased } = await req.json();
    const item = await prisma.shoppingItem.update({
      where: { id },
      data: { purchased },
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
