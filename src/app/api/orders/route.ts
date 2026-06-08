import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-drnidan';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Parse JWT from cookies to identify user
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const role = decoded.role;

    const { searchParams } = new URL(request.url);
    const adminMode = searchParams.get('admin') === 'true';

    let query = {};
    if (adminMode && role === 'admin') {
      // Admin sees all orders
      query = {};
    } else {
      // Users only see their own orders
      query = { user: userId };
    }

    const items = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase();

    // Verify token
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    data.user = decoded.id;

    const item = new Order(data);
    await item.save();

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
