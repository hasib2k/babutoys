import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: Request) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminPassword) {
      const provided = req.headers.get('x-admin-password') || '';
      if (provided !== adminPassword) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }

    // If DATABASE_URL is present, try Prisma
    if (process.env.DATABASE_URL) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const rows = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
        try { await prisma.$disconnect(); } catch (e) {}
        // Map createdAt to human readable string
        const formatted = rows.map((r: any) => ({
          ...r,
          createdAt: (new Date(r.createdAt)).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', ''),
        }));
        return NextResponse.json({ orders: formatted });
      } catch (e) {
        console.error('Prisma read failed, falling back to file', e);
      }
    }

    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'orders.json');
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      const orders = JSON.parse(raw || '[]');
      return NextResponse.json({ orders });
    } catch (e) {
      return NextResponse.json({ orders: [] });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
