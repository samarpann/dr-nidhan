import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-drnidan';

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    await connectToDatabase();
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        phone: user.phone,
        address: user.address
      } 
    }, { status: 200 });
  } catch (error) {
    // Token might be invalid or expired
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

export async function DELETE() {
  (await cookies()).delete('token');
  return NextResponse.json({ success: true }, { status: 200 });
}
