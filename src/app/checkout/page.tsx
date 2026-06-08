'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingBag, CreditCard, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Autofill if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        street: user.address?.street || prev.street,
        city: user.address?.city || prev.city,
        state: user.address?.state || prev.state,
        pincode: user.address?.pincode || prev.pincode,
      }));
    }
  }, [user]);

  // If cart is empty, redirect to cart. If not logged in, redirect to login.
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/checkout');
      } else if (cart.length === 0) {
        router.push('/cart');
      }
    }
  }, [cart, authLoading, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Load Razorpay Script
      if (!(window as any).Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      // 2. Create Razorpay order on backend
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal, currency: 'INR' })
      });
      
      if (!res.ok) {
        throw new Error('Failed to initiate Razorpay checkout');
      }
      
      const orderData = await res.json();

      // 3. Open Razorpay payment modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'your_razorpay_key_id',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Dr. Nidan',
        description: cart.map(item => `${item.name} x${item.quantity}`).join(', '),
        image: '/product image/nasha mukti.jpeg',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // 4. Verify payment on backend and save order
            const verifyRes = await fetch('/api/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: cart,
                shippingAddress: formData,
                subtotal: cartTotal,
                shippingCharge: 0,
                total: cartTotal,
                notes: formData.notes
              })
            });

            if (verifyRes.ok) {
              const verifyData = await verifyRes.json();
              clearCart();
              router.push(`/checkout/success?orderId=${verifyData.orderId}`);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Error during payment verification:', err);
            alert('Verification process failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#2E7D32'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'Could not initiate payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FFF9]">
        <Loader2 className="w-10 h-10 text-[#2E7D32] animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-[#F9FFF9] min-h-screen text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-[#555555] mb-8 font-medium">
          <Link href="/cart" className="hover:text-[#2E7D32]">Cart</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#2E7D32]">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Shipping Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-2xl border border-[#2E7D32]/10 shadow-xs">
            <h2 className="text-2xl font-display font-bold text-[#1B5E20] mb-8 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#F9FFF9] border border-[#2E7D32]/20 flex items-center justify-center text-sm font-bold text-[#2E7D32] mr-3">1</span>
              Shipping Address
            </h2>

            <form onSubmit={handlePayment} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Recipient Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    placeholder="6-digit PIN code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] mb-3"
                  placeholder="Flat, House no., Building, Company, Apartment"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    placeholder="Town / City"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32]"
                    placeholder="State"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">Delivery Instructions / Notes</label>
                <textarea
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2E7D32] resize-none"
                  placeholder="Notes about your order (e.g. special instructions for delivery)"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold rounded-lg text-sm shadow-sm transition-all hover:scale-[1.01] flex items-center justify-center space-x-2 disabled:opacity-75"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4.5 h-4.5" />
                    <span>Pay with Razorpay (₹{cartTotal.toFixed(2)})</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Checkout Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-[#2E7D32]/10 shadow-xs">
              <h2 className="text-xl font-display font-bold text-[#1B5E20] border-b border-gray-100 pb-4 mb-6">
                Your Order
              </h2>

              <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-2 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#F9FFF9] rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center p-1.5 shrink-0">
                        <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                        <span className="text-xs text-[#555555]">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#2E7D32]">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-4 text-sm">
                <div className="flex justify-between text-[#555555]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1A1A1A]">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#555555]">
                  <span>Shipping</span>
                  <span className="text-[#2E7D32] font-semibold">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between text-base font-bold text-[#1B5E20]">
                  <span>Total Amount</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FFF8E1] border border-[#F9A825]/20 p-6 rounded-xl flex items-start space-x-3 text-xs text-[#F9A825] font-semibold leading-relaxed">
              <span>🔒 Security Note:</span>
              <p>Your payment details are encrypted and processed securely by Razorpay. We do not store your credit card or netbanking credentials on our servers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
