import { NextResponse } from "next/server";
import { registerUser } from "@/controllers/authController";

export async function POST(req: Request) {
  try {
    const { email, password, name, age } = await req.json();
    const user = await registerUser({ email, password, name, age: age ? parseInt(age) : undefined });
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
