import { NextRequest, NextResponse } from 'next/server';
import { suggestMealIdeas } from '@/ai/flows/suggest-meal-ideas';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await suggestMealIdeas(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur inconnue' }, { status: 500 });
  }
}
