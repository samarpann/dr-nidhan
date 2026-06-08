import { NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-drnidan';

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      items, 
      shippingAddress, 
      subtotal, 
      shippingCharge = 0, 
      total, 
      notes 
    } = await req.json();

    // 1. Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret';
    const expectedSign = crypto
      .createHmac('sha256', secret)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ error: 'Invalid signature sent!' }, { status: 400 });
    }

    // 2. Connect to DB and verify user session
    await connectToDatabase();
    
    let userId;
    try {
      const token = (await cookies()).get('token')?.value;
      if (token) {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      }
    } catch (err) {
      console.warn('Failed to parse user JWT from checkout cookies, looking up customer by email');
    }

    // If userId is still not found, try to find a user with the email from shipping address or create a guest/default user
    if (!userId) {
      const email = shippingAddress.email || 'customer@gmail.com';
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        userId = existingUser._id;
      } else {
        // Create a user placeholder for checkout
        const newUser = new User({
          name: shippingAddress.name,
          email: email,
          role: 'user',
          isVerified: false
        });
        await newUser.save();
        userId = newUser._id;
      }
    }

    // 3. Format items and deduct stock
    const formattedItems = [];
    for (const item of items) {
      const productObj = await Product.findById(item.id);
      if (productObj) {
        // Deduct stock
        productObj.stock = Math.max(0, productObj.stock - item.quantity);
        await productObj.save();

        formattedItems.push({
          product: productObj._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || (productObj.images?.[0]?.url || '')
        });
      }
    }

    // 4. Create and save Order
    const newOrder = new Order({
      user: userId,
      items: formattedItems,
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode
      },
      paymentMethod: 'razorpay',
      razorpay: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature
      },
      paymentStatus: 'paid',
      orderStatus: 'processing',
      subtotal,
      shippingCharge,
      total,
      notes
    });

    await newOrder.save();

    return NextResponse.json({ message: 'Payment verified and order placed successfully', orderId: newOrder._id }, { status: 200 });
  } catch (error: any) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
