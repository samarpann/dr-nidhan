import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SalesNetwork from '@/models/SalesNetwork';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const network = await SalesNetwork.find({ isActive: true }).sort({ state: 1, city: 1 });
    return NextResponse.json(network);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase();

    const record = new SalesNetwork(data);
    await record.save();

    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
