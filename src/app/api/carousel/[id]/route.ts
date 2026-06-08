import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import CarouselSlide from '@/models/CarouselSlide';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    await connectToDatabase();
    
    const item = await CarouselSlide.findByIdAndUpdate(id, data, { new: true });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const item = await CarouselSlide.findByIdAndDelete(id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
