import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'your_razorpay_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret',
});

export async function POST(req: Request) {
  try {
    const { amount, currency = 'USD' } = await req.json();

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Razorpay Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
