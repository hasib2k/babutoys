import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';


function getNextId(orders: any[]) {
  // compute max numeric id among existing orders, ignore non-numeric ids
  let max = 0;
  for (const o of orders) {
    const n = parseInt(String(o.id), 10);
    if (!isNaN(n) && n > max) max = n;
  }
  return String(max + 1);
}

function formatDateForDisplay(d = new Date()) {
  const dt = new Date(d);
  const day = String(dt.getDate()).padStart(2, '0');
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const year = dt.getFullYear();
  let hours = dt.getHours();
  const minutes = String(dt.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const hourStr = String(hours).padStart(2, '0');
  return `${day}-${month}-${year}, ${hourStr}:${minutes} ${ampm}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      productName,
      price,
      originalPrice,
      quantity,
      shipping,
      total,
      area,
      customerName,
      phone,
      address,
    } = body || {};

    if (!customerName || !phone || !address) {
      return NextResponse.json({ message: 'Missing customer information' }, { status: 400 });
    }

    // Save to local JSON file as a simple DB fallback
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    const filePath = path.join(dataDir, 'orders.json');

    let orders: any[] = [];
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      orders = JSON.parse(raw || '[]');
    } catch (e) {
      orders = [];
    }


    const id = getNextId(orders);

    const newOrder = {
      id,
      productName: productName || 'Unknown',
      price: Math.floor(price) || 0,
      originalPrice: Math.floor(originalPrice) || null,
      quantity: Math.floor(quantity) || 1,
      shipping: Math.floor(shipping) || 0,
      total: Math.floor(total) || 0,
      area: area || 'inside',
      customerName,
      phone,
      address,
      status: 'pending',
      createdAt: formatDateForDisplay(new Date()),
    };

    // If DATABASE_URL is provided, try saving to Prisma DB (Postgres/SQLite). Otherwise fallback to local JSON file.
    if (process.env.DATABASE_URL) {
      try {
        // lazy require so deployments without Prisma client won't crash during build
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        const created = await prisma.order.create({
          data: {
            id: String(id),
            productName: newOrder.productName,
            price: newOrder.price,
            quantity: newOrder.quantity,
            shipping: newOrder.shipping,
            total: newOrder.total,
            area: newOrder.area,
            customerName: newOrder.customerName,
            phone: newOrder.phone,
            address: newOrder.address,
            status: newOrder.status,
            createdAt: new Date(),
          },
        });

        try {
          await prisma.$disconnect();
        } catch (e) {}

        return NextResponse.json({ id: created.id, message: 'Order saved to DB' }, { status: 201 });
      } catch (dbErr) {
        console.error('Prisma save failed, falling back to file', dbErr);
      }
    }

    orders.push(newOrder);
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2), 'utf8');

    return NextResponse.json({ id, message: 'Order saved locally' }, { status: 201 });
  } catch (error) {
    console.error('Create order error', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
