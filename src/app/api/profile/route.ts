import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-drnidan';

// GET Profile
export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    await connectToDatabase();
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// PUT Update Profile & Address or Password
export async function PUT(request: Request) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const data = await request.json();
    
    await connectToDatabase();
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if it's a password change request
    if (data.oldPassword && data.newPassword) {
      const isMatch = await user.comparePassword(data.oldPassword);
      if (!isMatch) {
        return NextResponse.json({ error: 'Incorrect old password' }, { status: 400 });
      }
      
      user.password = data.newPassword; // Will be hashed automatically by User schema pre-save hook
      await user.save();
      return NextResponse.json({ message: 'Password updated successfully' });
    }

    // Update Profile Fields
    if (data.name) user.name = data.name;
    if (data.phone) user.phone = data.phone;
    if (data.address) {
      user.address = {
        ...user.address,
        ...data.address
      };
    }

    await user.save();
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
