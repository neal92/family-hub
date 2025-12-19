import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        date: true,
        description: true,
        attendees: true,
      }
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, date, description, attendees } = await req.json();
    const event = await prisma.event.create({
      data: {
        title,
        date,
        description,
        attendees,
      }
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
