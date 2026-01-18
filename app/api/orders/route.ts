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

function generateAlphaKey(existing: any[], len = 10) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const existingSet = new Set(existing.map(o => String(o.generatedKey || o.key || o.id || '')));
  for (let attempt = 0; attempt < 5000; attempt++) {
    let s = '';
    for (let i = 0; i < len; i++) s += letters[Math.floor(Math.random() * letters.length)];
    if (!existingSet.has(s)) return s;
  }
  // fallback
  return ('GEN' + Date.now()).slice(-len).toUpperCase();
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


    // generate an alphanumeric admin key and use it as the canonical order id
    const generatedKey = generateAlphaKey(orders, 10);

    const newOrder = {
      id: generatedKey,
      generatedKey,
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

    // If DATABASE_URL is provided, try saving to Prisma DB and also append to the local file
    if (process.env.DATABASE_URL) {
      try {
        // lazy require so deployments without Prisma client won't crash during build
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        const created = await prisma.order.create({
          data: {
            // explicitly set id to generatedKey so DB uses same key
            id: generatedKey,
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

        // Build a file-friendly order using DB id (coerce to numeric string if possible)
        const createdAtStr = formatDateForDisplay(created.createdAt || new Date());
        const fileOrder = {
          ...newOrder,
          id: generatedKey,
          generatedKey: newOrder.generatedKey,
          createdAt: createdAtStr,
        };

        // Avoid duplicating identical orders in the file (e.g., double-submit)
        const sameExists = orders.some((o: any) =>
          String(o.phone || '') === String(fileOrder.phone || '') &&
          String(o.address || '') === String(fileOrder.address || '') &&
          Number(o.total || 0) === Number(fileOrder.total || 0) &&
          String(o.customerName || '') === String(fileOrder.customerName || '')
        );
        if (!sameExists) {
          orders.push(fileOrder);
          await fs.writeFile(filePath, JSON.stringify(orders, null, 2), 'utf8');
        }

        try {
          await prisma.$disconnect();
        } catch (e) {}

        return NextResponse.json({ id: generatedKey, generatedKey: newOrder.generatedKey, message: 'Order saved to DB and file' }, { status: 201 });
      } catch (dbErr) {
        console.error('Prisma save failed, falling back to file', dbErr);
        // continue to write to file below
      }
    }

    // File-only fallback — avoid duplicates from double-submit
    const sameExistsFile = orders.some((o: any) =>
      String(o.phone || '') === String(newOrder.phone || '') &&
      String(o.address || '') === String(newOrder.address || '') &&
      Number(o.total || 0) === Number(newOrder.total || 0) &&
      String(o.customerName || '') === String(newOrder.customerName || '')
    );
    if (!sameExistsFile) {
      orders.push(newOrder);
      await fs.writeFile(filePath, JSON.stringify(orders, null, 2), 'utf8');
    }

    return NextResponse.json({ id: generatedKey, generatedKey: newOrder.generatedKey, message: 'Order saved locally' }, { status: 201 });
  } catch (error) {
    console.error('Create order error', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
