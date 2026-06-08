import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
      }
      return NextResponse.json({ message: 'Successfully subscribed' }, { status: 200 });
    }

    const sub = new Newsletter({ email: email.toLowerCase().trim() });
    await sub.save();

    return NextResponse.json({ message: 'Successfully subscribed' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
