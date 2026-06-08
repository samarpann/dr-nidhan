import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-drnidan';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    const formattedEmail = email.trim().toLowerCase();
    
    // Check if user exists
    let user = await User.findOne({ email: formattedEmail });
    if (user) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Assign admin role if email is admin@drnidan.com
    const role = formattedEmail === 'admin@drnidan.com' ? 'admin' : 'user';

    user = new User({
      name: name.trim(),
      email: formattedEmail,
      password,
      role,
      isVerified: true // auto verify for local development
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return NextResponse.json({ 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
