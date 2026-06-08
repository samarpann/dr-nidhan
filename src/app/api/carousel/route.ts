import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import CarouselSlide from '@/models/CarouselSlide';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');

    await connectToDatabase();
    
    let query = {};
    if (admin !== 'true') {
      query = { isActive: true };
    }

    const items = await CarouselSlide.find(query).sort({ orderIndex: 1, createdAt: -1 });
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToDatabase();
    
    const item = new CarouselSlide(data);
    await item.save();
    
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
