import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import mongoose from 'mongoose';

export async function GET(request: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  try {
    await connectToDatabase();
    const { idOrSlug } = await params;

    let post;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      post = await BlogPost.findById(idOrSlug);
    } else {
      post = await BlogPost.findOne({ slug: idOrSlug });
    }

    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const { idOrSlug } = await params;
    const data = await request.json();
    await connectToDatabase();
    
    const post = await BlogPost.findByIdAndUpdate(idOrSlug, data, { new: true });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    
    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ idOrSlug: string }> }) {
  try {
    const { idOrSlug } = await params;
    await connectToDatabase();
    const post = await BlogPost.findByIdAndDelete(idOrSlug);
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
