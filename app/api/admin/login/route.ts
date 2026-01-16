import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json().catch(() => ({}));
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ message: 'Admin password not configured on server' }, { status: 500 });
    }
    if (!password) {
      return NextResponse.json({ message: 'Missing password' }, { status: 400 });
    }
    if (password === adminPassword) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
  } catch (e) {
    console.error('Login error', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
